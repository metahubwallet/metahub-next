<script setup lang="ts">
import { createDiscreteApi } from 'naive-ui';
import useClipboard from 'vue-clipboard3';

const { message } = createDiscreteApi(['message']);
window.msg = message;

// 剪切板
const { toClipboard } = useClipboard();
const { t } = useI18n();
const clip = (value: string) => {
    toClipboard(value)
        .then(window.msg.success(t('setting.copySuccess')))
        .catch(() => {
            window.msg.warning(t('setting.copyFailure'));
        });
};
window.clip = clip;
</script>

<template></template>

<style lang="scss" scoped></style>
