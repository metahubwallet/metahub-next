<script setup lang="ts">
export interface Props {
    isPrev: boolean; // cur是否变更为prev页
    title: string; // 当前文本
}

const props = withDefaults(defineProps<Props>(), {
    isPrev: false,
    titles: () => [],
});
</script>

<template>
    <div class="cover-top">
        <icon-arrow-left @click="$router.go(-1)" theme="outline" size="24" fill="#222222" />

        <div class="top-title _effect" :class="{ '_effect--50': props.isPrev }">
            {{ props.title }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.top-back-img {
    width: 11px;
    height: 32px;
}

.title-center {
    align-items: center;
    justify-content: center;
}
</style>
