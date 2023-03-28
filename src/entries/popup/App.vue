<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui';
import '@/assets/css/common.scss';
import '@/assets/css/app.scss';
import Windows from '@/common/libs/windows';
const router = useRouter();

// 调整主题
const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#bf01fa',
        primaryColorHover: '#bf01fa',
    },
};

const decline = ref(false); // 是否激活子路由
const showAccountSelector = ref(false);
const transitionName = ref<'' | 'slide-left' | 'slide-right'>(''); // 过渡动画效果

const { passwordHash } = store.user();
const { isLock } = store.setting();

const isInit = computed(() => {
    return passwordHash != '';
});

onBeforeMount(() => {
    // 检查一下窗口情况，还原图标
    if (Windows.getCount() == 0) {
        chrome.browserAction.setIcon({
            path: '../icons/metahub-128.png',
        });
    }
});

onBeforeRouteUpdate((to, from) => {
    if (to.meta.index > from.meta.index) {
        transitionName.value = 'slide-left';
        if (from.meta.index == 1 && to.meta.index > 1) {
            decline.value = true;
        }
    } else if (to.meta.index < from.meta.index) {
        transitionName.value = 'slide-right';
        if (from.meta.index > 1 && to.meta.index == 1) {
            decline.value = false;
        }
    } else {
        transitionName.value = '';
    }
});

const handleImportClick = (chainId: string) => {
    router.push({
        path: '/wallet/import',
        query: { chainId },
    });
    showAccountSelector.value = false;
};
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div id="app">
            <!-- 是否需要解锁钱包  -->
            <div class="bg" v-if="isInit && !isLock">
                <header class="app-header">
                    <div :class="{ '_effect--50': decline }" class="_effect">
                        <top-nav @change-account="showAccountSelector = true"></top-nav>
                    </div>
                </header>

                <section class="app-content">
                    <transition :name="transitionName">
                        <keep-alive include="WalletIndex">
                            <router-view class="child-view"></router-view>
                        </keep-alive>
                    </transition>
                </section>

                <account-selector
                    v-model="showAccountSelector"
                    @account-click="showAccountSelector = false"
                    @close-click="showAccountSelector = false"
                    @import-click="handleImportClick"
                ></account-selector>
            </div>
            <div class="bg" v-else-if="isInit">
                <password-unlock></password-unlock>
            </div>
            <div class="bg" v-else>
                <password-setting></password-setting>
            </div>
        </div>
    </n-config-provider>
</template>

<style lang="scss" scoped>
.bg {
    height: 100%;
    background-image: linear-gradient(rgba(246, 221, 255, 0.24), rgba(225, 225, 250, 0.04));
}
.child-view {
    position: absolute;
    width: 100%;
    transition: all 0.2s;
}

// 滑动动画
.slide-left-enter,
.slide-right-leave-active {
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-enter {
    // opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
}
</style>
