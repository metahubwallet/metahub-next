<script setup lang="ts">
import PasswordUnlock from '@/entries/popup/wallet/password/PasswordUnlock.vue';
import PasswordSetting from '@/entries/popup/wallet/password/PasswordSetting.vue';

const setting = store.setting();

// 是否设置过密码
const isInit = computed(() => {
    localCache.get('passwordHash').then((res: any) => {
        store.user().passwordHash = res;
    });
    return store.user().passwordHash != null;
});
</script>

<template>
    <div>
        <div v-if="!setting.isLock">
            <router-view></router-view>
        </div>

        <div class="bg" v-else-if="isInit">
            <password-unlock></password-unlock>
        </div>

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
