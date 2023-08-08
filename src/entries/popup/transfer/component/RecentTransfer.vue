<script setup lang="ts">
import moment from 'moment';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const wallet = store.wallet();
const { timeFormat } = tool;
</script>

<template>
    <modal :is-show="props.isShow" :title="$t('wallet.recentTransfers')" cus-footer @close="$emit('close')">
        <div class="grid grid-cols-5 border-y py-[8px] border-gray-200">
            <span class="col-span-3 pl-[6px] text-gray-500 font-bold">{{ $t('wallet.receiverAccount') }}</span>
            <span class="col-span-2 text-center text-gray-500 font-bold">{{ $t('wallet.transationTime') }}</span>
        </div>

        <n-scrollbar>
            <div
                v-for="(item, index) of wallet.recentTransations"
                :key="index"
                class="grid grid-cols-12 items-center border-gray-200 py-[10px] cursor-pointer"
                :class="index ? 'border-t' : ''"
                @click="$emit('select', item)"
            >
                <div class="col-span-7 ml-2">
                    <span v-if="item.receiver.length == 42">
                        {{ item.receiver.substring(0, 10) }}...{{ item.receiver.substring(36) }}
                    </span>
                    <span v-else>{{ item.receiver }}</span>
                </div>

                <div class="col-span-5 text-center">
                    {{ moment(item.time).format('MM-DD HH:mm') }}
                </div>
            </div>

            <div class="text-center py-[10px] text-gray-400" v-if="wallet.recentTransations.length === 0">
                {{ $t('public.noData') }}
            </div>
        </n-scrollbar>
    </modal>
</template>

<style lang="scss" scoped></style>
