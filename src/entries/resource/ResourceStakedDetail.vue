<script lang="ts" setup>
interface Props {
    resourceData: any;
    resourceDataType: any;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
    <div @click="$event.stopPropagation()" class="all-page">
        <div class="title-cell">
            <div class="title">{{ $t('resource.stakeInfo') }}</div>
            <i @click="$emit('close-click')" class="el-message-box__close el-icon-close close"></i>
        </div>
        <div class="list-container">
            <div v-if="props.resourceDataType == 'CPU'">
                <div class="info-cell">
                    <span class="info-cell-key">{{ $t('resource.selfStake') }}：</span>
                    <span class="info-cell-value">
                        {{ props.resourceData.self_delegated_bandwidth.cpu_weight }}
                    </span>
                </div>
                <div class="info-cell">
                    <span class="info-cell-key">{{ $t('resource.otherStake') }}：</span>
                    <span class="info-cell-value">
                        {{ props.resourceData.stakeForUserCPU }} EOS
                    </span>
                </div>
            </div>
            <div v-if="props.resourceDataType == 'NET'">
                <div class="info-cell">
                    <span class="info-cell-key">{{ $t('resource.selfStake') }}：</span>
                    <span class="info-cell-value">
                        {{ props.resourceData.self_delegated_bandwidth.net_weight }}
                    </span>
                </div>
                <div class="info-cell">
                    <span class="info-cell-key">{{ $t('resource.otherStake') }}：</span>
                    <span class="info-cell-value">
                        {{ props.resourceData.stakeForUserNET }} EOS
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.bg-img {
    width: 7.5px;
    height: auto;
    margin-right: 15px;
}
.close {
    width: auto;
    height: auto;
    margin-right: 15px;
}
.all-page {
    background-color: white;
    font-size: 16px;

    .title-cell,
    .import-wallet {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .import-wallet {
        height: 65px;
        margin-left: 15px;
    }

    .list-container {
        max-height: 400px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .title-cell {
        font-size: 16px;
        color: #333333;
        height: 40px;
        border-bottom: 1px solid $separate-color;
        .title {
            margin-left: 15px;
        }
    }

    .info-cell {
        margin: 12px 15px;
        height: 33px;
        border-bottom: 1px solid $separate-color;
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
        .info-cell-key {
            float: left;
            width: 100px;
            font-size: 15px;
            color: #333333;
            font-weight: 600;
        }
        .info-cell-value {
            font-size: 15px;
            color: rgb(102, 102, 102);
            font-weight: 600;
        }
    }
    .submit-button {
        margin: 36px 15px 21px 15px;
        width: 345px;
    }
}
</style>
