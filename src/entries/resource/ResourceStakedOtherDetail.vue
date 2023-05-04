<script lang="ts" setup>
import chain from '@/common/libs/chain';

interface Props {
    resourceDataType: string;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();

const otherCPU = ref<any[]>([]);
const otherNET = ref<any[]>([]);
const submitLoading = ref(false);

const { currentWallet } = store.user();

onMounted(async () => {
    await loadOtherDetailData();
});

const loadOtherDetailData = async () => {
    otherCPU.value = [];
    otherNET.value = [];
    let stakeList = await chain.get().getDelegatebwList(currentWallet.name);
    for (let index = 0; index < stakeList.length; index++) {
        const stakeRow = stakeList[index];
        if (stakeRow.to != currentWallet.name) {
            if (stakeRow.cpu_weight != '0.0000 EOS') {
                otherCPU.value.push({
                    from: stakeRow.from,
                    to: stakeRow.to,
                    cpu_weight: stakeRow.cpu_weight,
                });
            }
            if (stakeRow.net_weight != '0.0000 EOS') {
                otherNET.value.push({
                    from: stakeRow.from,
                    to: stakeRow.to,
                    net_weight: stakeRow.net_weight,
                });
            }
        }
    }
};

const emit = defineEmits(['close-click', 'loadData', 'refreshTokens']);
const submit = async (item: any) => {
    submitLoading.value = true;
    try {
        let result = await chain
            .get()
            .undelegatebw(item.from, item.to, item.net_weight, item.cpu_weight, chain.getAuth());
        window.msg.success(t('resource.stakeSuccess'));
        emit('close-click');
        emit('loadData');
        emit('refreshTokens', true);
    } catch (e) {
        window.msg.error(chain.getErrorMsg(e));
    }
    submitLoading.value = false;
};
</script>

<template>
    <div @click="$event.stopPropagation()" class="all-page">
        <div class="title-cell">
            <div class="title">{{ $t('resource.stakeInfo') }}</div>
            <i @click="$emit('close-click')" class="el-message-box__close el-icon-close close"></i>
        </div>
        <div class="list-container" v-loading="submitLoading">
            <div v-if="props.resourceDataType == 'CPU'">
                <div v-bind:key="item.id" v-for="item in otherCPU">
                    <div class="info-cell">
                        <span class="info-cell-key">{{ item.to }}：</span>
                        <span class="info-cell-value">
                            {{ item.cpu_weight }}
                        </span>
                        <el-button @click="submit(item)" size="mini">
                            {{ $t('resource.unstake') }}
                        </el-button>
                    </div>
                </div>
                <div v-if="otherCPU.length == 0" class="empty-cell">
                    <span>{{ $t('resource.noStakeForOthers') }}</span>
                </div>
            </div>
            <div v-if="props.resourceDataType == 'NET'">
                <div v-bind:key="item.id" v-for="item in otherNET">
                    <div class="info-cell">
                        <span class="info-cell-key">{{ item.to }}：</span>
                        <span class="info-cell-value">
                            {{ item.net_weight }}
                        </span>
                        <n-button @click="submit(item)" size="tiny">
                            {{ $t('resource.unstake') }}
                        </n-button>
                    </div>
                </div>
                <div v-if="otherCPU.length == 0" class="empty-cell">
                    <span>{{ $t('resource.noStakeForOthers') }}</span>
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
        margin: 0px 15px 12px 6px;
        height: 45px;
        border-bottom: 1px solid $separate-color;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info-cell-key {
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
    .empty-cell {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 14px;
        color: #666;
    }
    .submit-button {
        margin: 36px 15px 21px 15px;
        width: 345px;
    }
}
</style>
