<script setup lang="ts">
interface Props {
    isCustom?: boolean;
    isShow: boolean;
    title?: string;
}
const props = withDefaults(defineProps<Props>(), {
    isCustom: false,
});
</script>

<template>
    <section class="popup" v-show="props.isShow">
        <div class="selector-bg" @click="$emit('close')"></div>
        <div
            class="animate__animated animate__fadeInUpBig selector-container"
            v-show="props.isShow"
        >
            <div v-if="!props.isCustom" class="selector-header">
                <div class="ml-[18px] min-w-[19px]"><slot name="headLeft"></slot></div>
                <div class="title">{{ props.title }}</div>
                <icon-close
                    @click="$emit('close')"
                    theme="outline"
                    size="18"
                    fill="#3f3f3f"
                    class="mr-[10px] cursor-pointer"
                />
            </div>
            <slot></slot>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.popup {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 97;
}

.selector-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.75);
}

.selector-container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    max-height: 500px;
    z-index: 100;
    border-radius: 8px 8px 0 0;
    background-color: white;
    font-size: 16px;

    .selector-header {
        font-size: 16px;
        color: #222;
        height: 40px;
        border-bottom: 1px solid $color-separate;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
            font-size: 16px;
            color: #222;
            font-weight: bold;
        }
        i {
            margin-right: 17px;
        }
    }
}
</style>
