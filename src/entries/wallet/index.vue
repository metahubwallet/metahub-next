<script setup lang="ts">
import { getBalanceList, isSupportChain } from '@/common/libs/remote';
import chain from '@/common/libs/chain';
import { eosChainId } from '@/common/utils/network';
import { bignum } from '@/common/utils/tools';
import { Token } from '@/store/chain/types';

const router = useRouter();

const valueType = ref('usd');
const valueAmount = ref(0);
const { wallets } = store.user();
const loading = ref(false);
const showAddToken = ref(false);
const tokens = ref<Token[]>([]);

onMounted(async () => {
    loadTokens();
});

watch(
    () => store.user().selectedIndex,
    (newValue, oldValue) => {
        if (newValue !== oldValue) loadTokens();
    }
);

const handleHeaderClick = (index: number, item = {}) => {
    switch (index) {
        case 1:
            const eosToken = tokens.value.find(
                (i: Token) => i.contract === 'eosio.token' && i.symbol === 'EOS'
            ) as Token;
            router.push({
                path: '/wallet/transfer',
                query: {
                    symbol: eosToken.symbol,
                    contract: eosToken.contract,
                },
            });
            break;
        case 2:
            router.push('/wallet/receive');
            break;
        case 3:
            router.push('/resource');
            break;
        case 4:
            router.push('/setting');
            break;
        default:
            break;
    }
};

let refreshing = false;
const loadTokens = async (showLoading = false) => {
    if (wallets.length == 0) return;

    if (refreshing) return;

    refreshing = true;

    let loadTime = Date.now();
    if (showLoading) loading.value = true;

    const network = store.chain().currentNetwork;
    if (store.user().userTokens.length == 0) {
        store.user().userTokens.push({
            amount: 0,
            chain: network.chain,
            ...network.token,
        });
    }
    tokens.value = store.user().userTokens.concat();
    fillTokensLogo(tokens.value);

    await getUserBalance();
    await handleGetEosPrice();
    await loadRex();

    refreshing = false;

    loadTime = Date.now() - loadTime;
    if (!showLoading || loadTime >= 800) {
        loading.value = false;
    } else {
        setTimeout(() => (loading.value = false), 800 - loadTime);
    }
};

const fillTokensLogo = (tokens: Token[]) => {
    for (const token of tokens) {
        if (!token.logo) {
            const t = store.chain().getOneToken(token);
            if (t) {
                token.logo = t.logo;
            }
        }
    }
};

const handleGetEosPrice = async () => {
    const eosToken = tokens.value.find(
        (i) => i.contract === 'eosio.token' && i.symbol === 'EOS'
    ) as Token;
    if (eosToken) {
        valueAmount.value = eosToken.amount;
        valueType.value = eosToken.symbol;
        if (eosToken.chain == 'eos') {
            const eosPrice = 0;
            // const eosPrice = await chain.get().getEosPrice();
            valueType.value = 'usd';
            valueAmount.value = parseFloat(
                bignum(eosToken.amount + '')
                    .times(eosPrice)
                    .toFixed(4)
            );
        }
    }
};

const loadRex = async () => {
    let rexEOS = 0.0;
    let rexCount = 0.0;
    if (store.chain().currentChainId === eosChainId) {
        let response: any = {};
        // let response = await chain.get().getREXInfo(store.user().currentWallet.name);
        rexEOS = response['rows'][0]['vote_stake'];
        rexCount = response['rows'][0]['rex_balance'];
    }
    const walletCaches = store.user().walletCaches;
    let currentWalletCaches =
        walletCaches[store.user().currentWallet.name + '@' + store.user().currentWallet.chainId];
    if (!currentWalletCaches) return;
    currentWalletCaches['rexEOS'] = rexEOS;
    currentWalletCaches['rexCount'] = rexCount;
};

const getUserBalance = async () => {
    let newTokens = tokens.value.map((x: Token) => {
        return { contract: x.contract, symbol: x.symbol };
    }) as Token[];
    // await getBalanceList(store.user().currentWallet.name, newTokens, (token: Token) => {
    //     const selectedToken = tokens.value.find(
    //         (x) => x.contract === token.contract && x.symbol == token.symbol
    //     );
    //     if (selectedToken) selectedToken.amount = token.amount;
    // });
};

