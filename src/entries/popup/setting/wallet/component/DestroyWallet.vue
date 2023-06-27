<script setup lang="ts">
import { password2 } from '@/common/util/crypto';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();
const router = useRouter();

// 输入密码
const password = ref('');
const submitHandle = () => {
    if (password2(password.value) != store.user().passwordHash)
        return window.msg.error(t('password.error'));

    showConfirmModal.value = true;
};

// 确认销毁
const showConfirmModal = ref(false);
const confirmHandle = () => {
    store.wallet().wallets = [];
    store.wallet().userTokens = [];
    store.user().password = '';
    store.user().passwordHash = '';
    store.setting().isLock = true;

    router.push('/');
    window.msg.success(t('password.deleteSuccess'));
};
</script>

<template>
    <!-- input password -->
    <n-modal :show="props.isShow" @mask-click="$emit('close')">
        <n-card class="w-5/6" :title="$t('setting.confirmDestroy')" :bordered="false">
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

    <!-- again confirm -->
    <n-modal :show="showConfirmModal" @mask-click="$emit('close')">
        <n-card class="w-5/6" :title="$t('setting.reconfirm')" :bordered="false">
            <div>{{ $t('setting.confirmDestroy') }}</div>
            <div class="mt-5 flex justify-end">
                <n-button class="mr-2" @click="$emit('close')">
                    {{ $t('public.cancel') }}
                </n-button>
                <n-button type="primary" @click="confirmHandle">
                    {{ $t('public.ok') }}
                </n-button>
            </div>
        </n-card>
    </n-modal>
</template>

<style lang="scss" scoped></style>
