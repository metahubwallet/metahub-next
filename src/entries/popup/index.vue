<script setup lang="ts">
import PasswordUnlock from '@/entries/popup/wallet/password/PasswordUnlock.vue';
import PasswordSetting from '@/entries/popup/wallet/password/PasswordSetting.vue';

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
const importClickHandle = (chainId: string) => {
    router.push({
        name: 'import-key',
        query: { chainId },
    });
    showAccountSelector.value = false;
};
</script>

<template>
    <div class="overflow-hidden">
        <!-- 已解锁钱包 -->
        <div v-if="!setting.isLock" class="bg">
            <top-nav @change-account="showAccountSelector = true"></top-nav>

            <router-view></router-view>

            <account-selector
                :is-show="showAccountSelector"
                v-model="showAccountSelector"
                @account-click="showAccountSelector = false"
                @close-click="showAccountSelector = false"
                @import-click="importClickHandle"
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
</style>
