<script setup lang="ts">
const walletStore = useWalletStore();
const assetUnit = ref('usd'); // 资产单位
const assetAmount = ref(0); // 资产数量
const isLoad = ref(false);

const isSelectToken = ref(false);
</script>

<template>
    <div class="full">
        <n-scrollbar class="full" v-if="walletStore.wallets.length > 0">
            <wallet-header :type="assetUnit" :amount="assetAmount" :isLoad="isLoad"></wallet-header>

            <coin-list
                @setUnit="assetUnit = $event"
                @setAmount="assetAmount = $event"
                @isLoad="isLoad = $event"
            ></coin-list>
        </n-scrollbar>

        <no-account v-else></no-account>

        <token-selector :is-show="isSelectToken" @close="isSelectToken = false"></token-selector>
    </div>
</template>

<style lang="scss" scoped></style>
