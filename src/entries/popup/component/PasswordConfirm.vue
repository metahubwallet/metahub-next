<script setup lang="ts">
import { password1, password2 } from '@/common/util/crypto';

interface Props {
    isShow: boolean;
    title: string;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();

// 输入密码
const password = ref('');
const emit = defineEmits(['close', 'confirm']);
const handleSubmit = () => {

    if (password2(password.value) != useUserStore().passhash) {
        return window.msg.error(t('password.error'));
    }
    const pwd = password.value;
    password.value = '';

    emit('close');
    emit('confirm', password1(pwd));
};
</script>

<template>
    <modal
        :is-show="props.isShow"
        :title="props.title"
        @close="$emit('close')"
        @submit="handleSubmit"
    >
        <n-input
            type="password"
            :placeholder="$t('password.inputPasswrod')"
            v-model:value="password"
        />
    </modal>
</template>

<style lang="scss" scoped></style>
