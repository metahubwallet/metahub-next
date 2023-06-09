<script setup lang="ts">
const showTokenSelect = ref(false);
</script>

<template>
    <div>
        <no-account></no-account>

        <token-selector
            :isShow="showTokenSelect"
            v-model="showTokenSelect"
            @close="showTokenSelect = false"
        ></token-selector>
    </div>
</template>

<style lang="scss" scoped></style>
