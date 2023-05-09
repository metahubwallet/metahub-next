<script lang="ts" setup>
import chain from '@/common/libs/chain';
interface Props {
    resourceData: any;
    ramprice: any;
}
const props = withDefaults(defineProps<Props>(), {});

const dialogVisible = ref(false);
const action = ref('');
const placeholder = ref('');
const inputValue = ref('');
const dialogTitle = ref('');
const receiver = ref('');
const submitLoading = ref(false);

const { currentWallet: account } = store.user();

onBeforeMount(() => {
    receiver.value = account.name;
});

const emit = defineEmits(['loadData', 'refreshTokens']);

const { t } = useI18n();
const beforeSubmit = async (action: any) => {
    action.value = action;

    if (action.value == 'buyRam') {
        placeholder.value = props.resourceData.core_liquid_balance;
        dialogTitle.value = t('resource.buy') + ' ' + t('resource.ram');
    } else if (action.value == 'sellRam') {
        placeholder.value =
            ((props.resourceData.ram_quota - props.resourceData.ram_usage) / 1024).toFixed(4) +
            ' KB';
        dialogTitle.value = t('resource.sell') + ' ' + t('resource.ram');
    }
    dialogVisible.value = true;
};

const { currentSymbol } = store.user();
const formatValue = (value: string) => {
    const precision = store.chain().currentNetwork.token.precision;
    let fValue = parseFloat(value);
    if (isNaN(fValue)) fValue = 0;

    return fValue.toFixed(precision) + ' ' + currentSymbol;
};

const onSubmit = async () => {
    if (!inputValue.value || inputValue.value == '0')
        return window.msg.warning(t('resource.valueError'));

    try {
        // 发起操作
        submitLoading.value = true;
        let result = {};
        if (action.value == 'buyRam') {
            // 为自己买
            let value = formatValue(inputValue.value);
            console.log(account.name, receiver.value, value);
            result = await chain.get().buyRam(account.name, receiver.value, value, chain.getAuth());
        } else if (action.value == 'sellRam') {
            let value = parseInt(parseFloat(inputValue.value) * 1024 + '');
            console.log('sellRam ' + value);
            if (value <= 15) {
                dialogVisible.value = false;
                submitLoading.value = false;
                return window.msg.warning(t('resource.valueSizeError'));
            }
            result = await chain.get().sellRam(account.name, value, chain.getAuth());
        }
        window.msg.success(t('resource.stakeSuccess'));

        // 清空输入框
        inputValue.value = '';
        //刷新数据
        emit('loadData');
        emit('refreshTokens', true);
    } catch (e) {
        window.msg.error(chain.getErrorMsg(e));
    } finally {
        dialogVisible.value = false;
        submitLoading.value = false;
    }
};

const number = async () => {
    if (inputValue.value) inputValue.value = inputValue.value.replace(/[^\.\d]/g, '');
};

const forOther = async () => {
    if (!receiver.value || receiver.value == '') return;
};
</script>

<template>
    <div class="grid-content">
        <div class="title">
            {{ $t('resource.ram') }}
        </div>
        <div class="content">
            <div class="progress-content">
                <div class="progress-text">
                    <span>{{ $t('resource.used') }}</span>
                    <span>
                        {{ (resourceData.ram_usage / 1024).toFixed(2) }} KB/{{
                            (resourceData.ram_quota / 1024).toFixed(2)
                        }}
                        KB
                    </span>
                </div>
                <n-progress
                    :percentage="resourceData.ram_percentage"
                    :show-text="false"
                    :stroke-width="9"
                    class="progress"
                ></n-progress>
            </div>
            <div class="content-line line1">
                <div class="item">
                    <span>{{ $t('resource.price') }}</span>
                    <span class="small">
                        {{ props.ramprice.toFixed(4) }} {{ currentSymbol }}/KB
                    </span>
                </div>
            </div>
            <div class="content-line line2">
                <n-button @click="beforeSubmit('buyRam')">{{ $t('resource.buy') }}</n-button>
                <n-button @click="beforeSubmit('sellRam')">{{ $t('resource.sell') }}</n-button>
            </div>
        </div>
        <n-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="80%"
            :modal-append-to-body="false"
        >
            <div class="dialog-item">
                <span class="label">{{ $t('resource.stakeReceiver') }}</span>
                <n-input v-model="receiver" @keyup.native="forOther()"></n-input>
            </div>
            <div class="dialog-item">
                <span class="label">{{ $t('resource.amount') }}</span>
                <n-input
                    :placeholder="placeholder"
                    v-model="inputValue"
                    @keyup.native="number()"
                    clearable
                ></n-input>
            </div>
            <div class="dialog-foot">
                <n-button @click="dialogVisible = false">{{ $t('public.cancel') }}</n-button>
                <n-button type="primary" @click="onSubmit()" :loading="submitLoading">
                    {{ $t('public.ok') }}
                </n-button>
            </div>
        </n-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.grid-content {
    .title {
        font-size: 16px;
        color: #222;
        letter-spacing: 0;
        padding-left: 15px;
        // margin: 0px 0px 0px 15px;
        line-height: 58px;
        font-weight: bold;
    }

    .content {
        background: #ffffff;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        padding: 0 15px;
        overflow: hidden;
        border-top: 1px solid $separate-color;

        .content-line {
            padding: 0px;
            &.line1 {
                padding: 5px 0;
                display: flex;
                flex-direction: row;
                border-bottom: 1px solid $separate-color;
                .item {
                    width: 50%;
                    height: 28px;
                    line-height: 28px;
                    font-size: 12px;
                    color: #222;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    &:first-child {
                        padding-right: 15px;
                    }
                    &:nth-child(2) {
                        padding-left: 15px;
                    }
                    &.clickable {
                        cursor: pointer;
                    }

                    span {
                        display: block;
                        &.small {
                            font-weight: 400;
                            font-size: 12px;
                            color: #222;
                        }
                    }
                }
            }
            &.line2 {
                padding: 8px 0;
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                .el-button {
                    background: rgba(252, 252, 252, 0.4);
                    box-shadow: 0px 1px 3px 0px rgba(255, 66, 216, 0.11);
                    border-radius: 10px;
                    border: 1px solid #dbdbdb;
                    width: 73px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: #222;
                    font-weight: 500;
                }
                .el-button:focus,
                .el-button:hover {
                    background: rgba(252, 252, 252, 1);
                }
            }
        }

        .progress-content {
            margin-top: 15px;
            margin-bottom: 5px;
            position: relative;
            .progress-text {
                font-size: 12px;
                font-weight: 400;
                vertical-align: middle;
                color: #222;
                display: flex;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
            }
        }
    }
    .dialog-item {
        margin-bottom: 10px;
        span.label {
            display: block;
            line-height: 20px;
            padding-bottom: 3px;
        }
    }
    .dialog-foot {
        padding: 15px 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        .el-button {
            flex-flow: 1;
        }
    }

    .stakedDetail {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba(0, 0, 0, 0.75);
        display: flex;
        flex-direction: column-reverse;
    }
}
</style>
