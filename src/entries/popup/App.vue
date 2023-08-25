<script setup lang="ts">
import Global from '@/component/Global';
import { themeOverrides } from '@/common/util/theme';
import Index from './index.vue';
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides" abstract>
        <n-dialog-provider>
            <n-message-provider>
                <Global>
                    <Index></Index>
                </Global>
            </n-message-provider>
        </n-dialog-provider>
    </n-config-provider>
</template>

<style lang="scss" scoped></style>