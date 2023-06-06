<script setup lang="ts">
import Global from '@/component/Global.vue';
import { themeOverrides } from '@/asset/theme';
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <Global></Global>
        <router-view></router-view>
    </n-config-provider>
</template>

<style lang="scss" scoped></style>
