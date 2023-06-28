<script setup lang="ts">
interface Props {
    receiverVisible: boolean;
    cpuPlaceholder: string;
    cpuValue: number;
    netPlaceholder: string;
    netValue: number;
    action: string;
    estimatedCost: string;
    transferVisible: boolean;
    receiver: string;
    transfer: boolean;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
    <div>
        <div class="dialog-item" v-show="props.receiverVisible">
            <span class="label">{{ $t('resource.stakeReceiver') }}</span>
            <n-input
                :model-value="props.receiver"
                @update:value="$emit('update:receiver', $event)"
            ></n-input>
        </div>

        <div class="dialog-item">
            <span class="label">CPU {{ $t('resource.amount') }}</span>
            <n-input-number
                :placeholder="props.cpuPlaceholder"
                :model-value="props.cpuValue"
                :min="0"
                @keyup.native="$emit('number')"
                @update:value="$emit('update:cpuValue', $event)"
                clearable
            ></n-input-number>
        </div>

        <div class="dialog-item">
            <span class="label">NET {{ $t('resource.amount') }}</span>
            <n-input-number
                :placeholder="props.netPlaceholder"
                :model-value="props.netValue"
                :min="0"
                @keyup.native="$emit('number')"
                @update:value="$emit('update:netValue', $event)"
                clearable
            ></n-input-number>
        </div>

        <div class="dialog-item" v-show="props.action == 'rent' ? true : false">
            {{ $t('resource.estimatedCost') }}: {{ estimatedCost }}
        </div>

        <div class="dialog-item" v-show="transferVisible">
            <n-checkbox :model-value="props.transfer" @change="$emit('update:transfer', $event)">
                {{ $t('resource.transferStake') }}
            </n-checkbox>
        </div>

        <div class="dialog-foot">
            <n-button @click="$emit('close')" class="mr-2">{{ $t('public.cancel') }}</n-button>
            <n-button type="primary" @click="$emit('submit')">
                {{ $t('public.ok') }}
            </n-button>
        </div>
    </div>
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