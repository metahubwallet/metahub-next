<script lang="ts" setup>
import Windows from '@/common/libs/windows';
require('@/assets/css/common.scss');
require('@/assets/css/app.scss');

const showAccountSelector = ref(false);
const decline = ref(false);
const transitionName = ref('');
const { isLock } = store.setting();

const { passwordHash } = store.user();
const isInit = computed(() => {
    return passwordHash != '';
});

onBeforeRouteUpdate((to, from) => {
    if (to.meta.index > from.meta.index) {
        transitionName.value = 'slide-left';
        if (from.meta.index == 1 && to.meta.index > 1) decline.value = true;
    } else if (to.meta.index < from.meta.index) {
        transitionName.value = 'slide-right';
        if (from.meta.index > 1 && to.meta.index == 1) decline.value = false;
    } else {
        transitionName.value = '';
    }
});

onBeforeMount(() => {
    // 检查一下窗口情况，还原图标
    if (Windows.getCount() == 0) {
        chrome.browserAction.setIcon({
            path: '@/assets/images/icons/metahub-128.png',
        });
    }
});

const router = useRouter();
const handleImportClick = (chainId: string) => {
    router.push({
        path: '/wallet/import',
        query: { chainId },
    });
    showAccountSelector.value = false;
};
</script>

<template>
    <div class="app-all" id="app">
        <div class="bg" v-if="isInit && !isLock">
            <!-- 是否需要解锁钱包 -->
            <header class="app-header">
                <div :class="{ '_effect--50': decline }" class="_effect">
                    <top-nav @change-account="showAccountSelector = true"></top-nav>
                </div>
            </header>
            <section class="app-content">
                <!-- index router -->
                <transition :name="transitionName">
                    <keep-alive include="WalletIndex">
                        <router-view class="child-view"></router-view>
                    </keep-alive>
                </transition>
            </section>

            <account-selector
                :isShow="showAccountSelector"
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
</template>

<style lang="scss">
body {
    height: 600px;
    width: 375px;
    font-family: PingFang SC;
    margin: 0;
    padding: 0;
}

* {
    box-sizing: border-box;
    font-family: PingFang SC;
}

body .el-message-box {
    width: 280px;
}

body .el-message {
    width: 96%;
}

.app-all {
    height: 100%;
}
</style>

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
.slide-left-enter,
.slide-right-leave-active {
    // opacity: 0;
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
