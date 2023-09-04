<script setup lang="ts">
import chain from '@/common/lib/chain';
import { Wallet } from '@/types/wallet';
import { Permission } from 'eosjs/dist/eosjs-rpc-interfaces';

interface Params {
    account: Wallet;
    perms: Permission[];
    authType: string;
    operateType: string;
    oldOperateKey: string;
}
let perms = ref([] as Permission[]);

const route = useRoute();
const account = ref(JSON.parse(route.query.account + '') as Wallet);

// 初始化
const walletStore = useWalletStore();
const permissions = ref([] as string[]);

const currentKey = computed(() => walletStore.currentWallet.keys[0].publicKey );
onBeforeMount(() => {
    let perms = new Set();
    for (const key of walletStore.currentWallet.keys) {
        for (const perm of key.permissions) {
            perms.add(perm);
        }
    }
    permissions.value = Array.from(perms) as string[];
});

onMounted(async () => {
    let result = await chain.fetchPermissions(walletStore.currentWallet.name, walletStore.currentWallet.chainId);

    if (result.code != 200) return window.msg.error(result.msg);

    perms.value = result.permissions;
});

// 跳转操作
const router = useRouter();
const chainId = ref(route.query.chainId + '');
const viewAccountChange = (authType: string, operateType: string, oldOperateKey?: string) => {
    let params = {} as Params;
    params.account = account.value;
    params.perms = perms.value;
    params.authType = authType;
    params.operateType = operateType;
    if (oldOperateKey) params.oldOperateKey = oldOperateKey;

    router.push({
        name: 'account-change',
        query: { params: JSON.stringify(params), chainId: chainId.value },
    });
};

// 移除操作
const { t } = useI18n();
const handleRemove = async (
    perms: any,
    authType: string,
    operateType: string,
    oldOperateKey: string,
    walletAuthType: string,
    newOperateKey?: string
) => {
    let newPerms = await chain
        .getApi(chainId.value)
        .updateNewPermissions(perms, authType, operateType, oldOperateKey, newOperateKey);
    try {
        await chain
            .getApi(chainId.value)
            .updatePerms(account.value, newPerms, chain.getAuthByAccount(account.value.name, walletAuthType));
        perms = newPerms;
        window.msg.success(t('public.executeSuccess'));
    } catch (e) {
        window.msg.error(chain.getErrorMsg(e));
    }
};

/** owner */
const ownersArray = computed(() => {
    if (perms) {
        for (let i = 0; i < perms.value.length; i++) {
            if (perms.value[i].perm_name == 'owner') return perms.value[i].required_auth.keys;
        }
    }
    return [];
});

const hiddenRemoveOwnerBtn = computed(() => {
    return ownersArray.value.length > 1 ? true : false;
});

// 移除所有者
const handleOrderRemove = (oldOperateKey: string) => {
    window.dialog.warning({
        title: t('public.tip'),
        content: t('setting.confirmRemove'),
        positiveText: t('public.ok'),
        negativeText: t('public.cancel'),
        onPositiveClick: () => {
            handleRemove(perms, 'owner', 'remove', oldOperateKey, 'owner');
        },
        onNegativeClick: () => {},
    });
};

/** active */
const activesArray = computed(() => {
    if (perms) {
        for (let i = 0; i < perms.value.length; i++) {
            if (perms.value[i].perm_name == 'active') return perms.value[i].required_auth.keys;
        }
        return [];
    } else return [];
});
const hiddenRemoveActiveBtn = computed(() => {
    return activesArray.value.length > 1 ? true : false;
});

// 移除激活项
const walleAuthType = computed(() => {
    if (permissions.value.indexOf('owner') > -1) {
        return 'owner';
    } else {
        return 'active';
    }
});
const handleActiveRemove = (oldOperateKey: string) => {
    window.dialog.warning({
        title: t('public.tip'),
        content: t('setting.confirmRemove'),
        positiveText: t('public.ok'),
        negativeText: t('public.cancel'),
        onPositiveClick: () => {
            handleRemove(perms, 'active', 'remove', oldOperateKey, walleAuthType.value);
        },
        onNegativeClick: () => {},
    });
};

// 移除账号
const showPasswordConfirm = ref(false);
const removeAccountClicked = () => {
    const index = useWalletStore().wallets.findIndex((item) => {
        return item.name === account.value.name && item.chainId === chainId.value;
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
    //     return item.chainId === walletStore.currentWallet.chainId;
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
                                <div class="account-name-right">{{ account.name }}</div>
                            </div>

                            <!-- type -->
                            <div class="account-type">
                                <div class="account-type-left">Owner</div>
                                <img
                                    @click="viewAccountChange('owner', 'add')"
                                    class="account-type-right"
                                    src="@/assets/images/authority_manager_add@2x.png"
                                    v-if="walleAuthType === 'owner'"
                                />
                            </div>

                            <!-- owner list -->
                            <div class="account-cell" v-for="(item, index) of ownersArray" :key="index">
                                <!-- key -->
                                <div class="account-cell-key">
                                    <clip-button class="account-left-name" :value="item.key"></clip-button>
                                </div>

                                <!-- options -->
                                <div class="account-cell-buttons items-center">
                                    <div class="mt-[3px]">
                                        <span class="account-current" v-if="item.key == currentKey">
                                            {{ $t('setting.currentAccount') }}
                                        </span>
                                    </div>

                                    <div class="bottom-buttons">
                                        <!-- modify -->
                                        <div
                                            @click="viewAccountChange('owner', 'modify', item.key)"
                                            class="account-change-btn"
                                            v-if="permissions.indexOf('owner') > -1"
                                        >
                                            {{ $t('setting.modify') }}
                                        </div>
                                        <!-- remove -->
                                        <div
                                            @click="handleOrderRemove(item.key)"
                                            class="account-change-btn"
                                            v-if="hiddenRemoveOwnerBtn && permissions.indexOf('owner') > -1"
                                        >
                                            {{ $t('setting.remove') }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- active add -->
                            <div class="account-type">
                                <div class="account-type-left">Active</div>
                                <div class="account-cell-right">
                                    <img
                                        @click="viewAccountChange('active', 'add')"
                                        class="account-type-right"
                                        src="@/assets/images/authority_manager_add@2x.png"
                                    />
                                </div>
                            </div>

                            <!-- active list -->
                            <div class="account-cell" :key="item.key" v-for="item in activesArray">
                                <!-- key -->
                                <div class="account-cell-key">
                                    <clip-button class="account-left-name" :value="item.key"></clip-button>
                                </div>

                                <!-- optinos -->
                                <div class="account-cell-buttons">
                                    <div class="account-current" v-if="item.key == currentKey">
                                        {{ $t('setting.currentAccount') }}
                                    </div>

                                    <div class="bottom-buttons">
                                        <!-- modify -->
                                        <div
                                            @click="viewAccountChange('active', 'modify', item.key)"
                                            class="account-change-btn"
                                        >
                                            {{ $t('setting.modify') }}
                                        </div>
                                        <!-- remove -->
                                        <div
                                            @click="handleActiveRemove(item.key)"
                                            class="account-change-btn"
                                            v-if="hiddenRemoveActiveBtn"
                                        >
                                            {{ $t('setting.remove') }}
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
                                @confirm="removeAccountClicked"
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
