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
</script>

<template>
    <div>
        <!-- 已解锁钱包 -->
        <div v-if="!setting.isLock">
            <router-view></router-view>
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
