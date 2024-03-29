<script lang="ts" setup>
// 初始化
const walletStore = useWalletStore();
onMounted(async () => {
    await api.resource.getTime(walletStore.currentWallet.name).then((res) => {
        if (res && res.data && res.data.code == 200) {
            smoothModeCPU.value = res.data.result / 1000 + ' ms';
        }
    });
});

// 切换顺畅模式
const smoothMode = ref(walletStore.currentWallet.smoothMode);
const smoothModeCPU = ref('~');
const changeSmoothMode = async () => {
    walletStore.wallets[walletStore.selectedIndex].smoothMode = smoothMode.value;
    walletStore.setWallets(walletStore.wallets);
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
    if (radioFor.value == 'self') rechargeTo.value = walletStore.currentWallet.name;
    else rechargeTo.value = '';
};

// 提交前操作
const form = reactive({
    sender: walletStore.currentWallet.name,
    receiver: 'metahubpower',
    amount: 0,
    memo: '',
    token: {
        symbol: 'EOS',
        contract: 'eosio.token',
        precision: 4,
    }
});
const showConfirm = ref(false);
const beforeSubmit = () => {
    if (!rechargeTo.value) rechargeTo.value = walletStore.currentWallet.name;
    form.memo = rechargeTo.value;
    form.amount = amount.value;
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
                            <n-card class="card" :class="{ on: amount == 0.1 }" :content-style="{padding: 0}"	 @click.native="changeAmount(0.1)">
                                <pre>{{ $t('resource.rechargeTab1') }}</pre>
                            </n-card>
                            <n-card class="card" :class="{ on: amount == 0.5 }" :content-style="{padding: 0}" @click.native="changeAmount(0.5)">
                                <pre>{{ $t('resource.rechargeTab2') }}</pre>
                            </n-card>
                            <n-card class="card" :class="{ on: amount == 1 }" :content-style="{padding: 0}" @click.native="changeAmount(1)">
                                <pre>{{ $t('resource.rechargeTab3') }}</pre>
                            </n-card>
                            <n-card class="card" :class="{ on: amount == 3 }" :content-style="{padding: 0}" @click.native="changeAmount(3)">
                                <pre>{{ $t('resource.rechargeTab4') }}</pre>
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
                            placeholder=""
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

            <transfer-confirm
                :isShow="showConfirm"
                :title="$t('resource.recharge')"
                :transfer="form"
                :precision="4"
                @close="showConfirm = false"
            ></transfer-confirm>
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
                    border: $color-primary 1px solid;
                    background-image: linear-gradient(rgba(247, 197, 244, 0.6), rgba(234, 225, 250, 0.06));
                }
                pre {
                    padding: 12px 5px;
                    font-size: 12px;
                    text-align: center;
                    word-wrap: break-word;
                    white-space:pre-wrap;
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
