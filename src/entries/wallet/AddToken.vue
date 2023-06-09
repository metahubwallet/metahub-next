<script setup lang="ts">
import chain from '@/common/libs/chain';
import { i18n } from '@/common/plugins/lang';
import { Token } from '@/store/chain/types';

const code = ref('');
const contract = ref('');

const { currentUserTokens } = store.user();
const { currentChain } = store.chain();

const { t } = useI18n();
const router = useRouter();
const emit = defineEmits(['refreshTokens']);

const handleLanguageChange = (value: any) => {
    i18n.global.locale = value;
    store.setting().language = value;
};

const handleSubmitAction = async () => {
    try {
        const newContract = contract.value.toLowerCase();
        const symbol = code.value.toUpperCase();
        const result = await chain.get().getCurrencyStats(newContract, symbol);
        if (result && result.max_supply) {
            const [amount] = result.max_supply.split(' ');
            const precision = amount.split('.').length > 1 ? amount.split('.')[1].length : 0;
            const token = {
                amount: 0,
                chain: currentChain,
                contract: newContract,
                symbol: symbol,
                precision: precision,
            };
            const tokenExists =
                currentUserTokens.findIndex(
                    (x: Token) =>
                        x.chain == token.chain &&
                        x.contract == token.contract &&
                        x.symbol == token.symbol
                ) >= 0;
            if (tokenExists) {
                window.msg.error(t('wallet.addTokenExist'));
                return;
            }

            currentUserTokens.push(token);
            emit('refreshTokens', true);
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
            <top-handle
                :back-text="$t('auth.back')"
                :title="$t('wallet.addMoreTokens')"
            ></top-handle>
            <div class="cover-content _effect">
                <div class="setting-group">
                    <div class="row">
                        <div class="title">{{ $t('wallet.contractName') }}:</div>
                        <n-input :placeholder="$t('wallet.required')" v-model="contract"></n-input>
                    </div>

                    <div class="row">
                        <div class="title">{{ $t('wallet.symbolName') }}:</div>
                        <el-input :placeholder="$t('wallet.required')" v-model="code"></el-input>
                    </div>
                </div>
                <div class="bottom-container">
                    <n-button @click="handleSubmitAction" class="submit-btn" type="primary">
                        {{ $t('wallet.submit') }}
                    </n-button>
                </div>
            </div>
        </div>
        <!-- router -->
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';

/deep/ .el-input__inner {
    border: 0;
}

.cover-content {
    background-color: #ffffff;
}

.setting-group {
    background-color: #fff;
    border-width: 0px 0 1px 0;
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
        border-bottom: 1px solid $separate-color;
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
        background-color: $primary-color;
    }
}
</style>
