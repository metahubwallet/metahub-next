<script setup lang="ts">
import Windows from '@/common/lib/windows';
import { supportNetworks } from '@/common/util/network';
import { Network, RPC } from '@/store/chain/type';
import { Token, Wallet } from '@/store/wallet/type';
import localTokens from '@/asset/json/tokens.json';
import { isArray } from 'lodash';

// 初始化钱包情况
const user = store.user();
const chain = store.chain();
const wallet = store.wallet();
const setting = store.setting();
onMounted(async () => {
    chain.networks = (await localCache.get('networks', supportNetworks.slice(0, 3))) as Network[];
    chain.currentNetwork = (await localCache.get('currentNetwork', null)) as Network;
    chain.selectedRpc = (await localCache.get('selectedRpc', null)) as any;
    chain.customRpcs = (await localCache.get('customRpcs', null)) as any;
    wallet.wallets = (await localCache.get('wallets', [])) as Wallet[];
    wallet.selectedIndex = (await localCache.get('selectedIndex', 0)) as number;
    user.passwordHash = (await localCache.get('passwordHash', '')) as string;
    setting.isLock = (await localCache.get('isLock', true)) as boolean;

    initTokens();
});

// 更新token
const initTokens = async () => {
    // get tokens form local
    if (!wallet.allTokens || !wallet.allTokens.tokens) {
        wallet.allTokens = getTokenMapFromArray(localTokens);
    }

    // update tokens
    setInterval(async () => {
        await http
            .get('https://cdn.jsdelivr.net/gh/metahubwallet/eos-tokens@master/tokens.json')
            .then((res) => {
                const tokenArray = typeof res == 'string' ? JSON.parse(res) : res;
                const tokenMap = getTokenMapFromArray(tokenArray);
                wallet.setAllTokens(tokenMap);
            })
            .catch((e) => {
                console.log(e);
            });
    }, 1000 * 60 * 60 * 24);
};

const getTokenMapFromArray = (tokenArray: any[]) => {
    let tokenMap = {} as any;
    for (const token of tokenArray) {
        if (!tokenMap[token.chain]) tokenMap[token.chain] = {};
        const k = `${token.contract}-${token.symbol}`;
        const name = `${token.chain}/${k}.png`.toLowerCase();
        token.logo = 'https://cdn.jsdelivr.net/gh/metahubwallet/eos-tokens@master/logos/' + name;
        tokenMap[token.chain][k] = token;
    }
    return tokenMap;
};

// 钱包选择
const showAccountSelector = ref(false);
const router = useRouter();
const handleImportKey = (chainId: string) => {
    router.push({
        name: 'import-key',
        query: { chainId },
    });
    showAccountSelector.value = false;
};

// 检查窗口情况，还原图标
onBeforeMount(() => {
    if (Windows.getCount() == 0) {
        chrome.browserAction.setIcon({
            path: '@/assets/images/icons/metahub-128.png',
        });
    }
});

// 路由动画
const route = useRoute();
const transitionName = ref('');
watch(
    () => route.meta.index,
    (toIndex, fromIndex) => {
        if (toIndex < fromIndex) transitionName.value = 'slideInLeft';
        else if (toIndex > fromIndex) transitionName.value = 'slideInRight';
        else transitionName.value = '';
    }
);
</script>

<template>
    <div class="overflow-hidden">
        <!-- 已解锁钱包 -->
        <div v-if="!setting.isLock" class="bg">
            <top-nav @change-account="showAccountSelector = true"></top-nav>

            <div class="app-content">
                <keep-alive include="wallet">
                    <router-view
                        class="animate__animated"
                        :class="`animate__${transitionName}`"
                    ></router-view>
                </keep-alive>
            </div>

            <account-selector
                :is-show="showAccountSelector"
                v-model="showAccountSelector"
                @close="showAccountSelector = false"
                @importKey="handleImportKey"
            ></account-selector>
        </div>

        <!-- 未解锁钱包但已初始化 -->
        <div class="bg" v-else-if="user.passwordHash">
            <password-unlock></password-unlock>
        </div>

        <!-- 未初始化钱包 -->
        <div class="bg" v-else>
            <password-setting></password-setting>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bg {
    height: 100%;
    background-image: linear-gradient(rgba(246, 221, 255, 0.24), rgba(225, 225, 250, 0.04));
}

.app-content {
    padding-top: 70px;
    overflow: hidden;
    height: 600px;
}

.app-content .full-inner {
    z-index: 2;
}
</style>
