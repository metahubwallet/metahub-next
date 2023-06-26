<script setup lang="ts">
const wallet = store.wallet();
</script>

<template>
    <n-scrollbar>
        <div
            v-for="(coin, index) of wallet.userTokens"
            :key="index"
            class="grid grid-cols-12 items-center border-gray-200 py-[10px] cursor-pointer"
            :class="index ? 'border-t' : ''"
            @click="$emit('changeToken', coin)"
        >
            <div class="col-span-2">
                <img class="icon-img ml-[14px]" :src="coin.logo" />
            </div>

            <div class="col-span-8">
                <div class="coin-symbol ml-[20px]">{{ coin.symbol }}</div>
                <div class="coin-contract">{{ $t('wallet.contract') }}: {{ coin.contract }}</div>
            </div>

            <div class="col-span-2">{{ $t('wallet.balance') }}: {{ coin.amount }}</div>
        </div>
    </n-scrollbar>
</template>

<style lang="scss" scoped></style>
