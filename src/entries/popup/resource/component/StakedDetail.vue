<script lang="ts" setup>
import { ResourceData } from '@/store/wallet/type';

interface Props {
    resourceData: ResourceData;
    type: string;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
    <div class="list-container">
        <!-- cpu -->
        <div v-if="props.type == 'cpu'">
            <div class="info-cell">
                <span class="info-cell-key">{{ $t('resource.selfStake') }}：</span>
                <span class="info-cell-value">
                    {{ props.resourceData.self_delegated_bandwidth?.cpu_weight }}
                </span>
            </div>
            <div class="info-cell">
                <span class="info-cell-key">{{ $t('resource.otherStake') }}：</span>
                <span class="info-cell-value">{{ props.resourceData.stakeForUserCPU }} EOS</span>
            </div>
        </div>

        <!-- net -->
        <div v-if="props.type == 'net'">
            <div class="info-cell">
                <span class="info-cell-key">{{ $t('resource.selfStake') }}：</span>
                <span class="info-cell-value">
                    {{ props.resourceData.self_delegated_bandwidth?.net_weight }}
                </span>
            </div>
            <div class="info-cell">
                <span class="info-cell-key">{{ $t('resource.otherStake') }}：</span>
                <span class="info-cell-value">{{ props.resourceData.stakeForUserNET }} EOS</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.list-container {
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
}

.info-cell {
    margin: 12px 15px;
    height: 33px;
    border-bottom: 1px solid $color-separate;
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
</style>
