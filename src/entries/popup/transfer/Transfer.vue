<script setup lang="ts">
import chain from '@/common/lib/chain';
import { Balance } from '@/types/tokens';
import { Transfer, TransferRecord } from '@/types/transcation';

const { t } = useI18n();

const wallet = store.wallet();
const recentVisible = ref(false);
const selectTokenVisible = ref(false);

const transfer = reactive({
    sender: '',
    receiver: '',
    amount: 0,
    memo: '',
    token: {
        symbol: '',
        contract: '',
        precision: 4,
    }
} as Transfer);

const targeMaxAmount = ref(0);


// 初始化数据
const route = useRoute();
onBeforeMount(() => {
    const currentSystemToken = store.chain().currentNetwork.token;
    transfer.token = {
        symbol: (route.query.symbol as string) || currentSystemToken.symbol,
        contract: (route.query.contract as string) || currentSystemToken.contract,
        precision: Number(route.query.precision) || currentSystemToken.precision,
    }
    transfer.amount = Number(route.query.amount) || 0;

    wallet.currentUserTokens.forEach((row) => {
        if (row.contract == transfer.token.contract && row.symbol == transfer.token.symbol) {
            targeMaxAmount.value = row.amount;
            transfer.token.precision = row.precision;
        }
    });

    transfer.sender = tool.briefAccount(wallet.currentWallet.name, 14, 8);

    getBalance();
});

// 验证receiver值
const isShowMemo = ref(true);
const receiverError = ref('');
const checkReceiver = async () => {
    if (!transfer.receiver) return (receiverError.value = t('wallet.emptyReceiver'));
    if (transfer.receiver == wallet.currentWallet.name) return (receiverError.value = t('wallet.transferSelf'));

    // 账号不存在
    if (transfer.receiver.length == 42) isShowMemo.value = false;
    else if (transfer.receiver.length != 42 && transfer.receiver.length > 12)
        return (receiverError.value = t('wallet.errorReceiver'));
    else {
        isShowMemo.value = true;
        let accountData = await chain.getApi().getAccount(transfer.receiver);
        if (accountData == null) return (receiverError.value = t('wallet.accountNotExist'));
    }
    receiverError.value = '';
};

// 选择最近记录
const handleSelectTransfer = (tr: TransferRecord) => {
    recentVisible.value = false;
    transfer.receiver = tr.account;
    transfer.memo = tr.memo;
    if (transfer.token) {
        // todo something
    }
    receiverError.value = '';
    checkReceiver();
};

// 验证quantity值
const quantityError = ref('');
const checkQuantity = () => {
    const quantity = isNaN(transfer.amount) ? 0 : transfer.amount;
    if (quantity == 0) return (quantityError.value = t('wallet.emptyAmount'));
    if (quantity < 0) return (quantityError.value = t('wallet.emptyAmount'));
    quantityError.value = '';
};

// 切换token
const handleChangeToken = (coin: Balance) => {
    transfer.token = {
        symbol: coin.symbol,
        contract: coin.contract,
        precision: coin.precision,
    }
    
    targeMaxAmount.value = coin.amount;

    selectTokenVisible.value = false;
    transfer.amount = 0;
    getBalance();
};

// 获取余额
const getBalance = async () => {
    const balance = await chain.getApi().getCurrencyBalance(transfer.token.contract, wallet.currentWallet.name, transfer.token.symbol);
    if (balance) {
        targeMaxAmount.value = Number(balance.split(' ')[0]);
    }
};

// 验证转账信息
const confirmVisible = ref(false);
const checkSubmit = () => {
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
                            v-model:value="transfer.sender"
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
                                v-model:value="transfer.receiver"
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
                                    class="symbol-button rounded-none  rounded-tl-[22px] rounded-bl-[22px]"
                                >
                                    {{ transfer.token.symbol }}
                                    <icon-down-one theme="filled" size="14" fill="#4a4a4a" class="ml-1" />
                                </n-button>
                                <n-input-number
                                    @blur="checkQuantity"
                                    v-model:value="transfer.amount"
                                    :min="0"
                                    :precision="transfer.token.precision"
                                    :step="0.1"
                                    :max="targeMaxAmount"
                                    :placeholder="transfer.amount + ' ' + transfer.token.symbol"
                                />
                                <n-button
                                    @click="
                                        transfer.amount = targeMaxAmount;
                                        checkQuantity();
                                    "
                                    class="all-button rounded-none rounded-tr-[22px] rounded-br-[22px]"
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
                    <div class="transfer-title" v-show="isShowMemo">{{ $t('wallet.remark') }}（Memo）</div>
                    <div class="transfer-input" v-show="isShowMemo">
                        <n-input
                            v-model:value="transfer.memo"
                            placeholder=""
                            class="rounded-[22px] h-[46px] leading-[46px] pl-[5px] mb-[20px]"
                        ></n-input>
                    </div>

                    <!-- submit -->
                    <div class="transfer-buttons">
                        <n-button type="primary" @click="checkSubmit" round class="primary-button mt-[70px]">
                            {{ $t('wallet.transfer') }}
                        </n-button>
                    </div>
                </form>
            </div>
        </div>

        <!-- recent transfer -->
        <recent-transfer
            :isShow="recentVisible"
            @select="handleSelectTransfer"
            @close="recentVisible = false"
        ></recent-transfer>

        <!-- change token -->
        <select-coin
            :isShow="selectTokenVisible"
            @close="selectTokenVisible = false"
            @changeToken="handleChangeToken"
        ></select-coin>

        <!-- input password -->
        <transfer-confirm
            :isShow="confirmVisible"
            :title="$t('wallet.transferInfo')"
            :transfer="transfer"
            @close="confirmVisible = false"
        ></transfer-confirm>
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

.n-button__border {
    border-right: none !important;
}

.symbol-button {
    padding: 0 10px;
    overflow: hidden;
    margin-right: -1px;
}

.all-button {
    border-left: none !important;
    overflow: hidden;
    margin-left: -1px;
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
