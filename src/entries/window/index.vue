<script lang="ts" setup>
import { password1, password2 } from '@/common/utils/crypto.js';
require('@/assets/css/common.scss');

const formData = reactive({} as any);

const { isLock } = store.setting();
const { t } = useI18n();

const submit = () => {
    if (!formData.password) window.msg.error(t('password.empty'));

    let password = password1(formData.password);
    let passwordHash = password2(formData.password);
    if (passwordHash != store.user().passwordHash) window.msg.error(t('password.error'));
    chrome.browserAction.setIcon({
        path: '../icons/metahub-128.png',
    });

    store.setting().isLock = false;
    store.user().password = password;
};
</script>

<template>
    <div class="app-window app-unlock" v-if="isLock">
        <header>
            <img class="logo" src="../assets/images/logo@2x.png" />
            <div class="tip">{{ $t('password.inputPasswrod') }}</div>
            <div class="tip tip2">{{ $t('password.unlockTip') }}</div>
        </header>
        <n-form :inline="true" :model="formData" @submit.native.prevent>
            <n-input
                :placeholder="$t('password.toUnlock')"
                type="password"
                v-model="formData.password"
            >
                <img
                    class="prefix-img"
                    slot="prefix"
                    src="../assets/images/Initial_unlock@2x.png"
                />
            </n-input>

            <n-button @click="submit()" class="submit-bottom" native-type="submit">
                {{ $t('password.unlock') }}
            </n-button>
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
}
</style>
