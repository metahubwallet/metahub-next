<script setup lang="ts">
import { decrypt, encrypt, md5, password1, password2 } from '@/common/util/crypto';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const passwordOld = ref('');
const passwordNew = ref('');
const passwordConfirm = ref('');

const { t } = useI18n();
const changePasswordHandle = async () => {
    if (password2(passwordOld.value) != store.user().passwordHash)
        return window.msg.warning(t('password.error'));

    if (!passwordNew.value || !passwordConfirm.value)
        return window.msg.warning(t('password.empty'));

    if (passwordNew.value != passwordConfirm.value)
        return window.msg.warning(t('public.passwordNoSame'));

    // 密码存储
    store.user().passwordHash = password2(passwordNew.value);
    // 秘钥重新加密。。。
    for (const wallet of store.wallet().wallets) {
        for (const key of wallet.keys) {
            let pk = decrypt(key.privateKey, md5(wallet.seed + password1(passwordOld.value)));
            key.privateKey = encrypt(pk, md5(wallet.seed + password1(passwordNew.value)));
        }
    }
    store.user().password = '';
    store.setting().isLock = true;
};
</script>

<template>
    <modal
        :is-show="props.isShow"
        :title="$t('setting.changePassword')"
        @close="$emit('close')"
        @submit="changePasswordHandle"
    >
        <!-- old password -->
        <div class="dialog-title">
            {{ $t('setting.oldPassword') }}
        </div>
        <n-input
            class="mb-3"
            show-password
            v-model:value="passwordOld"
            :placeholder="$t('setting.oldPassword')"
        ></n-input>

        <!-- new password -->
        <div class="dialog-title">
            {{ $t('setting.newPassword1') }}
        </div>
        <n-input
            class="mb-3"
            show-password
            v-model:value="passwordNew"
            :placeholder="$t('setting.newPassword1')"
        ></n-input>
        <div class="dialog-title">
            {{ $t('setting.newPassword2') }}
        </div>

        <!-- confirm password -->
        <n-input
            v-model:value="passwordConfirm"
            show-password
            :placeholder="$t('setting.newPassword2')"
            clearable
        ></n-input>
    </modal>
</template>

<style lang="scss" scoped></style>
