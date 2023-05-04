<script setup lang="ts">
import { getTransactionList } from '@/common/libs/remote';
import chain from '@/common/libs/chain';
import { timeUtcFormat } from '@/common/utils/tools';
import { Token } from '@/store/chain/types';

const traceList = ref<any[]>([]);
const nodata = ref(true);
let token = reactive({} as Token);
const loading = ref(false);

const { currentWallet, currentUserTokens } = store.user();

onBeforeMount(() => {
    const [contract, symbol] = (useRoute().params.token as any).split('-');
    token = currentUserTokens.find((x: Token) => x.contract == contract && x.symbol == symbol);
});

onMounted(() => {
    loadBalance();
    setTimeout(() => {
        loadRemoteData();
    }, 200);
});

const router = useRouter();
const handleDetailClick = (item: any) => {
    router.push({
        path: '/wallet/transation',
        query: {
            token: token as any,
            trx: item.value,
        },
    });
};

const transferClicked = () => {
    router.push({
        path: '/wallet/transfer',
        query: {
            symbol: token.symbol,
            contract: token.contract,
        },
    });
};

const loadBalance = async () => {
    const balance = await chain
        .get()
        .getCurrencyBalance(token.contract, currentWallet.name, token.symbol);
    if (balance) {
        token.amount = balance.split(' ')[0];
    }
};

const loadRemoteData = async () => {
    loading.value = true;
    const chain = store.chain().currentChain;
    const params = {
        account: currentWallet.name,
        filter: `${token.contract}:*`,
        skip: 0,
        limit: 100,
        sort: 'desc',
    };
    traceList.value = await getTransactionList(chain, params);
    loading.value = false;
};

