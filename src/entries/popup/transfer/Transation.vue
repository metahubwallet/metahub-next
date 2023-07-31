<script lang="ts" setup>
const { timeFormat } = tool;
const wallet = store.wallet();

const trx = ref<any>(useRoute().query.trx);
const token = ref<any>(useRoute().query.token);

const handleQuery = (url: string) => {
    url = url + trx.value.trx_id;
    chrome.tabs.create({ url });
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('wallet.transation')"></page-header>

            <div class="cover-content _effect">
                <div>
                    <n-scrollbar>
                        <div class="transation-root">
                            <!-- 头部 -->
                            <div class="transation-success">
                                <img
                                    class="transation-img"
                                    src="@/asset/img/transaction_successful@2x.png"
                                />
                                <div class="transation-type">
                                    {{ $t('wallet.transferSuccess') }}
                                </div>
                                <div
                                    :class="[
                                        'transation-count',
                                        trx.receiver == wallet.currentWallet.name
                                            ? 'transation-count-blue'
                                            : 'transation-count-red',
                                    ]"
                                >
                                    {{
                                        trx.receiver == wallet.currentWallet.name
                                            ? '+' + trx.quantity
                                            : '-' + trx.quantity
                                    }}
                                </div>
                            </div>

                            <div class="item-group">
                                <div class="item">
                                    <div class="item-title">{{ $t('wallet.receiverAccount') }}</div>
                                    <div class="item-value">{{ trx.receiver }}</div>
                                </div>
                                <div class="item">
                                    <div class="item-title">{{ $t('wallet.paymentAccount') }}</div>
                                    <div class="item-value">{{ trx.sender }}</div>
                                </div>
                                <div class="item">
                                    <div class="item-title">{{ $t('wallet.memo') }}</div>
                                    <div class="item-value">{{ trx.memo }}</div>
                                </div>
                            </div>

                            <div class="item-group">
                                <div class="item">
                                    <div class="item-title">{{ $t('wallet.transationHASH') }}</div>
                                    <div class="item-value transation-number-value">
                                        {{ trx.trx_id }}
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="item-title">{{ $t('wallet.blockNumber') }}</div>
                                    <div class="item-value">{{ trx.block_num }}</div>
                                </div>
                                <div class="item">
                                    <div class="item-title">{{ $t('wallet.contract') }}</div>
                                    <div class="item-value">{{ token.contract }}</div>
                                </div>
                                <div class="item">
                                    <div class="item-title">{{ $t('wallet.transationTime') }}</div>
                                    <div class="item-value">{{ timeFormat(trx.timestamp) }}</div>
                                </div>
                            </div>

                            <div class="item-group">
                                <div class="item">
                                    <div class="item-title">{{ $t('wallet.moreDetail') }}</div>
                                    <div class="item-search">
                                        <div @click="handleQuery('https://bloks.io/transaction/')">
                                            <img src="@/asset/img/bloks.png" />
                                            <span>bloks</span>
                                        </div>
                                        <div @click="handleQuery('https://eosflare.io/tx/')">
                                            <img src="@/asset/img/eosflare.png" />
                                            <span>eosflare</span>
                                        </div>
                                    </div>
                                    <div class="item-search">
                                        <div @click="handleQuery('https://www.eosx.io/tx/')">
                                            <img src="@/asset/img/eosx.png" />
                                            <span>eosx</span>
                                        </div>
                                        <div
                                            @click="
                                                handleQuery('https://eos.eosq.eosnation.io/tx/')
                                            "
                                        >
                                            <img src="@/asset/img/eosq.png" />
                                            <span>eosq</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </n-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.transation-count-blue {
    color: $color-primary;
}
.transation-count-red {
    color: #e24054;
}

.transation-success {
    height: 130px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;

    .transation-img {
        margin-top: 15px;
        height: 40px;
        width: 40px;
    }
    .transation-type {
        font-size: 12px;
        color: #999999;
        margin-top: 10px;
    }
    .transation-count {
        font-weight: bold;
        font-size: 23px;
    }
}

.item-group {
    background: white;
    margin-bottom: 15px;
    border: 1px solid #f2f2f2;
    border-width: 1px 0;
    .item {
        border-bottom: 1px solid #f2f2f2;
        margin-left: 15px;
        padding-right: 15px;
        line-height: 1.2em;
        &:last-child {
            border-bottom-width: 0;
        }
        .item-title {
            padding-top: 12px;
            font-size: 14px;
            color: #999999;
            min-width: 44px;
        }
        .item-value {
            margin-top: 6px;
            font-size: 15px;
            color: #333333;
            padding-bottom: 10px;
            word-break: break-word;
            min-height: 30px;
        }
        .transation-number-value {
            word-break: break-all;
        }
        .item-search {
            display: flex;
            div {
                padding: 15px 0;
                width: 50%;
                display: flex;
                align-items: center;
                cursor: pointer;
                img {
                    height: 24px;
                    width: 24px;
                    border-radius: 12px;
                }
                span {
                    margin-left: 5px;
                    font-size: 15px;
                    color: #333333;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
