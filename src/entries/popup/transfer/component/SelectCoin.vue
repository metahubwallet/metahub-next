<script setup lang="ts">
import EOSIcon from '@/asset/img/eos_icon.png';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const wallet = store.wallet();
</script>

<template>
    <modal
        :isShow="props.isShow"
        :title="$t('wallet.symbols')"
        @close="$emit('close')"
        :isCusFooter="true"
    >
        <n-scrollbar>
            <div class="grid grid-cols-12 border-y py-[8px] border-gray-200">
                <span class="col-span-3"></span>
                <span class="col-span-6">{{ $t('wallet.symbol') }}</span>
                <span class="col-span-3 text-right pr-[12px]">{{ $t('wallet.balance') }}</span>
            </div>
            <div
                v-for="(coin, index) of wallet.userTokens"
                :key="index"
                class="grid grid-cols-12 items-center border-gray-200 py-[10px] cursor-pointer"
                :class="index ? 'border-t pt-0' : ''"
                @click="$emit('changeToken', coin)"
            >
                <div class="col-span-2">
                    <img class="icon-img w-10 h-10" :src="coin.logo ? coin.logo : EOSIcon" />
                </div>

                <div class="col-span-8 flex flex-col ml-[12px]">
                    <div class="coin-symbol text-[16px]">{{ coin.symbol }}</div>
                    <div class="coin-contract text-[12px]">
                        {{ coin.contract }}
                    </div>
                </div>

                <div class="col-span-2 text-right pr-[12px]">{{ coin.amount }}</div>
            </div>
        </n-scrollbar>
    </modal>
</template>

<style lang="scss" scoped></style>
