<script setup lang="ts">
import { Token } from '@/store/wallet/type';
import CoinAddSelected from '@/asset/img/coin_add_selected.png';
import CoinAdd from '@/asset/img/coin_add.png';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

// 定义局部token
interface CurrentToken extends Token {
    isShow: boolean;
    logo: string;
    amount: number;
    chain: string;
}
let chainTokens: CurrentToken[] = [];
const tokenList = ref<CurrentToken[]>([]);

// 初始化组件
watch(
    () => props.isShow,
    (newValue) => {
        if (newValue && chainTokens.length == 0) initTokens();
        if (newValue === false) {
            keywords.value = '';
            tokenList.value = [];
            chainTokens = [];
        }
    }
);

// 初始化token列表
const initTokens = () => {
    let tokens: CurrentToken[] = [];
    chainTokens = (store.wallet().allTokens[store.chain().currentChain] as CurrentToken[]) || [];
    for (const k in chainTokens) {
        const chainToken = chainTokens[k];
        if (chainToken.contract == 'eosio.token') continue;

        let token = {} as CurrentToken;
        Object.assign(token, chainToken);
        token.isShow =
            store
                .wallet()
                .userTokens.findIndex(
                    (x: Token) => x.contract == token.contract && x.symbol == token.symbol
                ) >= 0;
        tokens.push(token);
    }
    for (const ut of store.wallet().userTokens) {
        if (ut.contract == 'eosio.token') continue;
        if (tokens.findIndex((x) => x.contract == ut.contract && x.symbol == ut.symbol) >= 0)
            continue;

        let token = {} as CurrentToken;
        Object.assign(token, ut);
        token.isShow = true;
        tokens.push(token);
    }
    chainTokens = tokens.sort((x, y) => (x.symbol > y.symbol ? 1 : -1));

    searchTokens();
};

// 搜索token
const keywords = ref('');
const searchTokens = () => {
    keywords.value = keywords.value.toLowerCase();
    const tokens =
        keywords.value == ''
            ? chainTokens.concat()
            : chainTokens.filter(
                  (token: CurrentToken) =>
                      token.symbol.toLowerCase().includes(keywords.value) ||
                      token.contract.toLowerCase() == keywords.value
              );
    // sort
    tokenList.value = tokens.sort((x: CurrentToken, y: CurrentToken) => {
        if (x.symbol.toLowerCase() == keywords.value) return -1;
        if (y.symbol.toLowerCase() == keywords.value) return 1;
        if (x.isShow != y.isShow) return x.isShow ? -1 : 1;

        return x.symbol > y.symbol ? 1 : -1;
    });
};

// 新增token
const emit = defineEmits(['close', 'refreshTokens']);
const addTokenHandle = async (token: CurrentToken) => {
    if (token.isShow) {
        const index = store
            .wallet()
            .userTokens.findIndex(
                (x: Token) => x.contract == token.contract && x.symbol == token.symbol
            );
        store.wallet().userTokens.splice(index, 1);
        token.isShow = false;
    } else {
        const newToken = {
            amount: 0,
            chain: token.chain,
            contract: token.contract,
            symbol: token.symbol,
            precision: token.precision,
        };
        store.wallet().userTokens.push(newToken);
        token.isShow = true;
    }
    emit('refreshTokens', true);
};
</script>

<template>
    <popup-bottom
        :is-show="props.isShow"
        :title="$t('wallet.addNewTokens')"
        @close="$emit('close')"
    >
        <div class="selector-searchWords">
            <n-input
                class="searchWords-input"
                v-model:value="keywords"
                type="text"
                :placeholder="$t('wallet.searchKeyWord')"
                @change="searchTokens"
            />
        </div>

        <div class="selector-list">
            <n-scrollbar>
                <div
                    v-for="(token, index) of tokenList"
                    :key="index"
                    class="grid grid-cols-12 border-gray-200 py-[10px]"
                    :class="index ? 'border-t' : ''"
                >
                    <div class="col-span-2">
                        <img class="icon-img ml-[14px]" :src="token.logo" />
                    </div>

                    <div class="col-span-8">
                        <div class="coin-symbol ml-[20px]">{{ token.symbol }}</div>
                        <div class="coin-contract">
                            {{ $t('wallet.contract') }}: {{ token.contract }}
                        </div>
                    </div>

                    <div class="col-span-2">
                        <img
                            :src="token.isShow ? CoinAddSelected : CoinAdd"
                            class="icon-img border-none w-[25px] h-[25px]"
                            @mouseup="addTokenHandle(token)"
                        />
                    </div>
                </div>
            </n-scrollbar>
        </div>

        <div class="add-token">
            <span
                @click="
                    $emit('close');
                    $router.push({ name: 'add-token' });
                "
            >
                {{ $t('wallet.addMoreTokens') }}
            </span>
        </div>
    </popup-bottom>
</template>

<style scoped lang="scss">
.token-selector {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 97;
}

.selector-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.75);
}

.selector-container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 500px;
    z-index: 100;
    border-radius: 8px 8px 0 0;
    background-color: white;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .selector-header {
        position: relative;
        font-size: 16px;
        color: #222;
        height: 40px;
        border-bottom: 1px solid $separate-color;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        .title {
            font-size: 16px;
            color: #222;
            font-weight: bold;
        }
        i {
            right: 17px;
            position: absolute;
        }
    }

    .selector-searchWords {
        height: 50px;
        display: flex;
        justify-content: center;
        padding-top: 10px;
        .searchWords-input {
            width: 70%;
            height: 34px;
            font-size: 14px;
            margin: 0;
            input {
                height: 100%;
            }
        }
    }

    .selector-list {
        height: 365px;
        overflow: hidden;

        .icon-img {
            height: 40px;
            width: 40px;
            border-radius: 20px;
            border: 1px solid #ebebeb;
            img {
                margin-left: 0;
            }
        }
        .coin-symbol {
            font-size: 14px;
            font-weight: 700;
            color: #333333;
        }
        .coin-contract {
            font-size: 14px;
            color: #999999;
        }
    }

    .add-token {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        text-decoration: underline;
        color: #666;
        cursor: pointer;
    }
}
</style>
