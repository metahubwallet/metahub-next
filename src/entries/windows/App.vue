<script setup lang="ts">
import Global from '@/component/Global.vue';
import { themeOverrides } from '@/common/util/theme';
import Layout from '@/entries/windows/views/Layout.vue';

const chain = store.chain();
const wallet = store.wallet();
const user = store.user();
const setting = store.setting();

onBeforeMount(async () => {

    await chain.init();
    await wallet.init();
    await user.init();
    await setting.init();

});


</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <Global></Global>
        <Layout></Layout>
    </n-config-provider>
</template>

<style lang="scss" scoped></style>