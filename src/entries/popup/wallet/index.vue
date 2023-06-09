<script setup lang="ts">
const showTokenSelect = ref(false);
</script>

<template>
    <div>
        <n-button @click="showTokenSelect = true">click</n-button>
        <token-selector
            :isShow="showTokenSelect"
            v-model="showTokenSelect"
            @close="showTokenSelect = false"
        ></token-selector>
    </div>
</template>

<style lang="scss" scoped></style>
