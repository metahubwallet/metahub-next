<script setup lang="ts">
import EOSIcon from '@/assets/images/eos_icon.png';
import ErrorIcon from '@/assets/images/placeholder.png';
import ErrorCoinImg from '@/assets/images/placeholder.png';
import { eosChainId } from '@/common/util/network';
import { getBalanceList, isSupportChain } from '@/common/lib/remote';
import { Balance, Coin } from '@/types/tokens';
import chain from '@/common/lib/chain';


const chainStore = useChainStore();
const showAddToken = ref(false);

// 初始化Tokens
const isLoading = ref(false);
const tokens = ref<Balance[]>([]);
const walletStore = useWalletStore();
const emit = defineEmits(['isLoading', 'setUnit', 'setAmount']);

onMounted(async () => {
    await loadTokens();
});

watch(
    () => walletStore.selectedIndex,
    async (v) => {
        console.log('change wallet index');
        await loadTokens();
    }
);

watch(isLoading, () => {
    emit('isLoading', isLoading.value);
});

// 加载tokens
const loadTokens = async () => {
    if (isLoading.value) return;
    isLoading.value = true;

    if (walletStore.currentUserTokens.length == 0) {
        walletStore.setCurrentUserTokens([
            {
                amount: 0,
                ...chainStore.currentNetwork.token,
                chain: chainStore.currentChain,
            },
        ]);
    }
    tokens.value = walletStore.currentUserTokens;

    getCoinsLogo(tokens.value);
    await getUserBalance();
    await handleGetEosPrice();
    await getWalletCache();
    isLoading.value = false;
};

// 获取Coin图标
const getCoinsLogo = (coins: Coin[]) => {
    for (const coin of coins) {
        const t = walletStore.getToken(coin);
        if (t.logo) {
            coin.logo = t.logo;
        }
    }
};

// 获取余额
const getUserBalance = async () => {
    let userCoins = tokens.value.map((x: Coin) => {
        return { contract: x.contract, symbol: x.symbol };
    }) as Coin[];

    await getBalanceList(useWalletStore().currentWallet.name, userCoins, (coin: Balance) => {
        // console.log(coin);
        const selectedToken = tokens.value.find((x) => x.contract === coin.contract && x.symbol == coin.symbol);

        if (selectedToken) {
            selectedToken.amount = coin.amount;
            walletStore.setUserTokens(walletStore.userTokens);
        }
    });
};

// 获取价格
const handleGetEosPrice = async () => {
    const eosToken = tokens.value.find((i) => i.contract === 'eosio.token' && i.symbol === 'EOS');

    if (eosToken) {
        emit('setUnit', eosToken.symbol);
        emit('setAmount', eosToken.amount);

        if (eosToken.chain === 'eos') {
            const eosPrice = await chain.getApi().getEosPrice();

            emit('setUnit', 'usd');
            emit(
                'setAmount',
                parseFloat(
                    tool
                        .bignum(eosToken.amount + '')
                        .times(eosPrice)
                        .toFixed(4)
                )
            );
        }
    }
};

// 获取WalletCache
const getWalletCache = async () => {
    let rexEOS = 0.0;
    let rexCount = 0.0;
    if (chainStore.currentChainId === eosChainId) {
        let response: any = await chain.getApi().getREXInfo(walletStore.currentWallet.name);
        rexEOS = response['rows'][0]['vote_stake'];
        rexCount = response['rows'][0]['rex_balance'];
    }
    const walletCaches = walletStore.walletCaches;
    let currentWalletCaches = walletCaches[walletStore.currentWallet?.name + '@' + walletStore.currentWallet?.chainId];
    if (!currentWalletCaches) return;
    currentWalletCaches['rexEOS'] = rexEOS;
    currentWalletCaches['rexCount'] = rexCount;
};

// 查看coin详情
const router = useRouter();
const handleViewCoin = (item: Coin) => {
    if (!isSupportChain(chainStore.currentChain)) return;

    const token = item.contract + '-' + item.symbol;
    router.push({
        name: 'token-traces',
        params: {
            token,
        },
    });
};
</script>

<template>
    <div class="wallet-list-container flex flex-col">
        <!-- head -->
        <div class="list-header-div">
            <div class="list-header-title">
                {{ $t('wallet.totalAssets') }}
            </div>

            <!-- refresh btn -->
            <img @click="loadTokens" class="list-refresh-img" src="@/assets/images/home_refresh.png" />

            <!-- add btn -->
            <img @click="showAddToken = true" class="list-refresh-img ml15" src="@/assets/images/home_add.png" />
        </div>

        <!-- body -->
        <n-scrollbar style="max-height: 277px">
            <div @click="handleViewCoin(item)" class="resource-item" v-for="(item, index) of tokens" :key="index">
                <div class="resource-item-left">
                    <img
                        :src="
                            chainStore.currentChain == 'eos' && item.contract === 'eosio.token'
                                ? EOSIcon
                                : item.logo
                                ? item.logo
                                : ErrorIcon
                        "
                        class="w-[36px] h-[36px] rounded-[50%]"
                        @error.once="($event.target as HTMLImageElement).src = ErrorCoinImg"
                    />
                    <div class="list-name-img">{{ item.symbol }}</div>
                </div>
                <div class="value-item-right">
                    <div class="value-item-top">{{ item.amount }}</div>
                </div>
            </div>
        </n-scrollbar>

        <token-selector :is-show="showAddToken" @close="showAddToken = false"></token-selector>
    </div>
</template>

<style lang="scss" scoped>
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
</style>
