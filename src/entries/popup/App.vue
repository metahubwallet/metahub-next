<script setup lang="ts">
import Global from '@/component/Global';
import { themeOverrides } from '@/common/util/theme';
import Index from './index.vue';

onBeforeMount(async () => {
    await useChainStore().init();
    await useUserStore().init();
    await useWalletStore().init();
    await useSettingStore().init();
});


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