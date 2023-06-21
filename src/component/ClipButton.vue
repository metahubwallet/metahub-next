<script setup lang="ts">
import useClipboard from 'vue-clipboard3';

interface Props {
    value: string;
}
const props = withDefaults(defineProps<Props>(), {});

// 剪切板
const { toClipboard } = useClipboard();
const { t } = useI18n();
const clip = () => {
    toClipboard(props.value)
        .then(window.msg.success(t('setting.copySuccess')))
        .catch(() => {
            window.msg.warning(t('setting.copyFailure'));
        });
};
</script>

<template>
    <div>
        {{ $props.value }}
        <img class="account-cell-key-copy" src="@/asset/img/account_copy2.png" @click="clip" />
    </div>
</template>

<style lang="scss" scoped>
.account-cell-key-copy {
    height: 13px;
    width: 13px;
    margin-left: 4px;
    cursor: pointer;
}
</style>
