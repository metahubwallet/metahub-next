<script setup lang="ts">
import { metahubKey, encrypt, decrypt, password1, password2, md5 } from '@/common/utils/crypto';
import { useI18n } from 'vue-i18n';

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
    localCache.set('language', lang);
};

// 注册表单
const schema = {
    password: yup.string().required().label(t('public.password')),
    password_confirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], t('public.passwordNoSame'))
        .label(t('public.repeatPassword')),
};
const { values, errors, handleSubmit } = useForms(schema);
const onSubmit = handleSubmit(() => {
    store.user().password = values.password;
    store.user().passwordHash = values.password;
    store.setting().isLock = false;
    router.push({ name: 'wallet' });
});

/* 导入备份*/
const isShowImportWallet = ref(false);
const backUpSchema = {
    encryptPassword: yup.string().required().label(t('setting.encryptPassword')),
    password: yup.string().required().label(t('public.password')),
    password_confirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], t('public.passwordNoSame'))
        .label(t('public.repeatPassword')),
    uploadName: yup.string().required().label(t('public.import')),
};
const {
    values: backUpValues,
    errors: backUpErrors,
    handleSubmit: backUpSubmit,
} = useForms(backUpSchema);
let backUpFile: Blob | null = null;

// 重置备份表单
watch(isShowImportWallet, (newValue, oldValue) => {
    if (oldValue === true && newValue === false) {
        backUpValues.encryptPassword = '';
        backUpValues.password = '';
        backUpValues.password_confirm = '';
        backUpFile = null;
    }
});

// 获取文件信息
const beforeUpload = (file: any) => {
    backUpValues.uploadName = file.name;
    backUpFile = file;
};
// 清空文件信息
const removeUpload = () => {
    backUpValues.uploadName = '';
    backUpFile = null;
};

// 确认导入
const handleImportWallets = backUpSubmit(() => {
    if (!backUpFile) return alert(t('public.importErrorTip'));
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
        importWalletsFromData(e.target.result);
    };
    fileReader.readAsText(backUpFile);
    return false;
});

// 导入数据
const emits = defineEmits(['refreshTokens']);
const importWalletsFromData = (content: string) => {
    if (!/^[0-9A-F]+$/.test(content)) return alert(t('public.importErrorTip'));

    let importData: any = {};
    try {
        // 兼容旧版
        const key = md5(metahubKey + md5(backUpValues.encryptPassword));
        const decryptData = decrypt(content, key);
        importData = JSON.parse(decryptData);
    } catch (err) {
        try {
            // 兼容旧版
            const decryptData = decrypt(content, metahubKey);
            importData = JSON.parse(decryptData);
            for (const wallet of importData.wallets) {
                for (const key of wallet.keys) {
                    key.privateKey = decrypt(
                        key.privateKey,
                        md5(wallet.seed + password1(backUpValues.encryptPassword))
                    );
                }
            }
        } catch (err) {
            return alert(t('public.encryptPasswordError'));
        }
    }

    // 检查格式是否正确
    if (!importData.wallets) return alert(t('public.importErrorTip2'));

    importData.isLock = true;
    importData.password = password1(backUpValues.password);
    importData.passwordHash = password2(backUpValues.password);

    // 重新加密
    for (const wallet of importData.wallets) {
        for (const key of wallet.keys) {
            key.privateKey = encrypt(key.privateKey, md5(wallet.seed + importData.password));
        }
    }

    store.user().wallets = importData.wallets;
    store.user().userTokens = importData.userTokens;
    store.user().selectedIndex = importData.selectedIndex;
    store.user().password = importData.password;
    store.user().passwordHash = importData.passwordHash;
    store.user().networks = importData.networks;
    store.user().selectedRpc = importData.selectedRpc;
    store.user().customRpcs = importData.customRpcs;

    store.setting().isLock = true;
    store.setting().language = importData.language;

    emits('refreshTokens', true);
    router.push('/wallets');

    return alert(t('public.importBackupSuccess'));
};
</script>

