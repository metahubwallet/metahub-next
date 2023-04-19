<script setup lang="ts">
import { Token } from '@/store/chain/types';

const props = withDefaults(defineProps<{ isShow: boolean }>(), {});
const emit = defineEmits(['close-click', 'refreshTokens']);

let chainTokens: Token[] = [];
const tokenList = ref<Token[]>([]);
const keywords = ref('');

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
const chainStore = store.chain();
const initTokens = () => {
    let tokens: Token[] = [];
    chainTokens = chainStore.allTokens[chainStore.currentChain] || [];
    for (const k in chainTokens) {
        const chainToken = chainTokens[k];
        if (chainToken.contract == 'eosio.token') continue;

        let token = {} as Token;
        Object.assign(token, chainToken);
        token.isShow =
            userStore.currentUserTokens.findIndex(
                (x: Token) => x.contract == token.contract && x.symbol == token.symbol
            ) >= 0;
        tokens.push(token);
    }
    for (const ut of userStore.currentUserTokens) {
        if (ut.contract == 'eosio.token') continue;
        if (tokens.findIndex((x) => x.contract == ut.contract && x.symbol == ut.symbol) >= 0)
            continue;

        let token = {} as Token;
        Object.assign(token, ut);
        token.isShow = true;
        tokens.push(token);
    }
    chainTokens = tokens.sort((x, y) => (x.symbol > y.symbol ? 1 : -1));
    searchTokens();
};

// 搜索token
const searchTokens = () => {
    keywords.value = keywords.value.toLowerCase();
    const tokens =
        keywords.value == ''
            ? chainTokens.concat()
            : chainTokens.filter(
                  (token: Token) =>
                      token.symbol.toLowerCase().includes(keywords.value) ||
                      token.contract.toLowerCase() == keywords.value
              );
    // sort
    tokenList.value = tokens.sort((x: Token, y: Token) => {
        if (x.symbol.toLowerCase() == keywords.value) return -1;
        if (y.symbol.toLowerCase() == keywords.value) return 1;
        if (x.isShow != y.isShow) return x.isShow ? -1 : 1;

        return x.symbol > y.symbol ? 1 : -1;
    });
};

const userStore = store.user();
const coinLikeClikedHandle = async (token: Token) => {
    if (token.isShow) {
        const index = userStore.currentUserTokens.findIndex(
            (x: Token) => x.contract == token.contract && x.symbol == token.symbol
        );
        userStore.userTokens.splice(index, 1);
        token.isShow = false;
    } else {
        const newToken = {
            amount: 0,
            chain: token.chain,
            contract: token.contract,
            symbol: token.symbol,
            precision: token.precision,
        };
        userStore.userTokens.push(newToken);
        token.isShow = true;
    }
    emit('refreshTokens', true);
};
</script>

<template>
    <section class="token-selector" v-show="isShow">
        <div class="selector-bg" @click="$emit('close-click')"></div>
        <transition name="bottomToTop">
            <div class="selector-container" v-show="isShow">
                <div class="selector-header">
                    <div class="title">{{ $t('wallet.addNewTokens') }}</div>
                    <i
                        @click="$emit('close-click')"
                        class="el-message-box__close el-icon-close close"
                    ></i>
                </div>
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
                        <n-table>
                            <tbody>
                                <tr
                                    v-for="(token, index) of tokenList"
                                    :key="index"
                                    class="flex items-center"
                                >
                                    <td>
                                        <n-image
                                            class="icon-img"
                                            width="100"
                                            :src="token.logo"
                                            fallback-src="@/assets/images/eos_icon.png')"
                                        />
                                    </td>
                                    <td>
                                        <div class="coin-symbol">{{ token.symbol }}</div>
                                        <div class="coin-contract">
                                            {{ $t('wallet.contract') }}: {{ token.contract }}
                                        </div>
                                    </td>
                                    <td>
                                        <n-image
                                            class="icon-img"
                                            style="border: none; height: 25px; width: 25px"
                                            :src="
                                                token.isShow
                                                    ? require('@/assets/images/coin_add_selected.png')
                                                    : require('@/assets/images/coin_add.png')
                                            "
                                            @mouseup="coinLikeClikedHandle(token)"
                                            fallback-src="@/assets/images/eos_icon.png')"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </n-table>
                    </n-scrollbar>
                </div>
                <div class="add-token">
                    <span
                        @click="
                            $emit('close-click');
                            $router.push('/wallet/AddToken');
                        "
                    >
                        {{ $t('wallet.addMoreTokens') }}
                    </span>
                </div>
            </div>
        </transition>
    </section>
</template>

<style scoped lang="scss">
@import '@/assets/css/color.scss';

.bottomToTop-leave-active,
.bottomToTop-enter-active {
    transition: all 0.3s ease;
}

.bottomToTop-leave-active,
.bottomToTop-enter {
    height: 0px !important;
}

.bottomToTop-leave,
.bottomToTop-enter-active {
    height: 500px;
}

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
            margin-left: 20px;
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
