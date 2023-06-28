<script setup lang="ts">
import { password2 } from '@/common/util/crypto';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();
const router = useRouter();

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
    <password-confirm
        :is-show="props.isShow"
        :title="$t('setting.confirmDestroy')"
        @close="$emit('close')"
        @confirm="showConfirmModal = true"
    ></password-confirm>

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
