<script lang="ts" setup>
import _ from 'lodash';
import { eosChainId, supportNetworks } from '@/common/util/network';
import { Network } from '@/store/chain/type';

const { t } = useI18n();
const router = useRouter();

const eChainId = ref(eosChainId);
const supportNets = ref(supportNetworks);

// 添加网络前置操作
const chainStore = store.chain();
const handleAdd = (network: Network) => {
    window.dialog.warning({
        title: t('public.tip'),
        content: t('setting.sureAddPrefix') + network.name + t('setting.sureAddSuffix'),
        positiveText: t('password.submit'),
        negativeText: t('password.cancel'),
        onPositiveClick: () => {
            addNetwork(network);
            router.go(-1);
        },
        onNegativeClick: () => {},
    });
};

// 新增网络
const addNetwork = (network: Network) => {
    chainStore.setNetworks([...chainStore.networks, network]);
    const selectedRpc = chainStore.selectedRpc;
    selectedRpc[network.chainId] = network.endpoint;
    chainStore.setSelectedRpc(selectedRpc);

    const customRpcs = chainStore.customRpcs;
    customRpcs[network.chainId] = [
        {
            name: network.name,
            endpoint: network.endpoint,
        },
    ];
    chainStore.setCustomRpcs(customRpcs);
};

// 确定移除
const handleRemove = (item: Network) => {
    window.dialog.warning({
        title: t('public.tip'),
        content: t('setting.sureDeletePrefix') + item.name + t('setting.sureDeleteSuffix'),
        positiveText: t('password.submit'),
        negativeText: t('password.cancel'),
        onPositiveClick: () => {
            removeNetwork(item);
            router.go(-1);
        },
        onNegativeClick: () => {},
    });
};

// 移除网络
const removeNetwork = (network: Network) => {
    const widx = store.wallet().wallets.findIndex((x) => x.chainId == network.chainId);
    if (widx >= 0) return window.msg.error(t('setting.alreadyExistAccount'));

    const index = chainStore.networks.findIndex((x) => x.chainId == network.chainId);
    if (index >= 0) {
        const networks = chainStore.networks;
        networks.splice(index, 1);
        chainStore.setNetworks(networks);

        const customRpcs = chainStore.customRpcs;
        if (customRpcs[network.chainId]) {
            delete customRpcs[network.chainId];
            chainStore.setCustomRpcs(customRpcs);
        }
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.addExistingNetwork')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar>
                    <n-table class="networks w-full">
                        <thead>
                            <tr>
                                <th>{{ $t('setting.name') }}</th>
                                <th>ChainId</th>
                                <th>{{ t('setting.operation') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(network, index) of supportNets" :key="index">
                                <!-- name -->
                                <td>{{ network.name }}</td>
                                <!-- chainId -->
                                <td>{{ network.chainId.substring(0, 16) + '..' }}</td>

                                <td class="flex justify-center min-h-[48px]">
                                    <!-- add -->
                                    <icon-plus
                                        theme="outline"
                                        size="24"
                                        fill="#bf01fa"
                                        :strokeWidth="3"
                                        class="cursor-pointer"
                                        v-show="!chainStore.findNetwork(network.chainId)"
                                        @click="handleAdd(network)"
                                    />
                                    <!-- remove  -->
                                    <icon-delete
                                        theme="outline"
                                        size="24"
                                        fill="#e53e30"
                                        :strokeWidth="3"
                                        class="cursor-pointer"
                                        v-show="
                                            chainStore.findNetwork(network.chainId) &&
                                            network.chainId != eChainId
                                        "
                                        @click="handleRemove(network)"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </n-table>
                </n-scrollbar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
