<script setup lang="ts">
import PasswordUnlock from '@/entries/popup/wallet/password/PasswordUnlock.vue';

const setting = store.setting();
</script>

<template>
    <div>
        <div v-if="!setting.isLock">
            <router-view></router-view>
        </div>
        <div class="bg" v-else>
            <password-unlock></password-unlock>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bg {
    height: 100%;
    background-image: linear-gradient(rgba(246, 221, 255, 0.24), rgba(225, 225, 250, 0.04));
}
</style>
