<script setup lang="ts">
const wallet = store.wallet();
const assetUnit = ref('usd'); // 资产单位
const assetAmount = ref(0); // 资产数量

const isSelectToken = ref(false);
</script>

<template>
    <div>
        <n-scrollbar class="full" v-if="wallet.wallets.length > 0">
            <wallet-header :type="assetUnit" :amount="assetAmount"></wallet-header>

            <coin-list @setUnit="assetUnit = $event" @setAmount="assetAmount = $event"></coin-list>
        </n-scrollbar>

        <no-account v-else></no-account>

        <token-selector
            :isShow="isSelectToken"
            v-model="isSelectToken"
            @close="isSelectToken = false"
        ></token-selector>
    </div>
</template>

<style lang="scss" scoped></style>
