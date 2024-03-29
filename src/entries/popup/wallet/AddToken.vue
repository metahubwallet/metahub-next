<script setup lang="ts">
import chain from '@/common/lib/chain';
import { Balance } from '@/types/tokens';

const code = ref('');
const contract = ref('');

const { t } = useI18n();
const router = useRouter();
const handleAddToken = async () => {
    try {
        const newContract = contract.value.toLowerCase();
        const symbol = code.value.toUpperCase();

        const result = await chain.getApi().getCurrencyStats(newContract, symbol);
        if (result && result.max_supply) {
            const [amount] = result.max_supply.split(' ');
            const precision = amount.split('.').length > 1 ? amount.split('.')[1].length : 0;
            const coin: Balance = {
                amount: 0,
                chain: useChainStore().currentChain,
                contract: newContract,
                symbol: symbol,
                precision: precision,
                logo: '',
            };
            const tokenExists =
                useWalletStore().currentUserTokens.findIndex((x: Balance) => x.chain == coin.chain && x.contract == coin.contract && x.symbol == coin.symbol) >= 0;
            if (tokenExists) {
                window.msg.error(t('wallet.addTokenExist'));
                return;
            }
            useWalletStore().setCurrentUserTokens([...useWalletStore().currentUserTokens, coin]);
            window.msg.success(t('wallet.addTokenSuccessfully'));
            router.go(-1);
        } else {
            throw new Error('Currency not found');
        }
    } catch (e) {
        window.msg.error(t('wallet.addTokenFailed'));
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('wallet.addMoreTokens')"></page-header>

            <div class="cover-content _effect">
                <div class="setting-group">
                    <div class="row">
                        <div class="title">{{ $t('wallet.contractName') }}:</div>
                        <n-input :placeholder="$t('wallet.required')" v-model:value="contract"></n-input>
                    </div>

                    <div class="row">
                        <div class="title">{{ $t('wallet.symbolName') }}:</div>
                        <n-input :placeholder="$t('wallet.required')" v-model:value="code"></n-input>
                    </div>
                </div>
                <div class="bottom-container">
                    <n-button @click="handleAddToken" class="submit-btn" type="primary">
                        {{ $t('wallet.submit') }}
                    </n-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cover-content {
    background-color: #ffffff;
}

.setting-group {
    background-color: #fff;
    margin-top: 10px;
    &:first-child {
        margin-top: 15px;
    }
    .row {
        margin-left: 15px;
        margin-right: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid $color-separate;
        .title {
            font-size: 15px;
            color: #333333;
            width: 100px;
        }
        .row-icon {
            color: #6bcf44;
        }
    }
}

.bottom-container {
    display: flex;
    justify-content: center;
    .submit-btn {
        margin: 20px auto;
        width: 150px;
        background-color: $color-primary;
    }
}
</style>
