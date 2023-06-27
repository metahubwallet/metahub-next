<script setup lang="ts">
import { decrypt, encrypt, md5, metahubKey, password2 } from '@/common/util/crypto';
import _ from 'lodash';
import moment from 'moment';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();
const emit = defineEmits(['close']);

const walletPassowrd = ref('');
const encryptPassword = ref('');

// 确认提交
const submitHandle = () => {
    if (password2(walletPassowrd.value) != store.user().passwordHash)
        return window.msg.error(t('password.error'));

    let invaildPassword = false;
    if (encryptPassword.value == '' || encryptPassword.value.length < 8) invaildPassword = true;
    else
        invaildPassword = !(
            /[a-zA-Z]+/.test(encryptPassword.value) && /[0-9]+/.test(encryptPassword.value)
        );

    if (invaildPassword) return window.msg.warning(t('setting.encryptPasswordTip'));

    exportWallet();

    walletPassowrd.value = '';
    encryptPassword.value = '';
    emit('close');
};

// 导出钱包
const background = chrome.extension.getBackgroundPage()?.background;

const exportWallet = () => {
    const { allTokens, ...wallet } = store.wallet().$state;
    const exportData = { ...wallet };

    const password = background.vars.password;

    for (const wallet of exportData.wallets) {
        for (const key of wallet.keys) {
            key.privateKey = decrypt(key.privateKey, md5(wallet.seed + password));
        }
    }

    const encryptKey = md5(metahubKey + md5(encryptPassword.value));
    let encryptData = encrypt(JSON.stringify(exportData), encryptKey);
    let blob = new Blob([encryptData], { type: 'application/metahub' });
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    // 配置下载的文件名
    link.download = 'Metahub-' + moment().format('YYYY-MM-DD') + '.backup';
    link.click();

    window.msg.success(t('Export Success!'));
};
</script>

<template>
    <n-modal :show="props.isShow" @mask-click="$emit('close')">
        <n-card class="w-5/6" :title="$t('setting.exportWallet')" :bordered="false">
            <!-- wallet passowrd -->
            <div class="dialog-title">
                {{ $t('setting.walletPassowrd') }}
            </div>
            <n-input
                class="mb-3"
                show-password
                v-model:value="walletPassowrd"
                :placeholder="$t('setting.walletPassowrd')"
            ></n-input>

            <!-- encrypt password -->
            <div class="dialog-title">
                {{ $t('setting.encryptPassword') }}
            </div>
            <n-input
                v-model:value="encryptPassword"
                show-password
                :placeholder="$t('setting.encryptPassword')"
                clearable
            ></n-input>

            <!-- encrypt password tip -->
            <div class="dialog-tip">
                {{ $t('setting.encryptPasswordTip') }}
            </div>
            <div class="dialog-foot">
                <n-button @click="$emit('close')" class="mr-2">{{ $t('public.cancel') }}</n-button>
                <n-button type="primary" @click="submitHandle">{{ $t('public.ok') }}</n-button>
            </div>
        </n-card>
    </n-modal>
</template>

<style lang="scss" scoped>
.dialog-title {
    line-height: 20px;
    margin: 5px 0 8px 0;
}

.dialog-tip {
    line-height: 20px;
    color: #999;
    margin: 3px 0 10px 0;
    word-break: keep-all;
}

.dialog-foot {
    padding: 20px 0px 5px 0px;
    text-align: right;
}
</style>
