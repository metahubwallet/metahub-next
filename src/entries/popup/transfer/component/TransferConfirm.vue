<script lang="ts" setup>
import { Transfer } from '@/store/wallet/type';
import chain from '@/common/lib/chain';

interface Props {
    transfer: Transfer;
    precision: number;
}
const props = withDefaults(defineProps<Props>(), {});
const { t } = useI18n();
const router = useRouter();

const receiver = computed(() => {
    const rsl = props.transfer.receiver.length;
    let account = props.transfer.receiver;
    if (rsl == 42) {
        account =
            props.transfer.receiver.substring(0, 14) +
            '...' +
            props.transfer.receiver.substring(rsl - 8);
    }
    return account.toLowerCase();
});

const isShowMemo = computed(() => {
    return props.transfer.receiver.length != 42;
});

// 转账
const wallet = store.wallet();
const handleSubmit = async () => {
    try {
        let receiver = props.transfer.receiver;
        let memo = props.transfer.memo;
        const isEthAddress = receiver.length == 42;
        if (isEthAddress) {
            receiver = 'etheraccount';
            memo = props.transfer.receiver;
        }

        props.transfer.quantity = Number(props.transfer.quantity.toFixed(props.precision));
        let recent = {
            ...props.transfer,
            time: Date.now(),
            memo: isEthAddress ? '' : props.transfer.memo,
        };
        wallet.recentTransations.push(recent);

        const params = [
            props.transfer.contract,
            wallet.currentWallet.name,
            receiver,
            props.transfer.quantity + ' ' + props.transfer.symbol,
            memo,
        ];
        await chain.get().transfer(...params, chain.getAuth());
        window.msg.success(t('wallet.transferSuccess'));

        router.go(-1);
    } catch (e) {
        window.msg.error(chain.getErrorMsg(e));
    }
};
</script>

<template>
    <div class="">
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
                    {{ transfer.quantity.toFixed(props.precision) + ' ' + transfer.symbol }}
                </span>
            </div>
            <div class="info-cell" v-show="isShowMemo">
                <span class="info-cell-key">{{ $t('wallet.remark') }}：</span>
                <span class="info-cell-value">
                    {{ transfer.memo }}
                </span>
            </div>
        </div>
        <n-button type="primary" @click="handleSubmit" class="submit-button">
            {{ $t('wallet.transfer') }}
        </n-button>
    </div>
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
