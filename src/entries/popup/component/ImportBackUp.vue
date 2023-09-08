<script setup lang="ts">
import { metahubKey, encrypt, decrypt, password1, password2, md5 } from '@/common/util/crypto';
import { Wallet } from '@/types/wallet';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();

const schema = {
    encryptPassword: yup
        .string()
        .required()
        .label(t('setting.encryptPassword')),
    password: yup
        .string()
        .required()
        .label(t('public.password')),
    passwordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], t('public.passwordNoSame'))
        .label(t('public.repeatPassword')),
    uploadName: yup
        .string()
        .required(t('public.importErrorTip'))
        .label(t('public.import')),
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
            values.passwordConfirm = '';
            backUpFile = null;
        }
    }
);

// 获取文件信息
const beforeUpload = (e: any) => {
    values.uploadName = e.file.name;
    backUpFile = e.file.file;
};

// 清空文件信息
const removeUpload = () => {
    values.uploadName = '';
    backUpFile = null;
};

// 确认导入
const onSubmit = handleSubmit(() => {
    if (!backUpFile) {
        return window.msg.warning(t('public.importErrorTip'));
    }
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
        importWalletsFromData(e.target.result);
    };
    fileReader.readAsText(backUpFile);
});

// 导入数据
const router = useRouter();
const importWalletsFromData = async (content: string) => {
    if (!/^[0-9A-F]+$/.test(content)) {
        return window.msg.error(t('public.importErrorTip'));
    }

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
                    key.privateKey = decrypt(key.privateKey, md5(wallet.seed + password1(values.encryptPassword)));
                }
            }
        } catch (err) {
            return window.msg.error(t('public.encryptPasswordError'));
        }
    }

    // 检查格式是否正确
    if (!importData.wallets) {
        return window.msg.error(t('public.importErrorTip2'));
    }

    importData.password = password1(values.password);
    importData.passhash = password2(values.password);

    // 重新加密
    for (const wallet of importData.wallets) {
        for (const key of wallet.keys) {
            key.privateKey = encrypt(key.privateKey, md5(wallet.seed + importData.password));
        }
    }

    useChainStore().setNetworks(importData.networks);
    // if (importData.currentNetwork) {
    //     useChainStore().setCurrentNetwork(importData.currentNetwork);
    // } else {
    //     // old version
    //     const network = (importData.networks as any[]).find((x) => x.chainId == importData.currentChainId);
    //     useChainStore().setCurrentNetwork(network || importData.networks[0]);
    // }   
   
    useChainStore().setSelectedRpcs(importData.selectedRpc);
    useChainStore().setCustomRpcs(importData.customRpcs);

    
    const wallets: Wallet[] = [];
    for (const w of importData.wallets) {
        wallets.push({
            name: w.name,
            chainId: w.chainId,
            seed: w.seed,
            blockchain: w.blockchain || 'eos',  // eth, eth ...
            smoothMode: w.smoothMode,
            keys: w.keys,
        });
    }
    useWalletStore().setWallets(wallets);

    if (importData.recentTransfers) {
        useWalletStore().setRecentTransfers(importData.recentTransfers);
    }

    useWalletStore().setSelectedIndex(importData.selectedIndex);
    useWalletStore().setUserTokens(importData.userTokens);

    useSettingStore().setWhitelist(importData.whitelist);

    useUserStore().setPasshash(importData.passhash);
    useUserStore().setLocked();
    
    changeLang(importData.language);

    router.push({ name: 'index' });

    return window.msg.success(t('public.importBackupSuccess'));
};

// 切换语言
const { locale } = useI18n();
const changeLang = async (value: any) => {
    if (!value) {
        value = 'en';
    }
    locale.value = value;
    useSettingStore().setLang(value);
};
</script>

<template>
    <modal :is-show="props.isShow" :title="$t('public.importBackup')" @close="$emit('close')" @submit="onSubmit">
        <!-- 加密密码 -->
        <div class="mb-2">
            <div class="mb-1">{{ $t('setting.encryptPassword') }}</div>
            <n-input v-model:value="values.encryptPassword" type="password" show-password-on="click" :placeholder="$t('setting.encryptPassword')"></n-input>
            <div class="text-yellow-400 text-xs">{{ errors.encryptPassword }}</div>
        </div>

        <!-- 新密码 -->
        <div class="mb-2">
            <div class="mb-1">{{ $t('setting.newPassword1') }}</div>
            <n-input v-model:value="values.password" type="password" show-password-on="click" :placeholder="$t('setting.newPassword1')"></n-input>
            <div class="text-yellow-400 text-xs">{{ errors.password }}</div>
        </div>

        <!-- 重复密码 -->
        <div class="mb-2">
            <div class="mb-1">{{ $t('setting.newPassword2') }}</div>
            <n-input v-model:value="values.passwordConfirm" type="password" show-password-on="click" :placeholder="$t('setting.newPassword2')"></n-input>
            <div class="text-yellow-400 text-xs">{{ errors.passwordConfirm }}</div>
        </div>

        <!-- 选择备份文件 -->
        <div class="mb-1">
            <n-upload v-if="values.uploadName == ''" @before-upload="beforeUpload" :show-file-list="false">
                <n-button text class="upload-button text-primary">
                    {{ $t('public.selectFileToImport') }}
                </n-button>
                <div class="text-yellow-400 text-xs">{{ errors.uploadName }}</div>
            </n-upload>

            <div class="upload-file-name flex items-center justify-between" v-else>
                <div class="flex items-center">
                    <icon-file-success size="16" fill="#3f3f3f" class="cursor-pointer" />
                    <span class="px-2">{{ values.uploadName }}</span>
                </div>
                <icon-close size="16" fill="#3f3f3f" @click="removeUpload" class="cursor-pointer" />
            </div>
        </div>
    </modal>
</template>

<style lang="scss" scoped></style>