const loadMore = async () => {
    if (traceList.value.length == 0) return;

    let lastTraceModel = traceList.value[traceList.value.length - 1];

    if (traceList.value.length % 30 == 0) {
        let nextPage = traceList.value.length / 30 + 1;
        let result: any;

        if (result.code == 200) {
            if (result.data.data.traceList.length > 0) {
                traceList.value = traceList.value.concat(result.data.data.traceList);
                return;
            }
        } else window.msg.error(result.msg);
    }
    // 加载完了
    nodata.value = false;
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle :back-text="$t('auth.back')" :title="$t('wallet.detail')"></top-handle>
            <div class="cover-content _effect">
                <n-scrollbar v-loadmore="loadMore">
                    <div class="header">
                        <div class="coin-icon">
                            <div class="icon-left">
                                <n-image :src="token.logo" class="icon-img">
                                    <div slot="error">
                                        <img
                                            :src="require('@/assets/images/eos_icon.png')"
                                            class="icon-img"
                                        />
                                    </div>
                                </n-image>
                                <div class="icon-name">{{ token.symbol }}</div>
                            </div>
                            <div class="icon-right">
                                <el-button
                                    @click="transferClicked"
                                    class="transfer-btn"
                                    size="mini"
                                >
                                    {{ $t('wallet.transfer') }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div class="balance-box">
                        <span>{{ $t('wallet.balance') }}</span>
                        <span>{{ token.amount }} {{ token.symbol }}</span>
                    </div>
                    <div class="main-content">
                        <div class="content-title">
                            <h2>{{ $t('wallet.tradeHistory') }}</h2>
                        </div>
                        <div class="content-list" v-loading="loading">
                            <div
                                @click="handleDetailClick(item)"
                                class="content-item"
                                v-bind:key="item.id"
                                v-for="item in traceList"
                            >
                                <div class="content-info-big">
                                    <div class="content-info-left">
                                        <img
                                            :src="
                                                item.receiver == currentWallet.name
                                                    ? require('@/assets/images/coin_get@2x.png')
                                                    : require('@/assets/images/coin_out@2x.png')
                                            "
                                        />
                                        <div>
                                            <div class="content-info-up">
                                                {{
                                                    item.receiver != currentWallet.name
                                                        ? item.receiver
                                                        : item.sender
                                                }}
                                            </div>
                                            <div class="content-info-bottom">
                                                {{ timeUtcFormat(item.timestamp) }}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        :class="
                                            item.receiver == currentWallet.name
                                                ? 'content-info-right-blue'
                                                : 'content-info-right-red'
                                        "
                                    >
                                        {{
                                            item.receiver == currentWallet.name
                                                ? '+' + item.quantity
                                                : '-' + item.quantity
                                        }}
                                    </div>
                                </div>
                                <div class="separate-line"></div>
                            </div>
                            <div :hidden="nodata" class="footer">{{ $t('wallet.noData') }}</div>
                        </div>
                    </div>
                </n-scrollbar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.cover-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .header {
        display: flex;
        background: rgba(252, 252, 252, 0.4);
        margin: 18px 18px;
        border: 1px solid #dbdbdb;
        box-shadow: 0px 1px 3px 0px rgba(255, 66, 216, 0.11);
        border-radius: 12px;
        justify-content: space-between;
        .coin-icon {
            padding: 21px 17px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            .icon-img {
                width: 30px;
                height: 30px;
                border-radius: 50%;
            }
            .icon-name {
                font-weight: 500;
                font-size: 18px;
                color: #333333;
                margin-left: 10px;
            }

            .icon-left {
                display: flex;
                flex-direction: row;
                justify-content: left;
                align-items: center;
            }

            .icon-right {
                font-family: PingFangSC;
                font-size: 12px;
                font-weight: 400;
                color: #999999;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-end;
                .transfer-btn {
                    padding: 8px 24px;
                    background: linear-gradient(140deg, #da00f2 0%, #bf01fa 100%, #bf01fa 100%);
                    border-radius: 16px;
                    font-size: 12px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
        .coin-info {
            margin: 0;
            padding: 8px 15px;
            font-weight: 400;
            font-size: 14px;
            color: #999999;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .value {
                color: #666666;
            }
            &.clickable {
                cursor: pointer;
            }
            &.clickable:hover {
                background-color: #e1f3eb;
            }
        }
        .separate-line {
            margin: 0 0 0 15px;
            background-color: $separate-color;
            height: 1px;
        }
    }
    .balance-box {
        display: flex;
        margin: 12px 18px 25px 18px;
        justify-content: space-between;
        align-items: center;
        color: #222;
        font-size: 12px;
    }
    .main-container {
        flex-grow: 1;
        overflow: hidden;
    }
    .main-content {
        display: flex;
        flex-direction: column;
        padding: 0;

        .content-title {
            padding: 0 18px;
            border-bottom: 1px solid $separate-color;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 16px;
            font-weight: 600;
            color: #222;
            h2 {
                margin: 0 0 5px 0;
                padding: 0;
            }
            .btns {
                padding: 5px 0;
                display: flex;
                flex-direction: row;
                .btn {
                    display: block;
                    margin: 0 0 0 10px;
                }
            }
        }
        .footer {
            color: #7f7f7f;
            text-align: center;
        }

        .content-list {
            flex-grow: 1;
            overflow-x: hidden;
            overflow-y: auto;
            min-height: 200px;
            .content-item {
                cursor: pointer;
                background-color: #fff;
                .content-info-big {
                    padding-left: 17px;
                    height: 66px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
                .content-info-left {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    img {
                        width: 20px;
                        height: 20px;
                    }
                }
                .content-info-text {
                    height: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .content-info-up {
                    padding-left: 11px;
                    font-size: 15px;
                    color: #222;
                    font-weight: bold;
                    letter-spacing: 0;
                }
                .content-info-bottom {
                    font-weight: 400;
                    padding-left: 11px;
                    font-size: 12px;
                    color: #888;
                    letter-spacing: 0;
                }

                .content-info-right-red {
                    font-weight: 500;
                    padding-right: 15px;
                    font-size: 14px;
                    letter-spacing: 0;
                    text-align: right;
                    color: #4276ff;
                }
                .content-info-right-blue {
                    font-weight: 500;
                    padding-right: 15px;
                    font-size: 14px;
                    letter-spacing: 0;
                    text-align: right;
                    color: #00b494;
                }
                .separate-line {
                    margin: 0 0 0 50px;
                    background-color: $separate-color;
                    height: 1px;
                }
            }
        }
    }
}
</style>
