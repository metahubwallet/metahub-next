<script lang="ts" setup>
interface Props {
    type: string;
    amount: any;
}
const props = withDefaults(defineProps<Props>(), {});

const totalValue = computed(() => {
    const prefix = props.type == 'usd' ? '$' : '';
    const subfix = props.type == 'usd' ? '' : props.type.toUpperCase();
    return `${prefix} ${props.amount} ${subfix}`;
});

const emit = defineEmits(['btnClick']);
const handleClick = (index: number) => {
    emit('btnClick', index);
};
</script>

<template>
    <div class="all_container">
        <div class="wallet-header-div">
            <div class="my-asset-tip">{{ $t('wallet.assets') }}</div>
            <div class="my-asset-number">
                <span class="asset-number-left">{{ totalValue }}</span>
                <!--        <span class="asset-number-right">≈ {{ assets }}</span>-->
            </div>
        </div>
        <div class="bottom-btn-container">
            <div @click="handleClick(1)" class="one-btn-container">
                <img
                    src="@/assets/images/wallet_transfer@2x.png"
                    style="width: 25px; height: 25px"
                />
                <div>{{ $t('wallet.transfer') }}</div>
            </div>
            <div @click="handleClick(2)" class="one-btn-container">
                <img
                    src="@/assets/images/wallet_collection@2x.png"
                    style="width: 25px; height: 25px"
                />
                <div>{{ $t('wallet.receive') }}</div>
            </div>
            <div @click="handleClick(3)" class="one-btn-container">
                <img src="@/assets/images/wallet_voting@2x.png" style="width: 25px; height: 25px" />
                <div>{{ $t('resource.resources') }}</div>
            </div>
            <div @click="handleClick(4)" class="one-btn-container">
                <img src="@/assets/images/setting.png" style="width: 25px; height: 25px" />
                <div>{{ $t('setting.setting') }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.all_container {
    width: 375px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
}

.wallet-header-div {
    width: 360px;
    height: 120px;
    border-radius: 15px;
    margin-top: 0;
    background-image: url('@/assets/images/money-bg.png');
    background-size: 360px 120px;
    background-repeat: no-repeat;
    padding: 0 30px;
    .my-asset-tip {
        height: 20px;
        margin-top: 20px;
        font-size: 14px;
        color: #333333;
        color: #fff;
    }
    .my-asset-number {
        height: 28px;
        margin-top: 15px;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        font-weight: bold;
        font-size: 25px;
        color: #fff;
        .asset-number-left {
            font-size: 25px;
        }
        .asset-number-right {
            font-size: 25px;
            margin-left: 3px;
        }
    }
}
.bottom-btn-container {
    height: 39px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #999999;
    margin: 10px 0;
    .one-btn-container {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 90px;
        height: 100%;
        font-size: 11px;
        color: #222;
    }
}
</style>
