<script setup lang="ts">
import chain from '@/common/lib/chain';
import { eosChainId } from '@/common/util/network';
import { ResourceData } from '@/store/wallet/type';
import { toInteger } from 'lodash';

// 初始化
const showResBox = ref(true);
const wallet = store.wallet();
onBeforeMount(async () => {
    showResBox.value = store.chain().currentChainId == eosChainId;
    loadData();
    if (wallet.currentWallet.smoothMode) {
        smoothMode.value = true;
    }

    await api.resource.getTime(wallet.currentWallet.name).then((res: any) => {
        if (res.code == 200) {
            smoothModeCPU.value = Math.floor(res.result / 1000) + ' ms';
        }
    });
});

// 切换顺畅模式
const smoothMode = ref(false);
const smoothModeCPU = ref('~');
const changeSmoothMode = async () => {
    wallet.wallets[wallet.selectedIndex].smoothMode = smoothMode.value;
    await localCache.set('wallets', [...wallet.wallets]);
    smoothMode.value = smoothMode.value;
};

// 新标签页跳转
const toLink = (url: string) => {
    chrome.tabs.create({ url: url });
};

// 获取数据
const stakeList = ref([]);
const ramprice = ref(0);
let resourceData = ref({
    total_resources: {
        cpu_weight: 0,
        net_weight: 0,
    } as any,
    ram_quota: 0,
    ram_usage: 0,
    stakeForOthersCPU: 0,
    stakeForOthersNET: 0,
    stakeCpuMax: 0,
    stakeNetMax: 0,
} as ResourceData);
const loadData = async () => {
    try {
        stakeList.value = await chain.get().getDelegatebwList(wallet.currentWallet.name);
        const data: ResourceData = await chain.get().getAccount(wallet.currentWallet.name);

        data.cpu_limit.percentage =
            data.cpu_limit.max > 0 ? parseInt((data.cpu_limit.used / data.cpu_limit.max) * 100 + '') : 100;
        if (data.cpu_limit.percentage > 100) {
            data.cpu_limit.percentage = 100;
        }
        data.net_limit.percentage =
            data.net_limit.max > 0 ? parseInt((data.net_limit.used / data.net_limit.max) * 100 + '') : 100;
        if (data.net_limit.percentage > 100) {
            data.net_limit.percentage = 100;
        }
        data.ram_percentage = parseInt((data.ram_usage / data.ram_quota) * 100 + '');
        data.stakeCpuMax = parseFloat(data.core_liquid_balance);
        if (data.refund_request) {
            data.stakeCpuMax += data.refund_request.cpu_amount;
        }
        data.stakeCpuMax = Number(data.stakeCpuMax.toFixed(4));
        data.stakeNetMax = parseFloat(data.core_liquid_balance);
        if (data.refund_request) {
            data.stakeNetMax += data.refund_request.net_amount;
        }
        data.stakeNetMax = Number(data.stakeNetMax.toFixed(4));
        let stakeForOthersNET = 0;
        let stakeForOthersCPU = 0;
        stakeList.value.forEach((item: any) => {
            if (item.to != wallet.currentWallet.name) {
                stakeForOthersNET += parseFloat(item.net_weight);
                stakeForOthersCPU += parseFloat(item.cpu_weight);
            }
        });
        const emptyCoin = '0.0000 ' + store.chain().currentSymbol;
        if (!data.total_resources) {
            data.total_resources = {
                cpu_weight: emptyCoin,
                net_weight: emptyCoin,
            };
        }
        if (!data.self_delegated_bandwidth) {
            data.self_delegated_bandwidth = {
                cpu_weight: emptyCoin,
                net_weight: emptyCoin,
            };
        }
        data.stakeForUserCPU =
            parseFloat(data.total_resources.cpu_weight) - parseFloat(data.self_delegated_bandwidth.cpu_weight);
        data.stakeForUserNET =
            parseFloat(data.total_resources.net_weight) - parseFloat(data.self_delegated_bandwidth.net_weight);
        data.stakeForUserCPU = Number(data.stakeForUserCPU.toFixed(4));
        data.stakeForUserNET = Number(data.stakeForUserNET.toFixed(4));
        data.stakeForOthersCPU = Number(stakeForOthersCPU.toFixed(4));
        data.stakeForOthersNET = Number(stakeForOthersNET.toFixed(4));

        if (data.refund_request) {
            let leftTime = new Date().getTime() - new Date(data.refund_request.request_time).getTime();
            let minutes = 4320 - (leftTime / 60000 - 479); //赎回剩余分钟数
            data.refund_request.left_time =
                minutes > 0
                    ? toInteger(minutes / 1440) + 'd ' + (toInteger(minutes / 60) % 24) + 'h ' + (minutes % 60) + 'm'
                    : '-';
        }
        resourceData.value = data;
    } catch (e) {
        console.log(e);
        window.msg.error(e);
    }
    try {
        let rammarketData = await chain.get().getRamMarket();
        let balance1 = parseFloat(rammarketData.rows[0].quote.balance);
        let balance2 = parseFloat(rammarketData.rows[0].base.balance);
        ramprice.value = (balance1 / balance2) * 1024;
    } catch (e) {
        window.msg.error('ramprice error');
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('resource.resources')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar class="full">
                    <div class="res-container" :class="{ padding: showResBox }">
                        <!-- header -->
                        <div class="res-header" v-show="showResBox">
                            <!-- smooth mode -->
                            <div class="smooth-mode" :class="{ on: smoothMode }">
                                <!-- smoothMode switch -->
                                <div class="line1">
                                    <div>{{ $t('resource.smoothMode') }}</div>
                                    <n-switch
                                        style="display: block"
                                        v-model:value="smoothMode"
                                        active-color="#C02BFC"
                                        @change="changeSmoothMode"
                                    ></n-switch>
                                </div>

                                <!-- recharge -->
                                <div class="line2">
                                    <div>{{ $t('resource.remainingNET') }} {{ smoothModeCPU }}</div>
                                    <div>
                                        <span @click="$router.push({ name: 'recharge' })">
                                            {{ $t('resource.recharge') }} >
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- links -->
                            <div class="links">
                                <div
                                    class="link flex justify-between items-center"
                                    @click="toLink('https://eospowerup.io/')"
                                >
                                    {{ $t('resource.freeCPU') }}
                                    <icon-right theme="filled" size="14" fill="#4a4a4a" />
                                </div>
                                <div
                                    class="link flex justify-between items-center"
                                    @click="toLink('https://rex.tokenpocket.pro/#/')"
                                    style="margin-top: 8px"
                                >
                                    {{ $t('resource.tradeREX') }}
                                    <icon-right theme="filled" size="14" fill="#4a4a4a" />
                                </div>
                            </div>
                        </div>

                        <!-- cpu -->
                        <row-resource
                            @loadData="loadData"
                            class="res-item"
                            type="cpu"
                            :resourceData="resourceData"
                        ></row-resource>

                        <!-- net -->
                        <row-resource
                            @loadData="loadData"
                            class="res-item"
                            type="net"
                            :resourceData="resourceData"
                        ></row-resource>

                        <!-- ram -->
                        <row-ram
                            @loadData="loadData"
                            class="res-item"
                            :ramprice="ramprice"
                            :resourceData="resourceData"
                        ></row-ram>
                    </div>
                </n-scrollbar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.full {
    background-color: #fff;

    .res-container {
        display: flex;
        flex-direction: column;
        &.padding {
            padding: 15px;
        }
        .res-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .smooth-mode {
                width: 222px;
                height: 100px;
                background: #ffffff;
                box-shadow: 0px 0px 12px 1px rgba(131, 60, 191, 0.0784313725490196);
                border-radius: 8px;
                border: 1px solid #dbdbdb;
                &.on {
                    border: $color-primary 1px solid;
                    background-image: linear-gradient(rgba(247, 197, 244, 0.6), rgba(234, 225, 250, 0.06));
                }
            }
            .links {
                display: flex;
                flex-direction: column;
                width: 115px;
                height: 100px;
                font-size: 12px;
                .link {
                    padding: 12px;
                    width: 115px;
                    height: 46px;
                    background: #ffffff;
                    box-shadow: 0px 0px 12px 1px rgba(131, 60, 191, 0.0784313725490196);
                    border-radius: 8px;
                    border: 1px solid #dbdbdb;
                    text-align: center;
                    cursor: pointer;
                    .arrow-icon {
                        width: 15px;
                        height: 15px;
                        img {
                            width: 11px;
                        }
                    }
                }
            }
        }
        .line1 {
            padding: 15px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        .line2 {
            padding: 0 15px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            font-weight: 400;
            vertical-align: middle;
            color: #222;
            span {
                cursor: pointer;
                font-size: 12px;
                color: #c02bfc;
            }
        }
    }
}
</style>
