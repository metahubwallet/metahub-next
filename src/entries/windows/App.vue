<script setup lang="ts">
import { themeOverrides } from '@/common/util/theme';
import Global from '@/component/Global';
import Layout from '@/entries/windows/views/Layout.vue';

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
                    <Layout></Layout>
                </Global>
            </n-message-provider>
        </n-dialog-provider>
    </n-config-provider>
</template>

<style lang="scss" scoped></style>