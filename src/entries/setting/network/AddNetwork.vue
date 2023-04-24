<script lang="ts" setup>
import _ from 'lodash';
import { eosChainId, supportNetworks } from '@/common/utils/network';
import { Network } from '@/store/chain/types';

const { t } = useI18n();
const router = useRouter();

const eChainId = ref(eosChainId);
const supportNets = ref(supportNetworks);

const { networks, findNetwork } = store.chain();

const handleAddSupportNetwork = (index: number, network: Network) => {
    if (findNetwork(network.chainId)) handleDeleteClick(network);
    else {
        window.dialog
            .warning({
                title: t('setting.sureAddPrefix') + network.name + t('setting.sureAddSuffix'),
                content: t('public.tip'),
                positiveText: t('password.submit'),
                negativeText: t('password.cancel'),
                onPositiveClick: () => {
                    addNetwork(network);
                    router.go(-1);
                },
                onNegativeClick: () => {},
            })
            .then(() => {})
            .catch(() => {});
    }
};

const handleDeleteClick = (item: Network) => {
    window.dialog
        .warning({
            title: t('setting.sureDeletePrefix') + item.name + t('setting.sureDeleteSuffix'),
            content: t('public.tip'),
            positiveText: t('password.submit'),
            negativeText: t('password.cancel'),
            onPositiveClick: () => {
                removeNetwork(item);
                router.go(-1);
            },
            onNegativeClick: () => {},
        })
        .then(() => {})
        .catch(() => {});
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
                :title="$t('setting.addExistingNetwork')"
            ></top-handle>
            <div class="cover-content _effect">
                <n-scrollbar>
                    <n-table class="networks" style="width: 100%">
                        <thead>
                            <tr>
                                <th>{{ $t('setting.name') }}</th>
                                <th>ChainId</th>
                                <th>{{ t('setting.operation') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(network, index) of supportNets" :key="index">
                                <td>{{ network.name }}</td>
                                <td>{{ network.chainId.substring(0, 16) + '..' }}</td>
                                <td class="flex justify-center">
                                    <icon-plus
                                        theme="outline"
                                        size="24"
                                        fill="#bf01fa"
                                        v-show="!findNetwork(network.chainId)"
                                        @click="handleAddSupportNetwork(index, network)"
                                    />
                                    <icon-delete
                                        theme="outline"
                                        size="24"
                                        fill="#e53e30"
                                        v-show="
                                            findNetwork(network.chainId) &&
                                            network.chainId != eChainId
                                        "
                                        @click="handleDeleteClick(network)"
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
