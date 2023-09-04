<script lang="ts">
export default {
    // used for keep-alive
    name:'wallet'
};
</script>
<script setup lang="ts">
const walletStore = useWalletStore();
const assetUnit = ref('usd'); // 资产单位
const assetAmount = ref(0); // 资产数量
const isLoading = ref(false);
</script>


<template>
    <div class="full">
        <n-scrollbar class="full" v-if="walletStore.wallets.length > 0">
            <wallet-header :type="assetUnit" :amount="assetAmount" :isLoading="isLoading"></wallet-header>

            <coin-list
                @setUnit="assetUnit = $event"
                @setAmount="assetAmount = $event"
                @isLoading="isLoading = $event"
            ></coin-list>
        </n-scrollbar>

        <no-account v-else></no-account>

    </div>
</template>

<style lang="scss" scoped></style>
