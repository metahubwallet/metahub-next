<script setup lang="ts">
interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();
const router = useRouter();

// 确认销毁
const showConfirmModal = ref(false);
const handleConfirm = async () => {
    store.wallet().setWallets([]);
    store.wallet().setUserTokens({});
    store.user().setPasswordHash('');
    store.user().setLocked();

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
        @submit="handleConfirm"
    >
        <div>{{ $t('setting.confirmDestroy') }}</div>
    </modal>
</template>

<style lang="scss" scoped></style>
