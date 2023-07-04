<script lang="ts" setup>
import chain from '@/common/lib/chain';
import { Perm } from '@/store/wallet/type';

const permissions = ref<Perm[]>([]);
onBeforeMount(() => {
    let perms = new Set();
    for (const key of store.wallet().currentWallet.keys) {
        for (const perm of key.permissions) {
            perms.add(perm);
        }
    }
    permissions.value = Array.from(perms) as Perm[];
});

const route = useRoute();
const { t } = useI18n();
const params: any = route.query.params;
const oldOperateKey = ref(params?.oldOperateKey);
const newOperateKey = ref('');
const showGeneratePublicKey = ref(false);

const perms = ref(params?.perms);
const account = ref(params?.account);
const authType = ref(params?.authType);
const operateType = ref(params?.operateType);
const chainId = ref(route.query.chainId as string);
const walleAuthType = computed(() => {
    if (permissions.value.indexOf('owner' as never) > -1) return 'owner';
    else return 'active';
});
const onSubmit = async () => {
    if (!chain.get(chainId.value).isValidPublic(newOperateKey.value))
        return window.msg.error(t('setting.invalidPublicKey'));
    let newPerms = chain.get(chainId.value).updateNewPermissions(
        perms.value,
        authType.value, // active or others
        operateType.value, // modify or add
        oldOperateKey.value, // pubkey
        newOperateKey.value // pubkey
    );
    newPerms = newPerms.filter((x: any) => x.perm_name == authType.value);
    try {
        await chain
            .get(chainId.value)
            .updatePerms(
                account.value,
                newPerms,
                chain.getAuthByAccount(account.value.name, walleAuthType.value)
            );
        perms.value = newPerms;
        window.msg.success(t('public.executeSuccess'));
    } catch (e) {
        window.msg.success(chain.getErrorMsg(e));
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.changeAuthority')"></page-header>

            <div class="cover-content _effect">
                <div class="container">
                    <!-- old key -->
                    <div class="account-cell-title" v-if="oldOperateKey">
                        {{ $t('setting.currentPublicKey') }}
                    </div>
                    <div class="account-cell-key" v-if="oldOperateKey">{{ oldOperateKey }}</div>

                    <!-- new key -->
                    <div class="account-cell-title">{{ $t('setting.newPublicKey') }}</div>
                    <n-input
                        :placeholder="$t('setting.enterPublicKeyTip')"
                        class="account-cell-new-key"
                        type="textarea"
                        v-model:value="newOperateKey"
                    ></n-input>

                    <!-- button -->
                    <div class="account-buttons">
                        <div @click="showGeneratePublicKey = true" class="generate-button">
                            {{ $t('setting.generatePublicKey') }}
                        </div>
                    </div>
                    <n-button type="primary" @click="onSubmit" class="submiit-button">
                        {{ $t('setting.submit') }}
                    </n-button>

                    <!-- tip -->
                    <div class="account-tip">
                        <div class="account-tip-one">{{ $t('setting.notice') }}</div>
                        <div class="account-tip-one">- {{ $t('setting.changeNoticeOne') }}</div>
                        <div class="account-tip-one">- {{ $t('setting.changeNoticeTwo') }}</div>
                    </div>
                </div>
            </div>

            <generate-public-key
                :is-show="showGeneratePublicKey"
                :chain-id="chainId"
                @close="showGeneratePublicKey = false"
                @set-operate-key="newOperateKey = $event"
            ></generate-public-key>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
    border: 1px solid $color-primary;
    color: $color-primary;
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
