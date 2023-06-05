<script setup lang="ts">
interface Props {
    iconClass: string;
    className?: string;
}
const props = withDefaults(defineProps<Props>(), {});

const iconName = computed(() => {
    return `#icon-${props.iconClass}`;
});

const svgClass = computed(() => {
    if (props.className) return 'svg-icon ' + props.className;
    else return 'svg-icon';
});
</script>

<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
