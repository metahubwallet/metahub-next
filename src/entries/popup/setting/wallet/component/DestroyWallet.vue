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
    <modal
        :is-show="showConfirmModal"
        :title="$t('setting.reconfirm')"
        @close="$emit('close')"
        @submit="confirmHandle"
    >
        <div>{{ $t('setting.confirmDestroy') }}</div>
    </modal>
</template>

<style lang="scss" scoped></style>
