<script setup lang="ts">
import chain from '@/common/lib/chain';
import { eosChainId } from '@/common/util/network';
import { ResourceBase, ResourceData } from '@/store/wallet/type';
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
const stakeList = ref([] as any);
const ramprice = ref(0);

const memory: ResourceBase= reactive({
    core_liquid_balance: '0.0000 EOS',
    use_percentage: 0,
    use_limit: {
        max: 0,
        used: 0,
    },
});

const emptyCoin = '0.0000 ' + store.chain().currentSymbol;
const empayRefund = { amount: 0, request_time: 0, left_time: '' };
const emptyResourceData: ResourceData = {
    core_liquid_balance: emptyCoin,
    use_percentage: 0,
    use_limit: {
        max: 1,
        used: 0,
    },
    stake_max: 0,
    refund_request: empayRefund,
    total_resources_weight: emptyCoin,
    self_delegated_bandwidth_weight: emptyCoin,
    staked_for_others: 0,
    staked_for_user: 0,
}
const resources: { [key: string]: ResourceData } = reactive({
    cpu: emptyResourceData,
    net: emptyResourceData,
});
const loadData = async () => {
    try {
        let stakeForOthersCPU = 0;
        let stakeForOthersNET = 0;

        stakeList.value = await chain.get().getDelegatebwList(wallet.currentWallet.name);
        stakeList.value.forEach((item: any) => {
            if (item.to != wallet.currentWallet.name) {
                stakeForOthersNET += parseFloat(item.net_weight);
                stakeForOthersCPU += parseFloat(item.cpu_weight);
            }
        });

        const account = (await chain.get().getAccount(wallet.currentWallet.name))!;
        const core_liquid_balance = account.core_liquid_balance ?? emptyCoin;
        resources.cpu = {
            core_liquid_balance,
            use_percentage: account.cpu_limit.max > 0 ? parseInt((account.cpu_limit.used / account.cpu_limit.max) * 100 + '') : 100,
            use_limit: account.cpu_limit,
            stake_max: parseFloat(core_liquid_balance),
            refund_request: account.refund_request ? {
                amount: parseFloat(account.refund_request.cpu_amount),
                request_time: new Date(account.refund_request.request_time).getTime(),
                left_time: '',
            } : empayRefund,
            total_resources_weight: account.total_resources ? account.total_resources.cpu_weight : emptyCoin,
            self_delegated_bandwidth_weight: account.self_delegated_bandwidth ? account.self_delegated_bandwidth.cpu_weight : emptyCoin,
            staked_for_others: Number(stakeForOthersCPU.toFixed(4)),
            staked_for_user: 0,
            
        }
        resources.net = {
            core_liquid_balance,
            use_percentage: account.net_limit.max > 0 ? parseInt((account.net_limit.used / account.net_limit.max) * 100 + '') : 100,
            use_limit: account.net_limit,
            stake_max: parseFloat(core_liquid_balance),
            refund_request: account.refund_request ? {
                amount: parseFloat(account.refund_request.net_amount),
                request_time: new Date(account.refund_request.request_time).getTime(),
                left_time: '',
            } : empayRefund,
            total_resources_weight: account.total_resources ? account.total_resources.net_weight : emptyCoin,
            self_delegated_bandwidth_weight: account.self_delegated_bandwidth ? account.self_delegated_bandwidth.cpu_weight : emptyCoin,
            staked_for_others: Number(stakeForOthersNET.toFixed(4)),
            staked_for_user: 0,
        };
        memory.use_limit.used = account.ram_usage;
        memory.use_limit.max = account.ram_quota;
        memory.use_percentage = parseInt((account.ram_usage / account.ram_quota) * 100 + '');

        ['cpu', 'net'].forEach(x => {
            if (resources[x].use_percentage > 100) {
                resources[x].use_percentage = 100;
            }
            if (resources[x].refund_request.amount) {
                const leftTime = new Date().getTime() - resources[x].refund_request.request_time;
                const minutes = 4320 - (leftTime / 60000 - 479); //赎回剩余分钟数
                resources[x].refund_request.left_time = minutes > 0 ? toInteger(minutes / 1440) + 'd ' + (toInteger(minutes / 60) % 24) + 'h ' + (minutes % 60) + 'm' : '-';
            }
            resources[x].stake_max += Number(resources[x].refund_request.amount.toFixed(4));
            resources[x].staked_for_user = parseFloat(resources[x].total_resources_weight) - parseFloat(resources[x].self_delegated_bandwidth_weight);
            resources[x].staked_for_user = Number(resources[x].staked_for_user.toFixed(4));
        });


    } catch (e) {
        console.log(e);
        window.msg.error(e);
    }
    try {
        let rammarketData = await chain.get().getRamMarket();
        let balance1 = parseFloat(rammarketData!.rows[0].quote.balance);
        let balance2 = parseFloat(rammarketData!.rows[0].base.balance);
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
                            :resources="resources"
                        ></row-resource>

                        <!-- net -->
                        <row-resource
                            @loadData="loadData"
                            class="res-item"
                            type="net"
                            :resources="resources"
                        ></row-resource>

                        <!-- ram -->
                        <row-ram
                            @loadData="loadData"
                            class="res-item"
                            :ramprice="ramprice"
                            :memory="memory"
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
