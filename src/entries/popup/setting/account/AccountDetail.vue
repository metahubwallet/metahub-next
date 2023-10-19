<script setup lang="ts">
import chain from '@/common/lib/chain';
import { isValidPublic } from '@/common/lib/keyring';
import { Permission, KeyWeight } from 'eosjs/dist/eosjs-rpc-interfaces';
import { decrypt, md5 } from '@/common/util/crypto';

interface UpdateParams {
    account: string;
    perms: Permission[];
    operatePerm: string;
    operateType: string;
    oldOperateKey?: string;
}
const allPerms = ref([] as Permission[]);

const route = useRoute();
const router = useRouter();
const walletStore = useWalletStore();

const account = route.query.account + '';
const chainId = route.query.chainId + '';

const currentIdx = ref(walletStore.wallets.findIndex(x => x.name == account && x.chainId == chainId));
const currentWallet = computed(() => walletStore.wallets[currentIdx.value >= 0 ? currentIdx.value : 0] );
const currentKeys = computed(() => currentWallet.value.keys.map(x => x.publicKey) );
const currentPerms = computed(() => currentWallet.value.keys.flatMap(x => x.permissions) );

const showPrivateKey = ref(0);
const showKeyText = ref('');

onMounted(async () => {
    if (currentIdx.value == -1) {
        router.back();
        return;
    }

    console.log('onMounted...');

    const result = await chain.fetchPermissions(currentWallet.value.name, currentWallet.value.chainId);

    if (result.code != 200) {
        window.msg.error(result.msg);
        router.back();
    }

    const owner = result.permissions.find(x => x.perm_name == 'owner')!;
    const active = result.permissions.find(x => x.perm_name == 'active')!;
    allPerms.value = [ owner, active, ...result.permissions.filter(x => x.perm_name != 'owner' && x.perm_name != 'active')];
});

// 跳转操作
const viewAccountChange = (operatePerm: string, operateType: string, oldOperateKey?: string) => {
    let params: UpdateParams = {
        account,
        perms: allPerms.value,
        operatePerm,
        operateType,
        oldOperateKey,
    };

    router.push({
        name: 'account-change',
        query: { params: JSON.stringify(params), chainId },
    });
};

const viewPrivateKey = (key: string) => {
    showPrivateKey.value = 1;
    showKeyText.value = key;
}

const confirmViewPrivateKey = (password: string) => {
    if (isValidPublic(showKeyText.value)) {
        const pk = currentWallet.value.keys.find(x => x.publicKey == showKeyText.value)!.privateKey;
        showKeyText.value = decrypt(pk, md5(currentWallet.value.seed + password));
    }
    showPrivateKey.value = 2;
}

// 移除操作
const { t } = useI18n();

const doRemoveKey = async (operatePerm: string, key: string) => {
    let newPerms = await chain
        .getApi(chainId)
        .makeNewPermissions(allPerms.value, 'remove', operatePerm, key);
    try {
        const updatePerms = newPerms.filter((x: any) => x.perm_name == operatePerm);
        await chain
            .getApi(chainId)
            .updatePerms(account, updatePerms);
        allPerms.value = newPerms;
        window.msg.success(t('public.executeSuccess'));
    } catch (e) {
        window.msg.error(chain.getErrorMsg(e));
    }
};

const isCanModify = (_perm: string, perm_parent: string) => {
    if (currentPerms.value.includes('owner') || currentPerms.value.includes(perm_parent)) {
        return true;
    }
    return false;
};

const isCanDelete = (perm: string) => {
    const selPerm = allPerms.value.find(x => x.perm_name == perm)!;
    return (perm == 'owner' || perm == 'active') && selPerm.required_auth.keys.length <= 1 ? false : true;
};


// 移除所有者
const handleRemoveKey = (oldOperateKey: string) => {
    window.dialog.warning({
        title: t('public.tip'),
        content: t('setting.confirmRemove'),
        positiveText: t('public.ok'),
        negativeText: t('public.cancel'),
        onPositiveClick: () => {
            doRemoveKey('owner', oldOperateKey);
        },
        onNegativeClick: () => {},
    });
};

// 移除账号
const showPasswordConfirm = ref(false);

