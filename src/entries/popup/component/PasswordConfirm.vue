<script setup lang="ts">
import { password2 } from '@/common/util/crypto';

interface Props {
    isShow: boolean;
    title: string;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();

// 输入密码
const password = ref('');
const emit = defineEmits(['close', 'confirm']);
const submitHandle = () => {
    if (password2(password.value) != store.user().passwordHash)
        return window.msg.error(t('password.error'));

    emit('close');
    emit('confirm');
};
</script>

<template>
    <modal
        :is-show="props.isShow"
        :title="props.title"
        @close="$emit('close')"
        @submit="submitHandle"
    >
        <n-input
            type="password"
            :placeholder="$t('password.inputPasswrod')"
            v-model:value="password"
        />
    </modal>
</template>

<style lang="scss" scoped></style>
