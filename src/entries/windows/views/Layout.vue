<script setup lang="ts">
import { password1, password2 } from '@/common/util/crypto.js';

const { t } = useI18n();

const formData = reactive({
    password: '',
});

const user = store.user();

const handleSubmit = async () => {
    console.log('submit');
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
    <div class="app-window app-unlock" v-if="user.isLock">
        <header>
            <img class="logo" src="@/asset/img/logo@2x.png" />
            <div class="tip">{{ $t('password.inputPasswrod') }}</div>
            <div class="tip tip2">{{ $t('password.unlockTip') }}</div>
        </header>
        <n-form :inline="true" :model="formData" @submit.native.prevent>
            <n-input :placeholder="$t('password.toUnlock')" type="password" v-model="formData.password">
                <img class="prefix-img" slot="prefix" src="@/asset/img/initial_unlock@2x.png" />
            </n-input>

            <n-button @click="handleSubmit()" class="submit-bottom" native-type="submit">{{ $t('password.unlock') }}</n-button>
        </n-form>
    </div>
    <div class="app-window" v-else>
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
body {
    margin: 0;
    padding: 0;
    font-family: PingFang SC;
}

.app-window {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

* {
    box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.app-unlock {
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
