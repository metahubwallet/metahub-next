<script setup lang="ts">
import { password1, password2 } from '@/common/util/crypto.js';

const { t } = useI18n();

const formData = reactive({
    password: '',
});

const user = useUserStore();

const handleSubmit = async () => {
    if (!formData.password) {
        return window.msg.warning(t('password.empty'));
    }

    let password = password1(formData.password);
    let passwordHash = password2(formData.password);
    if (passwordHash != user.passwordHash) {
        return window.msg.warning(t('password.error'));
    }

    user.setPassword(password);
};
</script>

<template>
    <div class="app-unlock" v-if="user.isLock">
        <header>
            <img class="logo" src="@/assets/images/logo@2x.png" />
            <div class="tip">{{ $t('password.inputPasswrod') }}</div>
            <div class="tip tip2">{{ $t('password.unlockTip') }}</div>
        </header>
        <n-form :model="formData">
            <n-input :placeholder="$t('password.toUnlock')" type="password" v-model:value="formData.password" :autofocus="true" @keyup.enter="handleSubmit">
                <img class="prefix-img" slot="prefix" src="@/assets/images/initial_unlock@2x.png" />
            </n-input>

            <n-button @click="handleSubmit" class="submit-bottom">{{ $t('password.unlock') }}</n-button>
        </n-form>
    </div>
    <router-view v-else></router-view>
</template>

<style lang="scss" scoped>
.app-unlock {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    header {
        height: 45%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        .logo {
            display: block;
            width: 80px;
        }

        .tip {
            margin-top: 30px;
            line-height: 20px;
            text-align: center;
            font-size: 16px;
            color: #333;
        }
        .tip2 {
            margin-top: 10px;
            font-size: 12px;
            color: #666;
            padding: 0 10px;
            line-height: 1.5em;
        }
    }

    .n-form {
        margin-top: 30px;
        text-align: center;
        width: 260px;
        // /deep/ .n-input__prefix {
        //     padding: 6px;
        // }
        // /deep/ .n-input__inner {
        //     padding-left: 36px;
        //     font-weight: 400;
        // }
        .n-input {
            margin-bottom: 25px;
            .prefix-img {
                width: 18px;
                height: 22px;
            }
        }
    }
}
</style>
