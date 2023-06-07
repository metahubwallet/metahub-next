<script setup lang="ts">
import Global from '@/component/Global.vue';
import { themeOverrides } from '@/asset/theme';
import Index from './index.vue';
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <Global></Global>
        <Index></Index>
    </n-config-provider>
</template>

<style lang="scss" scoped></style>
