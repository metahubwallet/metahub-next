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
    <n-modal :show="props.isShow" @mask-click="$emit('close')">
        <n-card class="w-5/6" :title="props.title" :bordered="false">
            <n-input
                type="password"
                :placeholder="$t('password.inputPasswrod')"
                v-model:value="password"
            />
            <div class="mt-5 flex justify-end">
                <n-button class="mr-2" @click="$emit('close')">
                    {{ $t('public.cancel') }}
                </n-button>
                <n-button type="primary" @click="submitHandle">
                    {{ $t('public.ok') }}
                </n-button>
            </div>
        </n-card>
    </n-modal>
</template>

<style lang="scss" scoped></style>