const { currentChain } = store.chain();
const handleCoinClick = (item: Token) => {
    // if (!isSupportChain(currentChain)) return;
    const token = item.contract + '-' + item.symbol;
    router.push('/wallet/tokenTraces/' + token);
};
</script>

<template>
    <div class="wallet-page w-full h-full">
        <div class="demo">1</div>
        <n-scrollbar class="full" v-if="wallets.length > 0">
            <div class="wallet-container">
                <wallet-header
                    :type="valueType"
                    :amount="valueAmount"
                    @btnClick="handleHeaderClick"
                ></wallet-header>

                <div class="wallet-list-container" v-loading="loading">
                    <div class="list-header-div">
                        <div class="list-header-title">
                            {{ $t('wallet.totalAssets') }}
                        </div>
                        <img
                            @click="loadTokens(true)"
                            class="list-refresh-img"
                            src="@/assets/images/home_refresh.png"
                        />
                        <img
                            @click="showAddToken = true"
                            class="list-refresh-img ml15"
                            src="@/assets/images/home_add.png"
                        />
                    </div>
                    <div
                        @click="handleCoinClick(item)"
                        class="resource-item"
                        v-bind:key="item.id"
                        v-for="item in tokens"
                    >
                        <div class="resource-item-left">
                            <n-image
                                :src="
                                    currentChain == 'eos' && item.contract === 'eosio.token'
                                        ? require('@/assets/images/eos_icon.png')
                                        : item.logo
                                "
                                style="border: none; height: 36px; width: 36px"
                            >
                                <div slot="error">
                                    <img
                                        :src="require('@/assets/images/placeholder.png')"
                                        style="border: none; height: 36px; width: 36px"
                                    />
                                </div>
                            </n-image>
                            <div class="list-name-img">{{ item.symbol }}</div>
                        </div>
                        <div class="value-item-right">
                            <div class="value-item-top">{{ item.amount }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </n-scrollbar>
        <no-account v-else></no-account>
        <token-selector
            :isShow="showAddToken"
            v-model="showAddToken"
            @close-click="showAddToken = false"
        ></token-selector>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';

.wallet-page {
    width: 100%;
    height: 530px;
}

.wallet-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    width: 100%;
    height: 100%;

    .wallet-list-container {
        border-radius: 6px;
        width: 100%;
        height: auto;
        border-top: 8px solid #fff;
        margin-top: 12px;
        padding-bottom: 80px;
        .list-header-div {
            margin: 0px 0px;
            font-size: 16px;
            color: #333333;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: 1px solid #eaeaea;
            padding: 0 23px;
            height: 56px;
            .list-refresh-img {
                width: auto;
                height: 14px;
                cursor: pointer;
            }
            .ml15 {
                margin-left: 15px;
            }
        }

        .list-header-title {
            color: #222;
            font-weight: 600;
            font-size: 16px;
            display: flex;
            flex: 2;
        }
        .resource-item {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: 65px;
            position: relative;
            &::after {
                content: '';
                height: 1px;
                width: 84%;
                background: #eaeaea;
                position: absolute;
                bottom: 0;
                right: 0;
            }
            .rex-class {
                position: absolute;
                left: 61px;
                bottom: 8px;
                color: #999999;
                -webkit-transform-origin-x: 0;
                -webkit-transform: scale(0.8);
                transform: scale(0.8);
                font-size: 12px;
            }
            .list-icon-img {
                width: 30px;
                height: 30px;
                border-radius: 50%;
            }
            .list-name-img {
                font-size: 15px;
                color: #222;
                margin-left: 10px;
            }
            .resource-item-left {
                display: flex;
                flex-direction: row;
                justify-content: left;
                align-items: center;
                margin-left: 15px;
            }

            .value-item-right {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-end;
                //height: 43px;

                margin-right: 15px;
                .value-item-top {
                    font-weight: 600;
                    font-size: 15px;
                    color: #222;
                }
                .value-item-bottom {
                    height: 16px;
                    font-size: 11px;
                    color: #999999;
                }
            }
        }
    }
}
</style>
