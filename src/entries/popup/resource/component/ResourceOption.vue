<script setup lang="ts">
import chain from '@/common/lib/chain';
import { powerup } from '@/common/lib/powerup';
import { ResourceData } from '@/types/resouse';

interface Props {
    isShow: boolean;
    action: string;
    resources: { [key: string]: ResourceData };
}

interface FromData {
    receiver: string,
    cpuValue: number | null,
    netValue: number | null,
    transfer: boolean,
    estimatedCost: string,
    submiting: boolean,
    cpuPlaceholder: string,
    netPlaceholder: string,
    receiverVisible: boolean,
    transferVisible: boolean,
};

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['loadData', 'close']);

const { t } = useI18n();
const walletStore = useWalletStore();
const { currentSymbol } = useChainStore();

const modalTitle = ref('');
const formData: FromData = reactive({
    receiver: ref(walletStore.currentWallet.name),
    cpuValue: 0,
    netValue: 0,
    transfer: false,
    estimatedCost: '',
    submiting: false,
    cpuPlaceholder: '',
    netPlaceholder: '',
    receiverVisible: false,
    transferVisible: false,
});

watch(() => props.isShow, (isShow: boolean) => {
    if (isShow) {
        // formData
        reMount();
    }
})

const reMount = async () => {
    formData.cpuValue = null;
    formData.netValue = null;
    formData.receiverVisible = false;
    formData.transferVisible = false;

    if (props.action == 'stake') {
        modalTitle.value = t('resource.stake') + t('resource.resources');

        formData.receiverVisible = true;
        formData.transferVisible = true;
        formData.cpuPlaceholder = props.resources.cpu.stake_max + ' ' + currentSymbol;
        formData.netPlaceholder = props.resources.net.stake_max + ' ' + currentSymbol;
        
    } else if (props.action == 'refund') {
        modalTitle.value = t('resource.unstake') + t('resource.resources');
        
        formData.cpuPlaceholder = props.resources.cpu.self_delegated_bandwidth_weight;
        formData.netPlaceholder = props.resources.net.self_delegated_bandwidth_weight;
        
    } else if (props.action == 'rent') {
        modalTitle.value = t('resource.rent') + t('resource.resources');
        formData.receiverVisible = true;
        formData.cpuPlaceholder = formatValue(0);
        formData.netPlaceholder = formatValue(0);
        
        formData.cpuValue = 5000;
        formData.netValue = 500;
        await getEstimatedCost();
    }
};


// 计算预计花费
const getEstimatedCost = async () => {
    if (props.action == 'rent') {
        let cpu = formatValue(formData.cpuValue);
        let net = formatValue(formData.netValue);
        let parms = powerup('', '', cpu, net, await getPowupState());
        formData.estimatedCost = parms.max_payment;
    }
};

// 获取弹出状态
const getPowupState = async () => {
    let powupState = (await localCache.get('powupState', null)) as any;
    if (powupState == null || (powupState && Date.now() - powupState.timestamp > 86400000)) {
        const result = await chain.getApi().getPowupState();
        if (result) {
            powupState = {
                state: result,
                timestamp: Date.now(),
            };
            await localCache.set('powupState', powupState);
        }
    }
    return powupState?.state;
};


// 格式化值
const formatValue = (value: number | null) => {
    if (value == null) {
        value = 0; 
    }
    const precision = useChainStore().currentNetwork?.token?.precision;
    return value.toFixed(precision) + ' ' + currentSymbol;
};

const handleSubmit = async () => {
    let cpuQuantity = formatValue(formData.cpuValue);
    let netQuantity = formatValue(formData.netValue);

    if (cpuQuantity == formatValue(0) && netQuantity == formatValue(0)) {
        return window.msg.warning(t('resource.valueError'));
    }
    try {
        formData.submiting = true;
        if (props.action == 'stake') {
            await chain
                .getApi()
                .delegatebw(
                    walletStore.currentWallet.name,
                    formData.receiver,
                    netQuantity,
                    cpuQuantity,
                    formData.transfer,
                    chain.getAuth()
                );
        } else if (props.action == 'refund') {
            await chain
                .getApi()
                .undelegatebw(walletStore.currentWallet.name, formData.receiver, netQuantity, cpuQuantity, chain.getAuth());
        } else if (props.action == 'rent') {
            let parms = powerup(
                walletStore.currentWallet.name,
                formData.receiver,
                cpuQuantity,
                netQuantity,
                await getPowupState()
            );

            await chain.getApi().powerup(parms, chain.getAuth());
        }
        window.msg.success(t('resource.stakeSuccess'));

        //刷新数据
        emit('loadData');
    } catch (e) {
        console.log(e);
        window.msg.error(chain.getErrorMsg(e));
    } finally {
        formData.submiting = false;
        emit('close');
    }
};
</script>

<template>
    <modal :is-show="props.isShow" :title="modalTitle" cus-footer @close="$emit('close')">
        <n-form :model="formData">
            <div class="dialog-item" v-show="formData.receiverVisible">
                <span class="label">{{ $t('resource.stakeReceiver') }}</span>
                <n-input v-model:value="formData.receiver"></n-input>
            </div>

            <div class="dialog-item">
                <span class="label">CPU {{ $t('resource.amount') }}</span>
                <n-input-number
                    :placeholder="formData.cpuPlaceholder"
                    v-model:value="formData.cpuValue"
                    :min="0"
                    :precision="4"
                    :step="0.1"
                    @update:value="getEstimatedCost"
                    clearable
                >
                    <template #suffix>
                        <span class="text-gray-400 text-sm">EOS</span>
                    </template>
                </n-input-number>
            </div>

            <div class="dialog-item">
                <span class="label">NET {{ $t('resource.amount') }}</span>
                <n-input-number
                    :placeholder="formData.netPlaceholder"
                    v-model:value="formData.netValue"
                    :min="0"
                    :precision="4"
                    :step="0.1"
                    @update:value="getEstimatedCost"
                    clearable
                >
                    <template #suffix>
                        <span class="text-gray-400 text-sm">EOS</span>
                    </template>
                </n-input-number>
            </div>

            <div class="dialog-item" v-show="props.action == 'rent' ? true : false">
                {{ $t('resource.estimatedCost') }}: {{ formData.estimatedCost }}
            </div>

            <div class="dialog-item" v-show="formData.transferVisible">
                <n-checkbox v-model:checked="formData.transfer" @change="$emit('update:transfer', $event)">
                    {{ $t('resource.transferStake') }}
                </n-checkbox>
            </div>

            <div class="dialog-foot">
                <n-button @click="$emit('close')" class="mr-2">{{ $t('public.cancel') }}</n-button>
                <n-button type="primary" @click="handleSubmit" :disabled="formData.submiting">
                    <span>{{ $t('public.ok') }}</span>
                    <icon-loading-four class="ml-3" size="0.9rem" :spin="true" v-show="formData.submiting"></icon-loading-four>
                </n-button>
            </div>
        </n-form>
    </modal>
</template>

<style lang="scss" scoped>
.dialog-item {
    margin: 10px 15px;
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
}
</style>
