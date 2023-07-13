<script setup lang="ts">
const wallet = store.wallet();
const briefAccount = tool.briefAccount;

// 路由动画
const decline = ref(false);
const route = useRoute();
watch(
    () => route.meta.index,
    (toIndex, fromIndex) => {
        if (toIndex > 1 && fromIndex == 1) decline.value = true;
        else if (toIndex == 1 && fromIndex > 1) decline.value = false;
    }
);
</script>

<template>
    <header class="app-header">
        <div :class="{ '_effect--50': decline }" class="_effect">
            <div class="cover-top">
                <img class="logo-img" src="@/asset/img/metahub@2x.png" />

                <div @click="$emit('change-account')" class="right-box">
                    <div class="account">
                        <span>
                            {{
                                wallet.currentWallet?.account
                                    ? briefAccount(wallet.currentWallet.account)
                                    : $t('public.noAccount')
                            }}
                        </span>
                        <span class="triangle-bottom"></span>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.app-header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 3;
    font-size: 19px;
    color: #ffffff;
    text-align: center;

    .logo-img {
        width: 120px;
    }

    .right-box {
        position: absolute;
        top: 12.5px; // (70 - 45) / 12
        right: 15px;
        font-size: 12px;
        color: #ffffff;
        font-weight: 400;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        .account {
            cursor: pointer;
            padding: 0px 17px;
            border-radius: 16px;
            background: #fff;
            height: 32px;
            line-height: 32px;
            font-size: 13px;
            color: #222;
            font-weight: bold;
            padding-right: 25px;
            box-shadow: 0px 1px 10px 6px rgba(1, 45, 107, 0.02);
        }
        .arrow-img {
            width: 9px;
            height: 6px;
        }
        .triangle-bottom {
            width: 0;
            height: 0;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
            border-top: 6px solid #222;
            position: absolute;
            bottom: 19px;
            right: 13px;
        }
    }
}
</style>
