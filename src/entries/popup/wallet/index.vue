<script setup lang="ts">
const showTokenSelect = ref(false);

const wallet = store.wallet();

const assetUnit = ref('usd'); // 资产单位
const assetAmount = ref(0); // 资产数量

// 选择操作页面
const selectPageHandle = (index: number) => {};
</script>

<template>
    <div>
        <n-scrollbar class="full" v-if="wallet.wallets.length > 0">
            <wallet-header
                :type="assetUnit"
                :amount="assetAmount"
                @select="selectPageHandle"
            ></wallet-header>

            <coin-list @setUnit="assetUnit = $event" @setAmount="assetAmount = $event"></coin-list>
        </n-scrollbar>

        <no-account v-else></no-account>

        <token-selector
            :isShow="showTokenSelect"
            v-model="showTokenSelect"
            @close="showTokenSelect = false"
        ></token-selector>
    </div>
</template>

<style lang="scss" scoped></style>
