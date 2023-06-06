<script setup lang="ts">
const { t } = useI18n();
const demo = () => {
    console.log(t('public.language'));
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
