<script setup lang="ts">
import { metahubKey, encrypt, decrypt, password1, password2, md5 } from '@/common/util/crypto';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();

const schema = {
    encryptPassword: yup.string().required().label(t('setting.encryptPassword')),
    password: yup.string().required().label(t('public.password')),
    password_confirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], t('public.passwordNoSame'))
        .label(t('public.repeatPassword')),
    uploadName: yup.string().required().label(t('public.import')),
};
const { values, errors, handleSubmit } = useForms(schema);
let backUpFile: Blob | null = null;

// 重置备份表单
watch(
    () => props.isShow,
    (newValue, oldValue) => {
        if (oldValue === true && newValue === false) {
            values.encryptPassword = '';
            values.password = '';
            values.password_confirm = '';
            backUpFile = null;
        }
    }
);

// 获取文件信息
const beforeUpload = (e: any) => {
    values.uploadName = e.file.name;
    backUpFile = e.file;
};
// 清空文件信息
const removeUpload = () => {
    values.uploadName = '';
    backUpFile = null;
};

// 确认导入
const onSubmit = handleSubmit(() => {
    if (!backUpFile) return window.msg.warning(t('public.importErrorTip'));
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
        importWalletsFromData(e.target.result);
    };
    fileReader.readAsText(backUpFile);
});

// 导入数据
const router = useRouter();
const emits = defineEmits(['refreshTokens', 'close']);
const importWalletsFromData = (content: string) => {
    console.log(2);

    if (!/^[0-9A-F]+$/.test(content)) return window.msg.error(t('public.importErrorTip'));

    let importData: any = {};
    try {
        // 兼容旧版
        const key = md5(metahubKey + md5(values.encryptPassword));
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
                        md5(wallet.seed + password1(values.encryptPassword))
                    );
                }
            }
        } catch (err) {
            return window.msg.error(t('public.encryptPasswordError'));
        }
    }

    // 检查格式是否正确
    if (!importData.wallets) return window.msg.error(t('public.importErrorTip2'));

    importData.isLock = true;
    importData.password = password1(values.password);
    importData.passwordHash = password2(values.password);

    // 重新加密
    for (const wallet of importData.wallets) {
        for (const key of wallet.keys) {
            key.privateKey = encrypt(key.privateKey, md5(wallet.seed + importData.password));
        }
    }

    store.wallet().wallets = importData.wallets;
    store.wallet().userTokens = importData.userTokens;
    store.chain().selectedIndex = importData.selectedIndex;
    store.chain().networks = importData.networks;
    store.chain().selectedRpc = importData.selectedRpc;
    store.chain().customRpcs = importData.customRpcs;
    store.user().password = importData.password;
    store.user().passwordHash = importData.passwordHash;
    store.setting().isLock = true;
    store.setting().language = importData.language;
    console.log(1);

    emits('refreshTokens', true);
    router.push({ name: 'wallet' });

    return window.msg.success(t('public.importBackupSuccess'));
};
</script>

<template>
    <n-modal class="import-modal" v-model:show="props.isShow" @mask-click="$emit('close')">
        <n-card class="w-5/6" :title="$t('public.importBackup')" :bordered="false">
            <template #header-extra>
                <icon-close
                    @click="$emit('close')"
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
                        {{ errors.encryptPassword }}
                    </span>
                </div>
                <n-input
                    v-model:value="values.encryptPassword"
                    type="password"
                    show-password-on="click"
                    :placeholder="$t('setting.encryptPassword')"
                ></n-input>
            </div>

            <!-- 新密码 -->
            <div class="mb-2">
                <div class="dialog-title flex justify-between items-center">
                    <span>{{ $t('setting.newPassword1') }}</span>
                    <span class="text-yellow-400 text-xs">{{ errors.password }}</span>
                </div>
                <n-input
                    v-model:value="values.password"
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
                        {{ errors.password_confirm }}
                    </span>
                </div>
                <n-input
                    v-model:value="values.password_confirm"
                    type="password"
                    show-password-on="click"
                    :placeholder="$t('setting.newPassword2')"
                ></n-input>
            </div>

            <!-- 选择备份文件 -->
            <div class="dialog-title">
                <n-upload
                    v-if="values.uploadName == ''"
                    @before-upload="beforeUpload"
                    :show-file-list="false"
                >
                    <n-button text class="upload-button text-primary">
                        {{ $t('public.selectFileToImport') }}
                    </n-button>
                </n-upload>

                <div class="upload-file-name flex items-center justify-between" v-else>
                    <div class="flex items-center">
                        <icon-file-success size="16" fill="#3f3f3f" class="cursor-pointer" />
                        <span class="px-2">{{ values.uploadName }}</span>
                    </div>
                    <icon-close
                        size="16"
                        fill="#3f3f3f"
                        @click="removeUpload"
                        class="cursor-pointer"
                    />
                </div>
            </div>

            <template #footer>
                <!-- 决定按钮 -->
                <div class="dialog-foot">
                    <n-button class="bg-white" @click="$emit('close')">
                        {{ $t('public.cancel') }}
                    </n-button>
                    <n-button class="bg-primary ml-3" type="primary" @click="onSubmit()">
                        {{ $t('public.import') }}
                    </n-button>
                </div>
            </template>
        </n-card>
    </n-modal>
</template>

<style lang="scss" scoped></style>
