<script lang="ts" setup>
// 初始化
const wallet = store.wallet();
onMounted(async () => {
    await api.resource.getTime(wallet.currentWallet.name).then((res) => {
        if (res && res.data.code == 200) smoothModeCPU.value = res.data.result / 1000 + ' ms';
    });
});

// 切换顺畅模式
const smoothMode = ref(wallet.currentWallet.smoothMode);
const smoothModeCPU = ref('~');
const changeSmoothMode = async () => {
    wallet.wallets[wallet.selectedIndex].smoothMode = smoothMode.value;
    wallet.setWallets(wallet.wallets);
};

// 选择充值数量
const amount = ref(0.1);
const changeAmount = (value: number) => {
    amount.value = value;
};

// 选择充值对象
const radioFor = ref('self');
const rechargeTo = ref('');
const radioChange = () => {
    if (radioFor.value == 'self') rechargeTo.value = wallet.currentWallet.name;
    else rechargeTo.value = '';
};

// 提交前操作
const form = reactive({
    sender: wallet.currentWallet.name,
    receiver: 'metahubpower',
    quantity: 0,
    symbol: 'EOS',
    contract: 'eosio.token',
    memo: '',
});
const showConfirm = ref(false);
const beforeSubmit = () => {
    if (!rechargeTo.value) rechargeTo.value = wallet.currentWallet.name;
    form.memo = rechargeTo.value;
    form.quantity = amount.value;
    showConfirm.value = true;
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('resource.recharge')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar class="full">
                    <!-- smoothMode -->
                    <div class="res-container">
                        <div>{{ $t('resource.smoothMode') }}</div>
                        <n-switch
                            v-model:value="smoothMode"
                            active-color="#C02BFC"
                            @change="changeSmoothMode"
                        ></n-switch>
                    </div>

                    <!-- smoothModeCPU -->
                    <div class="res-container">
                        <div>{{ $t('resource.remainingNET') }}</div>
                        <div>{{ smoothModeCPU }}</div>
                    </div>

                    <!-- recharge amount -->
                    <div class="res-container">
                        <div class="cards">
                            <n-card
                                class="card"
                                :class="{ on: amount == 0.1 }"
                                @click.native="changeAmount(0.1)"
                            >
                                {{ $t('resource.rechargeTab1') }}
                            </n-card>
                            <n-card
                                class="card"
                                :class="{ on: amount == 0.5 }"
                                @click.native="changeAmount(0.5)"
                            >
                                {{ $t('resource.rechargeTab2') }}
                            </n-card>
                            <n-card
                                class="card"
                                :class="{ on: amount == 1 }"
                                @click.native="changeAmount(1)"
                            >
                                {{ $t('resource.rechargeTab3') }}
                            </n-card>
                            <n-card
                                class="card"
                                :class="{ on: amount == 3 }"
                                @click.native="changeAmount(3)"
                            >
                                {{ $t('resource.rechargeTab4') }}
                            </n-card>
                        </div>
                    </div>

                    <!-- recharge radio -->
                    <div class="res-container">
                        <div>{{ $t('resource.rechargeAccount') }}</div>
                        <div>
                            <n-radio-group v-model:value="radioFor" @change="radioChange">
                                <n-radio value="self">
                                    {{ $t('resource.currentAccount') }}
                                </n-radio>
                                <n-radio value="other">{{ $t('resource.otherAccount') }}</n-radio>
                            </n-radio-group>
                        </div>
                    </div>

                    <!-- recharge account -->
                    <div class="res-container">
                        <n-input
                            v-show="radioFor == 'other'"
                            v-model="rechargeTo"
                            placeholder="请输入要充值的账号"
                        ></n-input>
                    </div>

                    <!-- submit -->
                    <div class="transfer-buttons">
                        <n-button @click="beforeSubmit()" class="primary-button">
                            {{ $t('wallet.transfer') }}
                        </n-button>
                    </div>
                </n-scrollbar>
            </div>

            <popup-bottom
                :is-show="showConfirm"
                :title="$t('resource.recharge')"
                @close="showConfirm = false"
            >
                <transfer-confirm :transfer="form" :precision="4"></transfer-confirm>
            </popup-bottom>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.confirm-box {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    flex-direction: column-reverse;
}

.full {
    background-color: #fff;

    .res-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        .cards {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            .card {
                cursor: pointer;
                width: 24%;
                font-size: 12px;
                &.on {
                    border: #bf01fa 1px solid;
                    background-image: linear-gradient(
                        rgba(247, 197, 244, 0.6),
                        rgba(234, 225, 250, 0.06)
                    );
                }
            }
        }
    }
    .transfer-buttons {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        left: 0;
        right: 0;
        bottom: 0;
        .primary-button {
            bottom: 40px;
            height: 50px;
            width: 300px;
        }
    }
}
</style>
