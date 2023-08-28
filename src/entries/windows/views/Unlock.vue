<script setup lang="ts">

onMounted(async () => {
    // save result
    await chrome.storage.session.set({ windowResult: { unlock: true } });

    window.close();
});
</script>

<template>
    <div class="unlocked"></div>
</template>

<style lang="scss" scoped>

</style>
