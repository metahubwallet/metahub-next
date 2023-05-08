<script lang="ts" setup>
onMounted(async () => {
    const windows = chrome.extension.getBackgroundPage().background.windows;
    windows.returnMessage('ok');
});
</script>

<template>
    <div class="window"></div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.window {
    width: 100%;
    height: 100%;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    overflow: hidden;
}
</style>
