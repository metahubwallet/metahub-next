<script lang="ts" setup>
import chain from '@/common/lib/chain';
import { isValidPublic } from '@/common/lib/keyring';
import { Permission } from 'eosjs/dist/eosjs-rpc-interfaces';

interface Params {
    account: string;
    perms: Permission[];
    operatePerm: string;
    operateType: string;
    oldOperateKey: string;
}

const route = useRoute();
const { t } = useI18n();

const params: Params = JSON.parse(route.query.params + '');
const chainId = route.query.chainId + '';

const newOperateKey = ref('');
const showGeneratePublicKey = ref(false);

const onSubmit = async () => {
    if (!isValidPublic(newOperateKey.value))
        return window.msg.error(t('setting.invalidPublicKey'));
    const newPerms = chain.getApi(chainId).makeNewPermissions(
        params.perms,
        params.operateType, // modify or add
        params.operatePerm, // active or others
        params.oldOperateKey, // pubkey
        newOperateKey.value // pubkey
    ).filter((x: any) => x.perm_name == params.operatePerm);
    console.log(params.account);
    console.log(newPerms);
    
    try {
        await chain
            .getApi(chainId)
            .updatePerms(
                params.account,
                newPerms
            );
        params.perms = newPerms;
        window.msg.success(t('public.executeSuccess'));
    } catch (e) {
        window.msg.error(chain.getErrorMsg(e));
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
                    <div class="account-cell-title" v-if="params.oldOperateKey">
                        {{ $t('setting.currentPublicKey') }}
                    </div>
                    <div class="account-cell-key" v-if="params.oldOperateKey">{{ params.oldOperateKey }}</div>

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
