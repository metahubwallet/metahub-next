<script setup lang="ts">
import Windows from '@/common/lib/windows';

// 初始化钱包解锁情况
const user = store.user();
const setting = store.setting();
onMounted(async () => {
    await localCache.get('passwordHash').then(async (res: any) => {
        store.user().passwordHash = res;
        await localCache.get('isLock', true).then((res: any) => {
            store.setting().isLock = res;
        });
    });
});

// 钱包选择
const showAccountSelector = ref(false);
const router = useRouter();
const importKeyHandle = (chainId: string) => {
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
                @importKey="importKeyHandle"
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
