<script lang="ts" setup>
import axios from 'axios';
import chain from '@/common/libs/chain';

const smoothMode = ref(false);
const smoothModeCPU = ref('~');
const radioFor = ref('self');
const rechargeTo = ref('');
const amount = ref(0.1);
const submitLoading = ref(false);
const showConfirm = ref(false);
const formData = reactive({
    memo: '',
    quantity: '',
    receiver: 'metahubpower',
    from: '',
    symbol: 'EOS',
    contract: 'eosio.token',
});

onBeforeMount(async () => {
    if (store.user().currentWallet.smoothMode) smoothMode.value = true;

    let data = { account: store.user().currentWallet.name };
    let url = env.VITE_RESPAYERURl + '/cpu/time';
    axios.post(url, data).then((res) => {
        if (res && res.data.code == 200) smoothModeCPU.value = res.data.result / 1000 + ' ms';
    });
});

const changeSmoothMode = () => {
    store.user().currentWallet.smoothMode = smoothMode.value;
};

const radioChange = () => {
    if (radioFor.value == 'self') rechargeTo.value = store.user().currentWallet.name;
    else rechargeTo.value = '';
};

const changeAmount = (value: number) => {
    amount.value = value;
};

const handleBGClick = () => {
    showConfirm.value = false;
};

const beforeSubmit = () => {
    if (!rechargeTo.value) rechargeTo.value = store.user().currentWallet.name;
    formData.from = store.user().currentWallet.name;
    formData.memo = rechargeTo.value;
    formData.quantity = amount.value + '';
    showConfirm.value = true;
};

const router = useRouter();
const { t } = useI18n();
const onSubmit = async () => {
    //  转账按钮不可点
    submitLoading.value = true;
    // 转账
    formData.quantity = parseFloat(formData.quantity).toFixed(4);
    formData.quantity = formData.quantity + ' EOS';

    try {
        const params = [
            formData.contract,
            formData.from,
            formData.receiver,
            formData.quantity,
            formData.memo,
        ];
        await chain.get().transfer(...params, chain.getAuth());
        setTimeout(() => {
            window.msg.success(t('wallet.transferSuccess'));

            submitLoading.value = false;
            showConfirm.value = false;
            router.go(-1);
        }, 2000);
    } catch (e) {
        submitLoading.value = false;
        window.msg.success(chain.getErrorMsg(e));
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle
                :back-text="$t('auth.back')"
                :title="$t('resource.smoothMode')"
            ></top-handle>
            <div class="cover-content _effect">
                <n-scrollbar class="full">
                    <div class="res-container">
                        <div>{{ $t('resource.smoothMode') }}</div>
                        <n-switch
                            style="display: block"
                            v-model="smoothMode"
                            active-color="#C02BFC"
                            @change="changeSmoothMode"
                        ></n-switch>
                    </div>
                    <div class="res-container">
                        <div>{{ $t('resource.remainingNET') }}</div>
                        <div>{{ smoothModeCPU }}</div>
                    </div>
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
                    <div class="res-container">
                        <div>{{ $t('resource.rechargeAccount') }}</div>
                        <div>
                            <n-radio-group v-model="radioFor" @change="radioChange">
                                <n-radio label="self">
                                    {{ $t('resource.currentAccount') }}
                                </n-radio>
                                <n-radio label="other">{{ $t('resource.otherAccount') }}</n-radio>
                            </n-radio-group>
                        </div>
                    </div>
                    <div class="res-container">
                        <n-input
                            v-show="radioFor == 'other'"
                            v-model="rechargeTo"
                            placeholder="请输入要充值的账号"
                        ></n-input>
                    </div>
                    <div class="transfer-buttons">
                        <n-button @click="beforeSubmit()" class="primary-button">
                            {{ $t('wallet.transfer') }}
                        </n-button>
                    </div>
                </n-scrollbar>
            </div>
            <section @click="handleBGClick" class="confirm-box" v-show="showConfirm">
                <TransferConfirm
                    ref="confirm"
                    @submit-click="onSubmit"
                    @close-click="handleBGClick"
                    :transfer="formData"
                    :precision="4"
                ></TransferConfirm>
            </section>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
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

/deep/ .el-dialog {
    font-family: PingFang SC;
    border-radius: 6px;
    width: 90%;
    .el-dialog__header {
        border-bottom: #f2f2f2 1px solid;
    }
    .el-dialog__body {
        padding: 0px;
    }
}
/deep/ .el-scrollbar {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .el-scrollbar__bar.is-horizontal {
        display: none;
    }
}
/deep/ .el-card__body {
    padding: 15px;
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
