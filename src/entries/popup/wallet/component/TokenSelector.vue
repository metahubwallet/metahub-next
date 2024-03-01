<script setup lang="ts">
import { Balance, Coin } from '@/types/tokens';
import CoinAddSelected from '@/assets/images/coin_add_selected.png';
import CoinAdd from '@/assets/images/coin_add.png';


interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits(['update:isShow'])

let chainTokens: Coin[] = [];
const tokenList = ref<Balance[]>([]);

// 初始化组件
watch(
    () => props.isShow,
    (newValue, oldValue) => {
        if (newValue && chainTokens.length == 0) {
            initTokens();
        }
        if (newValue === false) {
            keywords.value = '';
            tokenList.value = [];
            chainTokens = [];
        }
        if (newValue !== oldValue) {
            emits('update:isShow', newValue)
        }
    }
);

// 初始化token列表
const walletStore = useWalletStore();
const initTokens = () => {
    let tokens: Balance[] = [];
    chainTokens = [];
    for (const chainToken of walletStore.chainTokens) {
        if (chainToken.contract == 'eosio.token') {
            continue;
        }
        let coin = {} as Balance;
        Object.assign(coin, chainToken);
        coin.isShow =
            walletStore.currentUserTokens.findIndex(
                (x: Coin) => x.contract == coin.contract && x.symbol == coin.symbol
            ) >= 0;
        coin.amount = 0;
        tokens.push(coin);
    }
    for (const ut of walletStore.currentUserTokens) {
        if (ut.contract == 'eosio.token') continue;
        if (tokens.findIndex((x) => x.contract == ut.contract && x.symbol == ut.symbol) >= 0) continue;

        let coin = {} as Balance;
        Object.assign(coin, ut);
        coin.isShow = true;
        coin.push(coin);
    }
    chainTokens = tokens.sort((x, y) => (x.symbol > y.symbol ? 1 : -1));

    searchTokens(keywords.value);
};

// 搜索token
const keywords = ref('');
const searchTokens = (newWord: string) => {
    keywords.value = newWord.toLowerCase();
    const tokens =
        (keywords.value == ''
            ? chainTokens.concat()
            : chainTokens.filter(
                  (token: Coin) =>
                      token.symbol.toLowerCase().includes(keywords.value) ||
                      token.contract.toLowerCase() == keywords.value
            )
        ).map((token: Coin) => ({ ...token, amount: 0} as Balance));
    // sort
    tokenList.value = tokens.sort((x: Balance, y: Balance) => {
        if (x.symbol.toLowerCase() == keywords.value) return -1;
        if (y.symbol.toLowerCase() == keywords.value) return 1;
        if (x.isShow != y.isShow) return x.isShow ? -1 : 1;

        return x.symbol > y.symbol ? 1 : -1;
    });
};

// 新增token
const handleAddToken = async (token: Balance) => {
    if (token.isShow) {
        const index = walletStore.currentUserTokens.findIndex(
            (x: Coin) => x.contract == token.contract && x.symbol == token.symbol
        );
        const currentUserTokens = [...walletStore.currentUserTokens];
        currentUserTokens.splice(index, 1);
        walletStore.setCurrentUserTokens(currentUserTokens);
        token.isShow = false;
    } else {
        const newToken = {
            amount: 0,
            chain: token.chain,
            contract: token.contract,
            symbol: token.symbol,
            precision: token.precision,
            logo: '',
        };
        walletStore.setCurrentUserTokens([...walletStore.currentUserTokens, newToken]);
        token.isShow = true;
    }
    walletStore.setUserTokens(walletStore.userTokens);
};
</script>

<template>
    <popup-bottom :is-show="props.isShow" :title="$t('wallet.addNewTokens')" @close="$emit('close')">
        <div class="selector-searchWords">
            <n-input
                class="searchWords-input"
                :value="keywords"
                type="text"
                :placeholder="$t('wallet.searchKeyWord')"
                @input="text => searchTokens(text)"
            />
        </div>

        <div class="selector-list">
            <n-scrollbar>
                <div
                    v-for="(token, index) of tokenList"
                    :key="index"
                    class="flex flex-col items-center grid grid-cols-12 border-gray-200 py-[10px]"
                    :class="index ? 'border-t' : ''"
                >
                    <div class="col-span-2">
                        <img class="icon-img ml-[15px]" :src="token.logo" />
                    </div>

                    <div class="col-span-8 pl-3">
                        <div class="coin-symbol">{{ token.symbol }}</div>
                        <div class="coin-contract">{{ token.contract }}</div>
                    </div>

                    <div class="col-span-2">
                        <img
                            :src="token.isShow ? CoinAddSelected : CoinAdd"
                            class="border-none w-[24px] h-[24px]"
                            @mouseup="handleAddToken(token)"
                        />
                    </div>
                </div>

                <n-empty v-show="tokenList.length == 0" class="m-auto mt-[10%]" />
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
    height: 350px;
    overflow: hidden;
    line-height: 18px;

    .icon-img {
        height: 36px;
        width: 36px;
        border-radius: 18px;
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
</style>
