<script setup lang="ts">
import { password1, password2 } from '@/common/util/crypto';
import { useI18n } from 'vue-i18n';
import ImportBackUp from '../import/ImportBackUp.vue';

const router = useRouter();
const currentPage = ref(1);

// 切换语言
const currentLang = ref(store.setting().language);
const langOptions = [
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en' },
];
const { locale, t } = useI18n();
const handleSwitchLang = (lang: any) => {
    locale.value = lang;
    localCache.set('lang', lang);
};

// 表单
const schema = {
    password: yup.string().required().label(t('public.password')),
    password_confirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], t('public.passwordNoSame'))
        .label(t('public.repeatPassword')),
};
const { values, errors, handleSubmit } = useForms(schema);

// 设置密码
const onSubmit = handleSubmit(() => {
    store.user().password = password1(values.password);
    store.user().passwordHash = password2(values.password);
    localCache.set('passwordHash', store.user().passwordHash);
    store.setting().isLock = false;
    router.push({ name: 'wallet' });
});

// 是否打开导入备份弹出层
const isShow = ref(false);
</script>

<template>
    <div class="main-container">
        <div class="nav-header-view mb-2">
            <div class="nav-view-item">
                <div class="btn-import" @click="isShow = true">
                    {{ $t('public.importBackup') }}
                </div>
            </div>
            <div class="nav-view-item flex justify-center items-center mr-2">
                <img class="w-[16px] h-[16px]" src="@/asset/img/change_language@2x.png" />
                <n-popselect
                    v-model:value="currentLang"
                    :options="langOptions"
                    trigger="click"
                    @update:value="handleSwitchLang"
                >
                    <div class="flex justify-center items-center cursor-pointer">
                        <span class="mx-2 text-sm">{{ $t('public.language') }}</span>
                        <icon-down-one class="mb-[2px]" theme="filled" size="14" fill="#333" />
                    </div>
                </n-popselect>
            </div>
        </div>

        <div class="container" v-if="currentPage == 1">
            <div class="title">
                <p>{{ $t('public.welcomeTo') }}</p>
                <img class="logo-img" src="@/asset/img/metahub@2x.png" />
            </div>

            <div class="tip">{{ $t('public.settingPasswordTip') }}</div>

            <div class="password-form px-12">
                <!-- 密码 -->
                <div class="flex flex-col">
                    <n-input
                        class="h-[50px] rounded-full bg-gray-50 px-7 leading-[50px]"
                        type="password"
                        :placeholder="$t('public.password')"
                        v-model:value="values.password"
                    />
                    <span class="self-end mr-5 mt-1 h-6 text-xs text-yellow-300">
                        {{ errors.password }}
                    </span>
                </div>
                <!-- 确认密码 -->
                <div class="flex flex-col">
                    <n-input
                        class="h-[50px] rounded-full bg-gray-50 px-7 leading-[50px]"
                        type="password"
                        :placeholder="$t('public.repeatPassword')"
                        v-model:value="values.password_confirm"
                    />
                    <span class="self-end mr-5 mt-1 h-6 text-xs text-yellow-300">
                        {{ errors.password_confirm }}
                    </span>
                </div>

                <n-button
                    class="mt-10 bg-primary w-full rounded-[50px] h-[50px]"
                    type="primary"
                    @click="onSubmit()"
                >
                    {{ $t('public.start') }}
                </n-button>
            </div>
        </div>

        <import-back-up :is-show="isShow" @close="isShow = false"></import-back-up>
    </div>
</template>

<style lang="scss" scoped>
.btn-import {
    margin: 10px;
    padding: 5px 10px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background-color: rgb(226, 109, 210);
    border-radius: 5px;
    cursor: pointer;
}

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 100%;
    width: 100%;
    background-image: url('~@/asset/img/bg-2.png');
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: 210px 250px;

    .title {
        display: flex;
        flex-direction: column;
        font-size: 37px;
        font-weight: bold;
        align-items: center;
        margin: 35px 0 55px 0;
        .logo-img {
            padding-top: 10px;
            width: 180px;
        }
    }
    .nav-header-view {
        background-color: rgba(255, 255, 255, 0);
        font-size: 18px;
        letter-spacing: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .tip {
        padding-bottom: 30px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #333333;
        letter-spacing: 0;
        line-height: 24px;
        text-align: center;
    }
}
</style>
