<script lang="ts" setup>
import _ from 'lodash';
import { randomInt } from '@/common/utils/tools';
import { supportNetworks } from '@/common/utils/network';
import { Network, Token } from '@/store/chain/types';
import { FormRules } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();

const network = reactive({
    name: '',
    chain: '',
    chainId: '',
    endpoint: '',
    token: {
        symbol: 'EOS',
        contract: 'eosio.token',
        precision: 4,
    },
});

const tokenDiy = ref(false);
const rules: FormRules = {
    name: [
        {
            required: true,
            message: t('setting.nameIsRequired'),
            trigger: 'blur',
        },
    ],
    chainId: [
        {
            required: true,
            message: t('setting.chainIdIsRequire'),
            trigger: 'blur',
        },
        {
            min: 64,
            max: 64,
            message: t('setting.lengthMustBe64Characters'),
            trigger: 'blur',
        },
    ],
    endpoint: [
        {
            required: true,
            type: 'url',
            message: t('setting.defaultNodeFormatIsIncorrect'),
            trigger: 'blur',
        },
    ],
    token: [
        {
            validator: (rule, value: Token, callback: Function) => {
                if (value.symbol == '')
                    return callback(new Error(t('setting.defaultSymbolIsRequire')));
                if (value.contract == '')
                    return callback(new Error(t('setting.contractNameRequired')));
                const precision = parseFloat(value.precision);
                if (!Number.isInteger(precision)) {
                    callback(new Error(t('setting.precisionMustBeAnInteger')));
                    return;
                }
                if (precision < 0 || precision > 8)
                    return callback(new Error(t('setting.precisionMustBeBetween')));
                callback();
            },
            trigger: 'blur',
        },
    ],
};

const { networks } = store.chain();

const formRef = ref<any>(null);
const submitAddNetwork = () => {
    formRef.validate((valid: any) => {
        if (!valid) return;

        const exists = supportNetworks.find((x) => x.chainId == network.chainId);
        if (exists) {
            const network = _.clone(exists);
            addNetwork(network);
            router.go(-1);
            return;
        }
        let old = networks.find((x) => x.name == network.name);
        if (old) return window.msg.error(t('setting.alreadyExistNetwork'));
        old = networks.find((x) => x.chainId == network.chainId);
        if (old) return window.msg.error(t('setting.alreadyExist'));
        const newNetwork = _.clone(network);
        newNetwork.chain = 'ch' + randomInt(10000, 99999);
        addNetwork(network);
        router.go(-1);
    });
};

const addNetwork = (network: Network) => {
    store.chain().networks.push(network);
    const selectedRpc = store.user().selectedRpc;
    selectedRpc[network.chainId] = network.endpoint;
    store.user().selectedRpc = selectedRpc;

    const customRpcs = store.user().customRpcs;
    customRpcs[network.chainId] = [
        {
            name: network.name,
            endpoint: network.endpoint,
        },
    ];
    store.user().customRpcs = customRpcs;
};

const removeNetwork = (network: Network) => {
    const widx = store.user().wallets.findIndex((x) => x.chainId == network.chainId);
    if (widx >= 0) return window.msg.error(t('setting.alreadyExistAccount'));

    const index = networks.findIndex((x) => x.chainId == network.chainId);
    if (index >= 0) {
        const networks = store.chain().networks;
        networks.splice(index, 1);
        store.chain().networks = networks;

        const customRpcs = store.user().customRpcs;
        if (customRpcs[network.chainId]) {
            delete customRpcs[network.chainId];
            store.user().customRpcs = customRpcs;
        }
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle
                :back-text="$t('auth.back')"
                :title="$t('setting.addCustomNetwork')"
            ></top-handle>
            <div class="cover-content _effect">
                <n-scrollbar class="main-form">
                    <n-form ref="formRef" :rules="rules" :model="network" class="px-3 pt-2">
                        <n-form-item :label="$t('setting.nodeName')" prop="name">
                            <n-input
                                :placeholder="$t('setting.nodeName')"
                                v-model="network.name"
                            ></n-input>
                        </n-form-item>
                        <n-form-item label="ChainId" prop="chainId">
                            <n-input placeholder="ChainId" v-model="network.chainId"></n-input>
                        </n-form-item>
                        <n-form-item :label="$t('setting.defaultNode')" prop="endpoint">
                            <n-input placeholder="https://" v-model="network.endpoint"></n-input>
                        </n-form-item>
                        <n-form-item :label="$t('setting.defaultSymbol')" prop="token">
                            <n-input
                                :placeholder="$t('setting.symbol')"
                                v-model="network.token.symbol"
                            ></n-input>
                        </n-form-item>
                        <n-checkbox
                            :label="$t('setting.defineContractNameAndPrecision')"
                            v-model="tokenDiy"
                        ></n-checkbox>
                        <div v-show="tokenDiy" class="mt-2 flex flex-row">
                            <n-input
                                :placeholder="$t('setting.contractName')"
                                v-model="network.token.contract"
                            ></n-input>
                            <n-input
                                class="ml-1"
                                :placeholder="$t('setting.precision')"
                                v-model="network.token.precision"
                            ></n-input>
                        </div>
                    </n-form>
                </n-scrollbar>
                <div slot="footer" class="footer">
                    <n-button type="primary" class="button" @click="submitAddNetwork">
                        {{ $t('password.submit') }}
                    </n-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';

.main-form {
    width: 100%;
    height: calc(100% - 60px);
}

.footer {
    display: flex;
    height: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: center;
    align-items: center;
}

.content {
    padding: 15px;
}

.button {
    border-radius: 10px;
    width: 90%;
    height: 40px;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 0;
}

.bottom-btns {
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    height: 44px;
    left: 0;
    right: 0;
    bottom: 10px;
    color: #fff;
    line-height: 44px;
    height: 44px;
    .btn {
        width: 42%;
        border-radius: 6px;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        background-color: $primary-color;
        cursor: pointer;
    }
}
.title {
    width: 100%;
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    padding: 10px 0 5px 15px;
}

.setting-group {
    border: 1px solid $separate-color;
    border-width: 1px 0 1px 0;
    background-color: #fff;
}

.setting-item {
    padding: 10px 0;
    border-bottom: 1px solid $separate-color;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    cursor: pointer;
    margin-left: 15px;
    padding-right: 15px;

    &:last-child {
        border-bottom-width: 0;
    }

    .setting-item-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        line-height: 28px;
    }
    .setting-item-remark {
        line-height: 24px;
        font-size: 12px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .item-titles {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .item-title {
        font-size: 14px;
        color: #333;
    }
    .item-subtitle {
        margin-left: 8px;
        font-size: 12px;
        color: #666;
    }
}
.row-icon {
    color: #6bcf44;
    width: 22px;
    height: 44px;
    line-height: 44px;
    text-align: center;
}

.networks {
    font-size: 12px;
}
</style>
