<script setup lang="ts">
import moment from 'moment';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const walletStore = useWalletStore();

</script>

<template>
    <n-modal class="w-4/5 bg-white"  :show="props.isShow" @mask-click="$emit('close')">
        <div>
            <div class="p-3">
                <icon-close
                    @click="$emit('close')"
                    theme="outline"
                    size="18"
                    fill="#6f6f6f"
                    class="float-right mr-[8px] mt-[5px] cursor-pointer"
                />
                <div class="text-center font-bold text-lg">{{ $t('wallet.recentTransfers') }}</div>
            </div>
            <div class="grid grid-cols-5 border-y py-[8px] border-gray-200">
                <span class="col-span-3 pl-[6px] text-gray-500 font-bold">{{ $t('wallet.receiverAccount') }}</span>
                <span class="col-span-2 text-center text-gray-500 font-bold">{{ $t('wallet.transationTime') }}</span>
            </div>

            <n-scrollbar class="h-[420px]">
                <div
                    v-for="(item, index) of walletStore.recentTransfers"
                    :key="index"
                    class="grid grid-cols-12 items-center border-gray-200 py-[10px] cursor-pointer"
                    :class="index ? 'border-t' : ''"
                    @click="$emit('select', item)"
                >
                    <div class="col-span-7 ml-2">
                        <span v-if="item.account.length == 42">
                            {{ item.account.substring(0, 10) }}...{{ item.account.substring(36) }}
                        </span>
                        <span v-else>{{ item.account }}</span>
                    </div>

                    <div class="col-span-5 text-center">
                        {{ moment(item.time).format('MM-DD HH:mm') }}
                    </div>
                </div>
            </n-scrollbar>

            <div class="text-center py-[10px] text-gray-400" v-if="walletStore.recentTransfers.length === 0">
                {{ $t('public.noData') }}
            </div>
        </div>
    </n-modal>
</template>

<style lang="scss" scoped></style>