const handleRemoveAccount = () => {
    const index = useWalletStore().wallets.findIndex((item) => {
        return item.name === account && item.chainId === chainId;
    });
    walletStore.wallets.splice(index, 1);
    walletStore.setWallets(walletStore.wallets);

    // 无账号
    if (walletStore.wallets.length === 0) {
        walletStore.setSelectedIndex(0);
        window.msg.success(t('password.deleteSuccess'));
        router.push({ name: 'index' });
        return;
    }

    // 存在其它账号
    let firstIndex = walletStore.wallets.indexOf(walletStore.wallets[0]);
    walletStore.setSelectedIndex(firstIndex >= 0 ? firstIndex : 0);
    // const network = useChainStore().networks.find((item) => {
    //     return item.chainId === currentWallet.value.chainId;
    // });
    // if (network) {
    //     useChainStore().setCurrentNetwork(network);
    // }
    window.msg.success(t('password.deleteSuccess'));
    router.go(-1);
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.authorityManage')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar>
                    <div class="container">
                        <!-- account info -->
                        <div class="account-info">
                            <!-- name -->
                            <div class="account-name">
                                <div class="account-name-left">{{ $t('setting.accountName') }}</div>
                                <div class="account-name-right">{{ account }}</div>
                            </div>

                            <div v-for="perm of allPerms" :key="perm.perm_name">
                                <!-- type -->
                                <div class="account-type">
                                    <div class="account-type-left">{{ perm.perm_name }}</div>
                                    <img
                                        @click="viewAccountChange(perm.perm_name, 'add')"
                                        class="account-type-right"
                                        src="@/assets/images/authority_manager_add@2x.png"
                                        v-if="currentPerms.includes('owner')"
                                    />
                                </div>

                                <!-- owner list -->
                                <div class="account-cell" v-for="(item, index) of perm.required_auth.keys" :key="index">
                                    <!-- key -->
                                    <div class="account-cell-key">
                                        <clip-button class="account-left-name" :value="item.key"></clip-button>
                                    </div>

                                    <!-- options -->
                                    <div class="account-cell-buttons items-center">
                                        <div class="mt-[3px]">
                                            <span class="account-current" v-if="currentKeys.includes(item.key)">
                                                {{ $t('setting.currentAccount') }}
                                            </span>
                                        </div>

                                        <div class="bottom-buttons">
                                            <!-- view key -->
                                            <div
                                                @click="viewPrivateKey(item.key)"
                                                class="account-change-btn"
                                            >
                                                {{ $t('setting.showKey') }}
                                            </div>

                                            <!-- modify -->
                                            <div
                                                @click="viewAccountChange(perm.perm_name, 'modify', item.key)"
                                                class="account-change-btn"
                                                v-if="isCanModify(perm.perm_name, perm.parent)"
                                            >
                                                {{ $t('setting.modify') }}
                                            </div>
                                            <!-- remove -->
                                            <div
                                                @click="handleRemoveKey(item.key)"
                                                class="account-change-btn"
                                                v-if="isCanDelete(perm.perm_name) && currentPerms.includes(perm.perm_name)"
                                            >
                                                {{ $t('setting.remove') }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <!-- remove account -->
                        <div class="account-buttons">
                            <n-button @click="showPasswordConfirm = true" class="account-delete-button">
                                {{ $t('setting.removeWallet') }}
                            </n-button>
                            <password-confirm
                                :is-show="showPasswordConfirm"
                                :title="$t('setting.confirmDestroy')"
                                @close="showPasswordConfirm = false"
                                @confirm="handleRemoveAccount"
                            ></password-confirm>
                        </div>

                        <!-- tip -->
                        <div class="account-tip">
                            <div class="account-tip-one">{{ $t('setting.notice') }}</div>
                            <div class="account-tip-one">- {{ $t('setting.ownerNotice') }}</div>
                            <div class="account-tip-one">- {{ $t('setting.activeNotice') }}</div>
                            <div class="account-tip-one">- {{ $t('setting.securityNotice') }}</div>
                        </div>
                    </div>
                </n-scrollbar>
            </div>

            <password-confirm
                :is-show="showPrivateKey == 1"
                :title="$t('setting.confirmPassword')"
                @close="showPrivateKey = 0"
                @confirm="p => confirmViewPrivateKey(p)"
            ></password-confirm>

            <modal
                :is-show="showPrivateKey == 2"
                :show-cancel="false"
                :title="$t('setting.showKey')"
                @close="showPrivateKey=0;showKeyText='';"
                @submit="showPrivateKey=0;showKeyText='';"
            >
                <!-- old password -->
                <div class="dialog-title">
                    {{ $t('public.privateKey') }}
                </div>
                <n-input
                    class="mb-3"
                    type="textarea"
                    v-model:value="showKeyText"
                    :placeholder="$t('public.privateKey')"
                ></n-input>


            </modal>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.account-info {
    .account-name {
        height: 50px;
        color: #333;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;

        border-bottom: $color-separate 1px solid;
    }

    .account-type {
        margin-top: 10px;
        height: 36px;
        padding: 0 15px;
        color: #333;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .account-type-right {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
    }

    .account-cell {
        background: #f3f3f3;
        border-radius: 6px;
        margin: 0 15px 10px;
        padding: 15px 10px 10px;
        line-height: 18px;
        .account-cell-key {
            font-size: 14px;
            color: #666666;
            word-wrap: break-word;
            margin-bottom: 5px;
        }
        .account-cell-key-copy {
            height: 14px;
            width: 14px;
            cursor: pointer;
        }

        .account-cell-buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #ffffff;
            .account-current {
                font-size: 12px;
                color: $color-primary;
                font-weight: 400;
                border: 1px solid $color-primary;
                border-radius: 3px;
                padding: 0px 3px;
            }
            .account-change-btn {
                background-color: $color-primary;
                border-radius: 12px;
                height: 24px;
                padding: 0 12px;
                line-height: 24px;
                cursor: pointer;
                margin-left: 10px;
                font-weight: 400;
            }
            .bottom-buttons {
                display: flex;
                flex-direction: row-reverse;
                align-items: center;
            }
        }
    }
}

.account-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 20px 0px;
    .account-delete-button {
        background: #e81818;
        border-radius: 6px;
        font-size: 15px;
        color: white;
        width: 144px;
        height: 40px;
    }
}

.account-tip {
    font-size: 14px;
    color: #666;
    margin: 15px;
    margin-top: 30px;
    .account-tip-one {
        margin-top: 6px;
    }
}
</style>
