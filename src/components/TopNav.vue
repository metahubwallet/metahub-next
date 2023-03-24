<script setup lang="ts">
import { briefAccount } from '@/common/utils/tools';

const { currentWallet } = store.user();
</script>

<template>
    <div class="cover-top">
        <div @click="$emit('change-account')" class="right-box">
            <div class="account">
                <span>
                    {{
                        currentWallet ? briefAccount(currentWallet.account) : $t('public.noAccount')
                    }}
                </span>
                <span class="triangle-bottom"></span>
            </div>
        </div>

        <img class="logo-img" src="@/assets/images/metahub@2x.png" />
    </div>
</template>

<style lang="scss" scoped>
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
</style>
