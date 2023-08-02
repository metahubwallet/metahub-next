<script lang="ts" setup>
import _ from 'lodash';
import { supportNetworks } from '@/common/util/network';
import { Network } from '@/store/chain/type';
import { FormItemRule, FormRules } from 'naive-ui';

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

// 验证规则
const rules: FormRules = {
    name: [
        {
            required: true,
            message: t('setting.nameIsRequired'),
            trigger: ['blur'],
        },
    ],
    chainId: [
        {
            required: true,
            message: t('setting.chainIdIsRequire'),
            trigger: ['blur'],
        },
        {
            min: 64,
            max: 64,
            message: t('setting.lengthMustBe64Characters'),
            trigger: ['blur'],
        },
    ],
    endpoint: [
        {
            required: true,
            type: 'url',
            message: t('setting.defaultNodeFormatIsIncorrect'),
            trigger: ['blur'],
        },
    ],
    token: {
        symbol: {
            required: true,
            message: t('setting.defaultSymbolIsRequire'),
            trigger: ['blur'],
        },
        contract: {
            required: true,
            message: t('setting.contractNameRequired'),
            trigger: ['blur'],
        },
        precision: [
            {
                required: true,
                validator: (rule: FormItemRule, value: number): boolean => {
                    if (!Number.isInteger(value)) return false;
                    else return true;
                },
                message: t('setting.precisionMustBeAnInteger'),
                trigger: ['blur'],
            },
            {
                validator: (rule: FormItemRule, value: number): boolean => {
                    if (value < 0 || value > 8) return false;
                    else return true;
                },
                message: t('setting.precisionMustBeBetween'),
            },
        ],
    },
};

// 添加前处理
const formRef = ref<any>(null);
const { networks } = store.chain();
const handleAdd = (e: any) => {
    formRef.value.validate((errors: any) => {
        if (errors) return;
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
        newNetwork.chain = 'ch' + tool.randomInt(10000, 99999);
        addNetwork(newNetwork);
        router.go(-1);
    });
};

// 添加自定义网络
const addNetwork = async (network: Network) => {
    store.chain().setNetworks([...store.chain().networks, network]);

    const selectedRpc = store.chain().selectedRpc;
    selectedRpc[network.chainId] = network.endpoint;
    store.chain().setSelectedRpc(selectedRpc);

    const customRpcs = {
        ...store.chain().customRpcs,
        [network.chainId]: [
            {
                name: network.name,
                endpoint: network.endpoint,
            },
        ],
    };
    store.chain().setCustomRpcs(customRpcs);
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.addCustomNetwork')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar class="main-form">
                    <n-form ref="formRef" :rules="rules" :model="network" class="px-3 pt-6">
                        <!-- node name -->
                        <n-form-item :label="$t('setting.nodeName')" path="name">
                            <n-input
                                :placeholder="$t('setting.nodeName')"
                                v-model:value="network.name"
                            ></n-input>
                        </n-form-item>

                        <!-- chainId -->
                        <n-form-item label="ChainId" path="chainId">
                            <n-input
                                placeholder="ChainId"
                                v-model:value="network.chainId"
                            ></n-input>
                        </n-form-item>

                        <!-- default node -->
                        <n-form-item :label="$t('setting.defaultNode')" path="endpoint">
                            <n-input
                                placeholder="https://"
                                v-model:value="network.endpoint"
                            ></n-input>
                        </n-form-item>

                        <!-- default token -->
                        <n-form-item :label="$t('setting.defaultSymbol')" path="token.symbol">
                            <n-input
                                :placeholder="$t('setting.symbol')"
                                v-model:value="network.token.symbol"
                            ></n-input>
                        </n-form-item>

                        <!-- diy -->
                        <n-checkbox
                            :label="$t('setting.defineContractNameAndPrecision')"
                            v-model:checked="tokenDiy"
                        ></n-checkbox>

                        <div v-show="tokenDiy" class="token-diy flex flex-row">
                            <!-- contract -->
                            <n-form-item path="token.contract">
                                <n-input
                                    :placeholder="$t('setting.contractName')"
                                    v-model:value="network.token.contract"
                                ></n-input>
                            </n-form-item>
                            <!-- precision -->
                            <n-form-item path="token.precision">
                                <n-input-number
                                    class="ml-1"
                                    :placeholder="$t('setting.precision')"
                                    v-model:value="network.token.precision"
                                ></n-input-number>
                            </n-form-item>
                        </div>
                    </n-form>

                    <!-- footer -->
                    <div class="footer mt-2">
                        <n-button type="primary" class="button" @click="handleAdd">
                            {{ $t('password.submit') }}
                        </n-button>
                    </div>
                </n-scrollbar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
        background-color: $color-primary;
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
    border: 1px solid $color-separate;
    border-width: 1px 0 1px 0;
    background-color: #fff;
}

.setting-item {
    padding: 10px 0;
    border-bottom: 1px solid $color-separate;
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

.token-diy {
    :deep(.n-form-item) {
        --n-label-height: 10px !important;
    }
}
</style>
