<script setup lang="ts">
import useClipboard from 'vue-clipboard3';

interface Props {
    value: string;
    type?: '1' | '2';
}
const props = withDefaults(defineProps<Props>(), {
    type: '1',
});

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
    <div v-if="props.type === '1'">
        <span class="wrap-line">{{ props.value }}</span>
        <img class="account-cell-key-copy" src="@/assets/images/account_copy2.png" @click="clip" />
    </div>

    <div v-else class="flex items-center">
        <div class="wrap-line text-[12px] text-[#848484] px-[8px]">{{ props.value }}</div>
        <div class="copy-btn" @click="clip">{{ $t('setting.copy') }}</div>
    </div>
</template>

<style lang="scss" scoped>
.wrap-line {
    word-break: break-all;
}
.account-cell-key-copy {
    height: 13px;
    width: 13px;
    margin-left: 4px;
    cursor: pointer;
    display: inline-block;
    margin-bottom: 2px;
}

.copy-btn {
    word-break: keep-all;
    height: 24px;
    text-align: center;
    padding: 0 12px;
    border: 0;
    background-color: #e7faf7;
    border-radius: 12px;
    font-size: 13px;
    cursor: pointer;
}
</style>
