<script setup lang="ts">
import chain from '@/common/lib/chain';
import { Coin, Transation } from '@/store/wallet/type';

const { t } = useI18n();

const wallet = store.wallet();
const recentVisible = ref(false);
const selectTokenVisible = ref(false);

const form = reactive({
    sender: '',
    receiver: '',
    quantity: 0,
    memo: '',
    symbol: '',
    contract: '',
});

const targetCoin = reactive<Coin>({
    contract: '',
    symbol: 'eos',
    precision: 4,
    amount: 0,
    chain: '',
});

// 初始化数据
const route = useRoute();
onBeforeMount(() => {
    const currentSystemToken = store.chain().currentNetwork.token;

    targetCoin.symbol = (route.query.symbol as string) || currentSystemToken.symbol;
    targetCoin.contract = (route.query.contract as string) || currentSystemToken.contract;
    targetCoin.precision = Number(route.query.precision) || currentSystemToken.precision;
    if (!targetCoin.contract) targetCoin.contract = 'eosio.token';
    if (!targetCoin.amount) targetCoin.amount = 0;
    if (!targetCoin.precision) targetCoin.precision = 4;

    wallet.userTokens.forEach((row) => {
        if (row.contract == targetCoin.contract && row.symbol == targetCoin.symbol) {
            targetCoin.amount = row.amount;
            targetCoin.precision = row.precision;
        }
    });
    form.sender = tool.briefAccount(wallet.currentWallet.account, 14, 8);
    form.symbol = targetCoin.symbol;
    getBalance();
});

// 验证receiver值
const isShowMemo = ref(true);
const receiverError = ref('');
const checkReceiver = async () => {
    if (!form.receiver) return (receiverError.value = t('wallet.emptyReceiver'));
    if (form.receiver == wallet.currentWallet.name)
        return (receiverError.value = t('wallet.transferSelf'));

    // 账号不存在
    if (form.receiver.length == 42) isShowMemo.value = false;
    else if (form.receiver.length != 42 && form.receiver.length > 12)
        return (receiverError.value = t('wallet.errorReceiver'));
    else {
        isShowMemo.value = true;
        let accountData = await chain.get().getAccount(form.receiver);
        if (accountData == null) return (receiverError.value = t('wallet.accountNotExist'));
    }
    receiverError.value = '';
};

// 选择最近记录
const selectTransferHandle = (transfer: Transation) => {
    recentVisible.value = false;
    form.receiver = transfer.receiver;
    form.memo = transfer.memo;
    receiverError.value = '';
    checkReceiver();
};

// 验证quantity值
const quantityError = ref('');
const checkQuantity = () => {
    const quantity = isNaN(form.quantity) ? 0 : form.quantity;
    if (quantity == 0) return (quantityError.value = t('wallet.emptyAmount'));
    if (quantity < 0) return (quantityError.value = t('wallet.emptyAmount'));
    quantityError.value = '';
};

// 切换token
const changeTokenHandle = (coin: Coin) => {
    targetCoin.amount = coin.amount;
    targetCoin.chain = coin.chain;
    targetCoin.contract = coin.contract;
    targetCoin.precision = coin.precision;
    targetCoin.symbol = coin.symbol;

    selectTokenVisible.value = false;
    form.quantity = 0;
    getBalance();
};

// 获取余额
const getBalance = async () => {
    const balance = await chain
        .get()
        .getCurrencyBalance(targetCoin.contract, wallet.currentWallet.name, targetCoin.symbol);
    if (balance) targetCoin.amount = Number(balance.split(' ')[0]);
};

