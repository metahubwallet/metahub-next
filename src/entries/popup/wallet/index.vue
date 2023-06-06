<script setup lang="ts">
const demo = async () => {
    localCache.set('lang', 'zh-CN');
    console.log(await localCache.get('lang'));
};
demo();
</script>

<template>
    <div class="demo">wallet</div>
</template>

<style lang="scss" scoped>
.demo {
    font-size: 100px;
}
</style>
