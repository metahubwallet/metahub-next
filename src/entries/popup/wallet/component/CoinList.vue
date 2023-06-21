<script setup lang="ts">
import EOSIcon from '@/asset/img/eos_icon.png';
import ErrorCoinImg from '@/asset/img/placeholder.png';
import { Coin } from '@/store/wallet/type';
import { eosChainId } from '@/common/util/network';

const chain = store.chain();
const showAddToken = ref(false);

const tokens = ref<Coin[]>([]);

// 初始化Tokens
let isLoad = ref(false);
const loadTokens = async () => {
    if (isLoad.value) return;

    isLoad.value = true;
    if (store.wallet().wallets.length == 0) return;

    const network = store.chain().currentNetwork;
    if (store.wallet().userTokens.length == 0) {
        store.wallet().userTokens.push({
            amount: 0,
            chain: network.chain,
            ...network.token,
        });
    }
    tokens.value = store.wallet().userTokens.concat();

    getCoinsLogo(tokens.value);

    await getUserBalance();
    await handleGetEosPrice();
    await getWalletCache();

    isLoad.value = false;
};
onMounted(async () => {
    await loadTokens();
});
watch(
    () => store.wallet().selectedIndex,
    (newValue, oldValue) => {
        if (newValue !== oldValue) loadTokens();
    }
);

// 获取Coin图标
const getCoinsLogo = (coins: Coin[]) => {
    for (const coin of coins) {
        if (!coin.logo) {
            const t = store.wallet().getCoin(coin);
            if (t.logo) coin.logo = t.logo;
        }
    }
};

// 获取余额
const getUserBalance = async () => {
    let userCoins = tokens.value.map((x: Coin) => {
        return { contract: x.contract, symbol: x.symbol };
    }) as Coin[];
    // await getBalanceList(store.user().currentWallet.name, userCoins, (token: Token) => {
    //     const selectedToken = tokens.value.find(
    //         (x) => x.contract === token.contract && x.symbol == token.symbol
    //     );
    //     if (selectedToken) selectedToken.amount = token.amount;
    // });
};

// 获取价格
const emit = defineEmits(['setUnit', 'setAmount']);
const handleGetEosPrice = async () => {
    const eosToken = tokens.value.find((i) => i.contract === 'eosio.token' && i.symbol === 'EOS');
    if (eosToken) {
        emit('setUnit', eosToken.symbol);
        emit('setAmount', eosToken.amount);
        if (eosToken.chain == 'eos') {
            const eosPrice = 0;
            // const eosPrice = await chain.get().getEosPrice();
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
    if (store.chain().currentChainId === eosChainId) {
        let response: any = {};
        // let response = await chain.get().getREXInfo(store.wallet().currentWallet.name);
        rexEOS = response['rows'][0]['vote_stake'];
        rexCount = response['rows'][0]['rex_balance'];
    }
    const walletCaches = store.wallet().walletCaches;
    let currentWalletCaches =
        walletCaches[
            store.wallet().currentWallet?.name + '@' + store.wallet().currentWallet?.chainId
        ];
    if (!currentWalletCaches) return;
    currentWalletCaches['rexEOS'] = rexEOS;
    currentWalletCaches['rexCount'] = rexCount;
};

// 查看coin详情
const router = useRouter();
const viewCoinHandle = (item: Coin) => {
    const token = item.contract + '-' + item.symbol;
    router.push('token-traces' + token);
};
</script>

<template>
    <div class="wallet-list-container">
        <!-- head -->
        <div class="list-header-div">
            <div class="list-header-title">
                {{ $t('wallet.totalAssets') }}
            </div>

            <!-- refresh btn -->
            <img @click="loadTokens" class="list-refresh-img" src="@/asset/img/home_refresh.png" />

            <!-- add btn -->
            <img
                @click="showAddToken = true"
                class="list-refresh-img ml15"
                src="@/asset/img/home_add.png"
            />
        </div>

        <!-- body -->
        <div
            @click="viewCoinHandle(item)"
            class="resource-item"
            v-for="(item, index) of tokens"
            :key="index"
        >
            <div class="resource-item-left">
                <img
                    :src="
                        chain.currentChain == 'eos' && item.contract === 'eosio.token'
                            ? EOSIcon
                            : item.logo
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
