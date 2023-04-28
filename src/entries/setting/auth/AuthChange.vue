<script lang="ts" setup>
import chain from '@/common/libs/chain';

const route = useRoute();
const params: any = route.query.params;
const chainId = ref<any>(route.query.chainId);
const account = ref(params?.account);
const newOperateKey = ref('');
const perms = ref(params?.perms);
const authType = ref(params?.authType);
const operateType = ref(params?.operateType);
const oldOperateKey = ref(params?.oldOperateKey);
const dialogVisible = ref(false);
const publicKey = ref('');
const privateKey = ref('');
const dialogLoading = ref(true);
const loading = ref(false);
const permissions = ref<any[]>([]);

const walleAuthType = computed(() => {
    if (permissions.value.indexOf('owner' as never) > -1) return 'owner';
    else return 'active';
});

onBeforeMount(() => {
    const ps = new Set();
    for (const key of account.value.keys) {
        for (const perm of key.ps) {
            ps.add(perm);
        }
    }
    permissions.value = Array.from(ps);
});

const useItClicked = (publicKey: string) => {
    newOperateKey.value = publicKey;
    dialogVisible.value = false;
};

const generateKeyClicked = async () => {
    dialogVisible.value = true;
    dialogLoading.value = true;
    let keypair = await chain.get(chainId.value).getRandomPairKey();
    if (keypair) {
        dialogLoading.value = false;
        publicKey.value = keypair.publicKey;
        privateKey.value = keypair.privateKey;
    }
};

const clip = (value: any) => {
    window.clip(value);
};

const { t } = useI18n();
const onSubmit = async () => {
    if (!chain.get(chainId.value).isValidPublic(newOperateKey.value))
        return window.msg.error(t('setting.invalidPublicKey'));
    loading.value = true;
    let newPerms = chain.get(chainId.value).updateNewPermissions(
        perms.value,
        authType.value, // active or others
        operateType.value, // modify or add
        oldOperateKey.value, // pubkey
        newOperateKey.value // pubkey
    );
    newPerms = newPerms.filter((x: any) => x.perm_name == authType.value);
    try {
        let result = await chain
            .get(chainId.value)
            .updatePerms(
                account.value,
                newPerms,
                chain.getAuthByAccount(account.value.name, walleAuthType.value)
            );
        loading.value = false;
        perms.value = newPerms;
        window.msg.success(t('public.executeSuccess'));
    } catch (e) {
        loading.value = false;
        window.msg.success(chain.getErrorMsg(e));
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle
                :back-text="$t('auth.back')"
                :title="$t('setting.changeAuthority')"
            ></top-handle>
            <div class="cover-content _effect">
                <div class="container" v-loading="loading">
                    <div class="account-cell-title" v-if="oldOperateKey">
                        {{ $t('setting.currentPublicKey') }}
                    </div>
                    <div class="account-cell-key" v-if="oldOperateKey">{{ oldOperateKey }}</div>
                    <div class="account-cell-title">{{ $t('setting.newPublicKey') }}</div>

                    <el-input
                        :placeholder="$t('setting.enterPublicKeyTip')"
                        class="account-cell-new-key"
                        type="textarea"
                        v-model="newOperateKey"
                    ></el-input>

                    <div class="account-buttons">
                        <div @click="generateKeyClicked" class="generate-button">
                            {{ $t('setting.generatePublicKey') }}
                        </div>
                    </div>

                    <el-button type="primary" @click="onSubmit" class="submiit-button">
                        {{ $t('setting.submit') }}
                    </el-button>

                    <div class="account-tip">
                        <div class="account-tip-one">{{ $t('setting.notice') }}</div>
                        <div class="account-tip-one">- {{ $t('setting.changeNoticeOne') }}</div>
                        <div class="account-tip-one">- {{ $t('setting.changeNoticeTwo') }}</div>
                    </div>
                </div>

                <el-dialog
                    :modal-append-to-body="false"
                    :title="$t('setting.generatePublicKey')"
                    :visible.sync="dialogVisible"
                    top="45px"
                >
                    <div class="dialog-box" v-loading="dialogLoading">
                        <div class="dialog-cell">
                            <div class="dialog-cell-left">{{ $t('setting.newPublicKey') }}</div>
                            <div class="dialog-cell-mid">{{ publicKey }}</div>
                            <div class="dialog-cell-right">
                                <el-button class="dialog-change-button" @click="clip(publicKey)">
                                    {{ $t('setting.copy') }}
                                </el-button>
                            </div>
                        </div>
                        <div class="dialog-cell">
                            <div class="dialog-cell-left">{{ $t('setting.newPrivateKey') }}</div>
                            <div class="dialog-cell-mid">{{ privateKey }}</div>
                            <div class="dialog-cell-right">
                                <el-button class="dialog-change-button" @click="clip(privateKey)">
                                    {{ $t('setting.copy') }}
                                </el-button>
                            </div>
                        </div>

                        <div class="dialog-tip">
                            <div class="dialog-tip-one">{{ $t('setting.notice') }}</div>
                            <div class="dialog-tip-one">- {{ $t('setting.generateTipOne') }}</div>
                            <div class="dialog-tip-one">- {{ $t('setting.generateTipTwo') }}</div>
                            <div class="dialog-tip-one">- {{ $t('setting.generateTipThree') }}</div>
                        </div>

                        <div class="dialog-buttons">
                            <el-button @click="generateKeyClicked" class="dialog-change-button">
                                {{ $t('setting.refresh') }}
                            </el-button>
                            <el-button
                                @click="useItClicked(publicKey)"
                                class="dialog-change-button"
                            >
                                {{ $t('setting.useIt') }}
                            </el-button>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.container {
    padding: 0px 15px 15px 15px;
    font-size: 16px;
    color: #666666;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.account-cell-title {
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 16px;
    color: #333333;
}
.account-cell-key {
    border: 1px solid #f1f1f1;
    border-radius: 6px;
    font-size: 14px;
    color: #666666;
    padding: 10px 15px;
    background-color: #fff;
    word-wrap: break-word;
}
.account-cell-new-key {
    border: 1px solid #f1f1f1;
    border-radius: 6px;
    font-size: 14px;
    color: #666666;
    background-color: #fff;
}

.account-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.generate-button {
    border: 1px solid $primary-color;
    color: $primary-color;
    border-radius: 4px;
    margin-top: 6px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 1px 3px;
    font-size: 12px;
    overflow: hidden;
    float: right;
    font-weight: 400;
    cursor: pointer;
}

.submiit-button {
    margin: 0 auto;
    clear: both;
    width: 144px;
    height: 40px;
    font-size: 15px;
    font-weight: 400;
    margin-top: 40px;
}

.account-tip {
    margin-top: 20px;
    font-size: 14px;
    color: #666;
    .account-tip-one {
        margin-top: 6px;
    }
}
</style>
