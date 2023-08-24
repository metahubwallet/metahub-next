<script lang="ts" setup>
import chain from '@/common/lib/chain';
import { Transfer, TransferRecord } from '@/types/transcation';

interface Props {
    isShow: boolean;
    title: string;
    transfer: Transfer;
}
const props = withDefaults(defineProps<Props>(), {});
const { t } = useI18n();
const router = useRouter();
const wallet = store.wallet();

const submiting = ref(false);

const receiver = computed(() => {
    const rsl = props.transfer.receiver.length;
    let account = props.transfer.receiver;
    if (rsl == 42) {
        account = props.transfer.receiver.substring(0, 14) + '...' + props.transfer.receiver.substring(rsl - 8);
    }
    return account.toLowerCase();
});

const isShowMemo = computed(() => {
    return props.transfer.receiver.length != 42;
});

// 转账

const handleSubmit = async () => {
    try {
        submiting.value = true;
        let receiver = props.transfer.receiver;
        let memo = props.transfer.memo;
        const isEthAddress = receiver.length == 42;
        if (isEthAddress) {
            receiver = 'etheraccount';
            memo = props.transfer.receiver;
        }

        props.transfer.amount = Number(props.transfer.amount.toFixed(props.transfer.token.precision));
        let recent: TransferRecord = {
            account: props.transfer.receiver,
            time: Date.now(),
            memo: isEthAddress ? '' : props.transfer.memo,
            token: props.transfer.token,
        };

        wallet.addRecentTransfer(recent);

        // console.log(recent);
        // console.log(wallet.recentTransfers);

        const params: [ string, string, string, string, string ] = [
            props.transfer.token.contract,
            wallet.currentWallet.name,
            receiver,
            props.transfer.amount.toFixed(props.transfer.token.precision) + ' ' + props.transfer.token.symbol,
            memo,
        ];

        await chain.getApi().transfer(...params, chain.getAuth());
        window.msg.success(t('wallet.transferSuccess'));
        router.go(-1);
    } catch (e) {
        console.log(e);
        window.msg.error(chain.getErrorMsg(e));
    } finally {
        submiting.value = false;
    }
};
</script>

<template>
    <popup-bottom :isShow="props.isShow" :title="props.title" @close="$emit('close')">
        <div class="list-container">
            <div class="info-cell">
                <span class="info-cell-key">{{ $t('wallet.paymentAccount') }}：</span>
                <span class="info-cell-value">
                    {{ transfer.sender }}
                </span>
            </div>
            <div class="info-cell">
                <span class="info-cell-key">{{ $t('wallet.receiverAccount') }}：</span>
                <span class="info-cell-value" :title="transfer.receiver">
                    {{ receiver }}
                </span>
            </div>
            <div class="info-cell">
                <span class="info-cell-key">{{ $t('wallet.amount') }}：</span>
                <span class="info-cell-value">
                    {{ transfer.amount.toFixed(transfer.token.precision) + ' ' + transfer.token.symbol }}
                </span>
            </div>
            <div class="info-cell" v-show="isShowMemo">
                <span class="info-cell-key">{{ $t('wallet.remark') }}：</span>
                <span class="info-cell-value">
                    {{ transfer.memo }}
                </span>
            </div>
        </div>
        <n-button type="primary" @click="handleSubmit" class="submit-button" :disabled="submiting">
            <span>{{ $t('wallet.transfer') }}</span>
            <icon-loading-four class="ml-4" size="1rem" :spin="true" v-show="submiting"></icon-loading-four>
        </n-button>
    </popup-bottom>
</template>

<style lang="scss" scoped>
.list-container {
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
}

.title-cell {
    font-size: 17px;
    color: #333333;
    height: 50px;
    border-bottom: 1px solid $color-separate;
    .title {
        margin-left: 15px;
        font-weight: 600;
    }
}

.info-cell {
    margin: 12px 15px;
    height: 33px;
    border-bottom: 1px solid $color-separate;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    .info-cell-key {
        width: 100px;
        height: 33px;
        font-size: 15px;
        color: #333333;
        font-weight: 600;
    }
    .info-cell-value {
        flex: 1;
        height: 33px;
        font-size: 15px;
        color: rgb(102, 102, 102);
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.submit-button {
    margin: 20px 15px;
    width: 345px;
    border-radius: 22px;
    height: 44px;
}
</style>