// 验证转账信息
const confirmVisible = ref(false);
const checkSubmit = () => {
    form.symbol = targetCoin.symbol;
    form.contract = targetCoin.contract;

    checkReceiver();
    checkQuantity();
    if (receiverError.value || quantityError.value) return;

    confirmVisible.value = true;
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('wallet.transfer')"></page-header>

            <div class="cover-content _effect">
                <form>
                    <!-- from account -->
                    <div class="transfer-title">{{ $t('wallet.paymentAccount') }}</div>
                    <div class="transfer-input">
                        <n-input
                            :disabled="true"
                            v-model:value="form.sender"
                            class="rounded-[22px] h-[46px] leading-[46px] pl-[5px]"
                        ></n-input>
                    </div>

                    <!-- receiver account -->
                    <div class="transfer-title flex justify-between items-center">
                        {{ $t('wallet.receiverAccount') }}
                        <icon-history
                            theme="filled"
                            size="16"
                            fill="#666"
                            class="cursor-pointer"
                            @click="recentVisible = true"
                        />
                    </div>
                    <div class="transfer-input">
                        <div class="flex flex-col">
                            <n-input
                                @blur="checkReceiver"
                                v-model:value="form.receiver"
                                placeholder=""
                                class="rounded-[22px] h-[46px] leading-[46px] pl-[5px]"
                            ></n-input>
                            <span class="self-end mt-1 h-6 text-xs text-yellow-300">
                                {{ receiverError }}
                            </span>
                        </div>
                    </div>

                    <!-- quantity -->
                    <div class="transfer-title">
                        {{ $t('wallet.amount') }}
                    </div>
                    <div class="transfer-input">
                        <div class="flex flex-col">
                            <div class="flex justify-between">
                                <n-button
                                    @click="selectTokenVisible = true"
                                    class="symbol-button rounded-tl-[22px] rounded-bl-[22px]"
                                >
                                    {{ targetCoin.symbol }}
                                    <icon-down-one
                                        theme="filled"
                                        size="14"
                                        fill="#4a4a4a"
                                        class="ml-1"
                                    />
                                </n-button>
                                <n-input-number
                                    @blur="checkQuantity"
                                    v-model:value="form.quantity"
                                    :min="0"
                                    :max="targetCoin.amount"
                                    :placeholder="targetCoin.amount + ' ' + targetCoin.symbol"
                                />
                                <n-button
                                    @click="
                                        form.quantity = targetCoin.amount;
                                        checkQuantity();
                                    "
                                    class="rounded-tr-[22px] rounded-br-[22px]"
                                >
                                    {{ $t('wallet.all') }}
                                </n-button>
                            </div>
                            <span class="self-end mt-1 h-6 text-xs text-yellow-300">
                                {{ quantityError }}
                            </span>
                        </div>
                    </div>

                    <!-- memo -->
                    <div class="transfer-title" v-show="isShowMemo">
                        {{ $t('wallet.remark') }}（Memo）
                    </div>
                    <div class="transfer-input" v-show="isShowMemo">
                        <n-input
                            v-model="form.memo"
                            placeholder=""
                            class="rounded-[22px] h-[46px] leading-[46px] pl-[5px] mb-[20px]"
                        ></n-input>
                    </div>

                    <!-- submit -->
                    <div class="transfer-buttons">
                        <n-button type="primary" @click="checkSubmit" class="primary-button">
                            {{ $t('wallet.transfer') }}
                        </n-button>
                    </div>
                </form>
            </div>
        </div>

        <!-- recent transfer -->
        <recent-transfer
            :isShow="recentVisible"
            @select="selectTransferHandle"
            @close="recentVisible = false"
        ></recent-transfer>

        <!-- change token -->
        <select-coin
            :isShow="selectTokenVisible"
            @close="selectTokenVisible = false"
            @changeToken="changeTokenHandle"
        ></select-coin>

        <!-- input password -->
        <popup-bottom
            :isShow="confirmVisible"
            :title="$t('wallet.transferInfo')"
            @close="confirmVisible = false"
        >
            <transfer-confirm :transfer="form" :precision="targetCoin.precision"></transfer-confirm>
        </popup-bottom>
    </div>
</template>

<style lang="scss" scoped>
form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.selectedToken-count-tip {
    font-size: 18px;
    margin-left: 12px;
    color: #ffffff;
    letter-spacing: 0;
}

.transfer {
    font-family: PingFang SC;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.transfer-title {
    margin-top: 22px;
    width: 300px;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    color: #333;
    letter-spacing: 0;
}
.transfer-input {
    margin-top: 8px;
    height: 46px;
    width: 300px;
    .transfer-input-all {
        cursor: pointer;
        font-size: 10px;
        width: 45px;
    }

    :deep(.n-input__input-el) {
        height: 46px !important;
    }

    :deep(.n-button--default-type) {
        height: 46px !important;
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

.symbol-button {
    padding: 0 10px;
}

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
</style>
