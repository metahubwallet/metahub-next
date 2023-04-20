<script setup lang="ts">
import { password1, password2 } from '@/common/utils/crypto';

const router = useRouter();
const { t } = useI18n();

const password = ref('');
const submit = () => {
    if (!password.value) alert(t('password.empty'));

    let passwordHash = password2(password.value);
    if (passwordHash != store.user().passwordHash) alert(t('password.error'));
    store.setting().isLock = false;
    store.user().password = password1(password.value);
    router.push('/');
};
</script>

<template>
    <div class="no-account-container">
        <div class="cover-top">
            <img class="logo-img" src="@/assets/images/metahub@2x.png" />
        </div>
        <div class="tip">{{ $t('password.welcome') }}</div>
        <div class="px-[58px]">
            <n-input
                v-model:value="password"
                type="password"
                show-password-on="click"
                :placeholder="$t('password.toUnlock')"
                class="w-full h-[50px] leading-[50px] pl-3 bg-gray-50"
                round
                style="border-radius: 200px"
            ></n-input>
            <n-button
                class="bg-purple-500 mt-5 w-full h-[50px] leading-[50px]"
                type="primary"
                @click="submit"
                round
            >
                {{ $t('password.unlock') }}
            </n-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';

.no-account-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    .cover-top {
        justify-content: center;
    }

    .logo-img {
        width: 120px;
    }

    .tip {
        padding-bottom: 45px;
        padding-top: 130px;
        font-family: PingFangSC-Regular;
        font-size: 26px;
        color: #333333;
        letter-spacing: 0;
        line-height: 24px;
    }
}
</style>
