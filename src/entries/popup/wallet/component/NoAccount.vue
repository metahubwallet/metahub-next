<script setup lang="ts">
const signupClick = () => {
    window.open('https://totoro.finance/tool/create-account', '_blank');
};
</script>

<template>
    <div class="no-account-container">
        <div class="no-account-tip">{{ $t('public.noImport') }}</div>
        <img
            class="no-account-img"
            src="@/asset/img/import-btn.png"
            @click="$router.push({ name: 'import-key' })"
        />
        <div class="no-account-btn">{{ $t('public.importAccountNow') }}</div>
        <div class="free-signup" @click="signupClick()">{{ $t('public.freeSignup') }}</div>
    </div>
</template>

<style lang="scss" scoped>
.no-account-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .no-account-img {
        margin-top: 52px;
        width: 156px;
        height: 156px;
        margin-bottom: 10px;
        cursor: pointer;
    }
    .no-account-tip {
        font-size: 13px;
        color: #222;
        letter-spacing: 0;
        margin-top: 100px;
        font-weight: 400;
    }
    .no-account-btn {
        font-size: 26px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #af00cd;
        line-height: 37px;
    }

    .free-signup {
        position: absolute;
        left: 0;
        bottom: 25px;
        font-size: 16px;
        line-height: 24px;
        width: 100%;
        height: 24px;
        text-align: center;
        cursor: pointer;
    }
}
</style>
