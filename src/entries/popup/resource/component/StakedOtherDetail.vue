<script lang="ts" setup>
import chain from '@/common/lib/chain';

interface Props {
    isShow: boolean;
    type: string;
}
const props = withDefaults(defineProps<Props>(), {});

interface CPU {
    id?: string;
    from: string;
    to: string;
    cpu_weight: number;
}
const otherCPU = ref<CPU[]>([]);

interface NET {
    id?: string;
    from: string;
    to: string;
    net_weight: number;
}
const otherNET = ref<NET[]>([]);

// 初始化
onMounted(async () => {
    await loadOtherDetailData();
});

// 提交
const { t } = useI18n();
const emit = defineEmits(['close', 'loadData']);
const submit = async (item: any) => {
    try {
        await chain.get().undelegatebw(item.from, item.to, item.net_weight, item.cpu_weight, chain.getAuth());
        window.msg.success(t('resource.stakeSuccess'));
        emit('close');
        emit('loadData');
    } catch (e) {
        window.msg.error(chain.getErrorMsg(e));
    }
};

// 获取详情
const { currentWallet } = store.wallet();
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
</script>

<template>
    <popup-bottom :is-show="props.isShow" :title="$t('resource.stakeInfo')" @close="$emit('close')">
        <div class="list-container">
            <!-- cpu -->
            <div v-if="props.type == 'cpu'">
                <div :key="item.id" v-for="item in otherCPU">
                    <div class="info-cell">
                        <span class="info-cell-key">{{ item.to }}：</span>
                        <span class="info-cell-value">
                            {{ item.cpu_weight }}
                        </span>
                        <n-button @click="submit(item)">
                            {{ $t('resource.unstake') }}
                        </n-button>
                    </div>
                </div>

                <div v-if="otherCPU.length === 0" class="empty-cell">
                    <span>{{ $t('resource.noStakeForOthers') }}</span>
                </div>
            </div>

            <!-- net -->
            <div v-if="props.type == 'net'">
                <div :key="item.id" v-for="item in otherNET">
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

                <div v-if="otherNET.length === 0" class="empty-cell">
                    <span>{{ $t('resource.noStakeForOthers') }}</span>
                </div>
            </div>
        </div>
    </popup-bottom>
</template>

<style lang="scss" scoped>
.list-container {
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
}
.info-cell {
    margin: 0px 15px 12px 15px;
    height: 45px;
    border-bottom: 1px solid $color-separate;
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
</style>
