<script lang="ts" setup>
interface Props {
    transfer: any;
    precision: any;
}
const props = withDefaults(defineProps<Props>(), {});

const submitLoading = ref(false);

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

const showMemo = computed(() => {
    return props.transfer.receiver.length != 42;
});

const emit = defineEmits(['close-click', 'submit-click']);
const submit = () => {
    submitLoading.value = true;
    emit('submit-click');
};
</script>

<template>
    <div @click="$event.stopPropagation()" class="box-container">
        <div class="title-cell">
            <div class="title">{{ $t('wallet.transferInfo') }}</div>
            <i @click="$emit('close-click')" class="el-message-box__close el-icon-close close"></i>
        </div>
        <div class="list-container">
            <div class="info-cell">
                <span class="info-cell-key">{{ $t('wallet.paymentAccount') }}：</span>
                <span class="info-cell-value">
                    {{ transfer.from }}
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
                    {{ parseFloat(transfer.quantity).toFixed(precision) + ' ' + transfer.symbol }}
                </span>
            </div>
            <div class="info-cell" v-show="showMemo">
                <span class="info-cell-key">{{ $t('wallet.remark') }}：</span>
                <span class="info-cell-value">
                    {{ transfer.memo }}
                </span>
            </div>
        </div>
        <el-button :loading="submitLoading" @click="submit()" class="submit-button">
            {{ $t('wallet.transfer') }}
        </el-button>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';

.bg-img {
    width: 7.5px;
    height: auto;
    margin-right: 15px;
}
.close {
    width: auto;
    height: auto;
    margin-right: 15px;
}
.box-container {
    border-radius: 8px 8px 0 0;
    background-color: white;
    font-size: 16px;

    .title-cell,
    .import-wallet {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .import-wallet {
        height: 65px;
        margin-left: 15px;
    }

    .list-container {
        max-height: 400px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .title-cell {
        font-size: 17px;
        color: #333333;
        height: 50px;
        border-bottom: 1px solid $separate-color;
        .title {
            margin-left: 15px;
            font-weight: 600;
        }
    }

    .info-cell {
        margin: 12px 15px;
        height: 33px;
        border-bottom: 1px solid $separate-color;
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
}
</style>