<template>
    <div class="main-container">
        <div class="nav-header-view mb-2">
            <div class="nav-view-item">
                <div class="btn-import" @click="isShowImportWallet = true">
                    {{ $t('public.importBackup') }}
                </div>
            </div>
            <div class="nav-view-item flex justify-center items-center mr-2">
                <img class="w-[16px] h-[16px]" src="@/assets/images/change_language@2x.png" />
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
                <img class="logo-img" src="@/assets/images/metahub@2x.png" />
            </div>

            <div class="tip">{{ $t('public.settingPasswordTip') }}</div>

            <div class="password-form px-12">
                <!-- 密码 -->
                <div class="flex flex-col">
                    <n-input
                        class="h-[50px] rounded-full bg-gray-50 px-7 leading-[50px]"
                        type="password"
                        :placeholder="$t('public.password')"
                        v-model="values.password"
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
                        v-model="values.password_confirm"
                    />
                    <span class="self-end mr-5 mt-1 h-6 text-xs text-yellow-300">
                        {{ errors.password_confirm }}
                    </span>
                </div>
                <n-button
                    class="mt-10 bg-purple-500 w-full rounded-[50px] h-[50px]"
                    type="primary"
                    @click="onSubmit()"
                >
                    {{ $t('public.start') }}
                </n-button>
            </div>
        </div>

        <!-- 导入备份 -->
        <n-modal class="import-modal" v-model:show="isShowImportWallet">
            <n-card class="w-5/6" :title="$t('public.importBackup')" :bordered="false">
                <template #header-extra>
                    <icon-close
                        @click="isShowImportWallet = false"
                        class="cursor-pointer"
                        theme="filled"
                        size="16"
                        fill="#333"
                    />
                </template>
                <!-- 加密密码 -->
                <div class="mb-2">
                    <div class="dialog-title flex justify-between items-center">
                        <span>{{ $t('setting.encryptPassword') }}</span>
                        <span class="text-yellow-400 text-xs">
                            {{ backUpErrors.encryptPassword }}
                        </span>
                    </div>
                    <n-input
                        v-model:value="backUpValues.encryptPassword"
                        type="password"
                        show-password-on="click"
                        :placeholder="$t('setting.encryptPassword')"
                    ></n-input>
                </div>

                <!-- 新密码 -->
                <div class="mb-2">
                    <div class="dialog-title flex justify-between items-center">
                        <span>{{ $t('setting.newPassword1') }}</span>
                        <span class="text-yellow-400 text-xs">{{ backUpErrors.password }}</span>
                    </div>
                    <n-input
                        v-model:value="backUpValues.password"
                        type="password"
                        show-password-on="click"
                        :placeholder="$t('setting.newPassword1')"
                    ></n-input>
                </div>

                <!-- 重复密码 -->
                <div class="mb-2">
                    <div class="dialog-title flex justify-between items-center">
                        <span>{{ $t('setting.newPassword2') }}</span>
                        <span class="text-yellow-400 text-xs">
                            {{ backUpErrors.password_confirm }}
                        </span>
                    </div>
                    <n-input
                        v-model:value="backUpValues.password_confirm"
                        type="password"
                        show-password-on="click"
                        :placeholder="$t('setting.newPassword2')"
                    ></n-input>
                </div>

                <!-- 选择备份文件 -->
                <div class="dialog-title">
                    <n-upload
                        v-if="backUpValues.uploadName == ''"
                        :before-upload="beforeUpload"
                        :show-file-list="false"
                    >
                        <n-button text class="upload-button text-purple-500">
                            {{ $t('public.selectFileToImport') }}
                        </n-button>
                    </n-upload>

                    <div class="upload-file-name" v-else>
                        <i class="el-icon-document"></i>
                        <span>{{ backUpValues.uploadName }}</span>
                        <i class="el-icon-close upload-file-delete" @click="removeUpload"></i>
                    </div>
                </div>

                <template #footer>
                    <!-- 决定按钮 -->
                    <div class="dialog-foot">
                        <n-button class="bg-white" @click="isShowImportWallet = false">
                            {{ $t('public.cancel') }}
                        </n-button>
                        <n-button
                            class="bg-purple-500 ml-3"
                            type="primary"
                            @click="handleImportWallets"
                        >
                            {{ $t('public.import') }}
                        </n-button>
                    </div>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';

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
    background-image: url('../assets/images/bg-2.png');
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
        // font-family: PingFangSC-Regular;
        font-size: 18px;
        letter-spacing: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // height: 50px;
        width: 100%;
        .nav-top-left-icon {
            margin-left: 10px;
            width: 19px;
            height: 24px;
        }
        .nav-top-right-language-icon {
            margin-right: 10px;
            width: 16px;
            height: 16px;
        }
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

    .tip2 {
        padding-bottom: 10px;
        padding-top: 20px;
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #333333;
        letter-spacing: 0;
        line-height: 24px;
    }
    .tip3 {
        padding: 10px 30px;
        font-family: PingFangSC-Regular;
        // font-size: 18px;
        color: #333333;
    }

    .next-bottom {
        background: $primary-color;
        font-size: 15px;
        color: #ffffff;
        width: 273px;
        font-weight: 400;
        border-color: $primary-color;
    }
}

.import-modal {
    .dialog-title {
        overflow: hidden;
        margin-top: 10px;
        padding-bottom: 3px;
        &:first-child {
            margin: 0;
        }
    }

    .upload-file-name {
        color: #333;
        font-size: 14px;
        padding: 6px 0;
        span {
            color: rgb(62, 100, 196);
        }
    }

    .upload-file-delete {
        cursor: pointer;
    }

    .dialog-foot {
        padding: 20px 0px 5px 0px;
        text-align: right;
    }
}
</style>
