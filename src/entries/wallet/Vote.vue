<script lang="ts" setup>
import chain from '@/common/libs/chain';
import { eosChainId } from '@/common/utils/network';
import { getBpInfo } from '@/common/libs/remote';

const { t } = useI18n();
const imageURL = ref('');
const loading = ref(true);
const isShowVoteTip = ref(false);
const activeIndex = ref(1);
const producersData = ref<any>([]);
const tableData = ref<any>([]);
const search = ref('');
const votedButtonDisable = ref(true);
const voteTip = ref(t('wallet.vote'));
let accountInfo = reactive<any>({});
const totalStaked = ref(0);
const selectedArray = ref<any>([]);

const { currentWallet: account } = store.user();

onMounted(() => {
    tableData.value = producersData.value;
});

const handleTipClick = () => {
    isShowVoteTip.value = !isShowVoteTip.value;
};

const handleSelect = (key: number) => {
    if (key == 1) tableData.value = producersData.value;
    else {
        tableData.value = [];
        for (const index in producersData.value) {
            let obj: any = producersData.value[index];
            if (obj.voted) {
                tableData.value.push(obj);
            }
        }
    }
};

const updateVoteButton = () => {
    let selectedCount = 0;
    for (const index in producersData.value) {
        let obj: any = producersData.value[index];
        if (obj.voted) {
            selectedCount++;
        }
    }
    if (selectedCount > 0) {
        votedButtonDisable.value = false;
        voteTip.value = t('wallet.vote') + ` (${selectedCount})`;
    } else {
        voteTip.value = t('wallet.vote');
    }
};

const coinLikeCliked = async (item: any) => {
    for (const index in producersData.value) {
        let obj: any = producersData.value[index];
        if (obj.account == item.account) {
            obj.voted = !obj.voted;
        }
    }
    updateVoteButton();
};

const enterDetail = (item: any) => {
    if (store.chain().currentChainId != eosChainId) return; //BOS 没有详情列表
    chrome.tabs.create({ url: item.website });
};

const votedButtonClicked = () => {
    selectedArray.value = [];
    for (const index in producersData.value) {
        let obj: any = producersData.value[index];
        if (obj.voted) {
            selectedArray.value.push(obj.account);
        }
    }
    selectedArray.value.sort();
    onSubmit();
};

const onSubmit = async () => {
    //  按钮不可点
    votedButtonDisable.value = true;
    try {
        await chain.get().voteProducer(account.name, selectedArray.value, '', chain.getAuth());
        window.msg.success(t('wallet.voteSuccess'));
    } catch (e) {
        votedButtonDisable.value = false;
        return window.msg.success(t('public.executeFailure'));
    }

    activeIndex.value = 3;
    tableData.value = [];
    for (const index in producersData.value) {
        let obj: any = producersData.value[index];
        if (obj.voted) {
            tableData.value.push(obj);
        }
    }
    votedButtonDisable.value = false;
};

const getDataList = async () => {
    loading.value = true;
    let result = await getBpInfo();
    if (result.code == 200) {
        for (const index in result.data) {
            let obj: any = result.data[index];
            obj.voted = false;
        }
        producersData.value = result.data;
    } else window.msg.error(result.msg);

    loading.value = false;
};

const getAccountInfo = async () => {
    loading.value = true;
    try {
        accountInfo.value = await chain.get().getAccount(account.name);
        totalStaked.value =
            parseFloat(accountInfo.value.self_delegated_bandwidth.cpu_weight) +
            parseFloat(accountInfo.value.self_delegated_bandwidth.net_weight);
        totalStaked.value = parseFloat(totalStaked.value.toFixed(4));
        selectedArray.value = accountInfo.value.voter_info.producers;

        for (const index in producersData.value) {
            for (const index2 in selectedArray.value) {
                if (producersData.value[index].account == selectedArray.value[index2]) {
                    console.log(producersData.value[index].account);
                    producersData.value[index].voted = 1;
                    break;
                }
            }
        }
        updateVoteButton();
    } catch (e) {
        window.msg.error(chain.getErrorMsg(e));
    }
    loading.value = false;
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle :back-text="$t('auth.back')" :title="$t('wallet.vote')">
                <template slot="right">
                    <img
                        @click="handleTipClick"
                        class="vote-tip"
                        src="@/assets/images/vote_question@2x.png"
                    />
                </template>
            </top-handle>
            <div class="cover-content _effect">
                <n-container>
                    <n-menu
                        :default-active="activeIndex"
                        @select="handleSelect"
                        class="el-menu-demo"
                        mode="horizontal"
                    >
                        <n-menu-item index="1">{{ $t('wallet.vote') }}</n-menu-item>
                        <n-menu-item index="3">{{ $t('wallet.voted') }}</n-menu-item>
                    </n-menu>

                    <div class="separate-line"></div>
                    <n-input
                        :placeholder="$t('wallet.searchKeyWord')"
                        class="search-input"
                        size="tiny"
                        v-model="search"
                    />
                    <div class="scroll-bar-view" v-loading="loading">
                        <n-scrollbar>
                            <div class="point-container-div">
                                <n-table>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) of tableData.filter(
                                            (data:any) =>
                                                !search ||
                                                data.account
                                                    .toLowerCase()
                                                    .includes(search.toLowerCase()) ||
                                                data.account
                                                    .toLowerCase()
                                                    .includes(search.toLowerCase())
                                        )"
                                            :key="index"
                                        >
                                            <td>
                                                <img
                                                    @mouseup="enterDetail(item)"
                                                    class="icon-img"
                                                    v-lazy="imageURL + item.account + '_bp.png!128'"
                                                />
                                            </td>
                                            <td>
                                                <div @mouseup="enterDetail(item)" class="coin-code">
                                                    {{ item.account }}
                                                </div>
                                                <div
                                                    @mouseup="enterDetail(item)"
                                                    class="coin-contract"
                                                >
                                                    {{ $t('wallet.rank') }}:
                                                    {{ item.rank }} &nbsp;&nbsp;&nbsp;{{
                                                        $t('wallet.area')
                                                    }}: {{ item.area }}
                                                </div>
                                            </td>
                                            <td>
                                                <img
                                                    :src="
                                                        item.voted
                                                            ? require('@/assets/images/vote_selected.png')
                                                            : require('@/assets/images/vote_normal.png')
                                                    "
                                                    @mouseup="coinLikeCliked(item)"
                                                    style="
                                                        border: none;
                                                        height: 25px;
                                                        width: 25px;
                                                        cursor: pointer;
                                                    "
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </n-table>
                            </div>
                        </n-scrollbar>
                    </div>

                    <n-button
                        :disabled="votedButtonDisable"
                        @click="votedButtonClicked"
                        class="float-button"
                        type="primary"
                    >
                        {{ voteTip }}
                    </n-button>
                </n-container>
            </div>

            <transition name="el-fade-in-linear">
                <div @click="handleTipClick" class="tip-massage" v-show="isShowVoteTip">
                    <div class="tip-container">
                        <img class="vote-tip-img" src="@/assets/images/pop_ups_icon@2x.png" />
                        <div class="vote-tip-title">{{ $t('wallet.nodeVote') }}</div>
                        <div class="vote-tip-text">{{ $t('wallet.nodeVoteTip1') }}</div>
                        <div class="vote-tip-text">{{ $t('wallet.nodeVoteTip2') }}</div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tip-massage {
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .tip-container {
        background: #ffffff;
        border-radius: 6px;
        height: 355px;
        width: 345px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .vote-tip-img {
            height: 118px;
            width: 128px;
            margin-top: 40px;
        }
        .vote-tip-title {
            font-size: 15px;
            color: #4288fa;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .vote-tip-text {
            margin-top: 10px;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            line-height: 20px;
            margin-left: 13px;
            margin-right: 13px;
        }
    }
}

.vote-page {
    background-color: white;
}
.vote-tip {
    height: 34px;
    width: 22px;
    margin-left: 30px;
    padding-top: 12px;
    cursor: pointer;
}

.el-menu--horizontal > .el-menu-item {
    height: 44px;
    line-height: 44px;
}

.el-menu-demo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.content-header {
    margin: 0;
    padding: 0;
    .content-header-div {
        height: 100%;
        font-size: 14px;
        color: #7f7f7f;
        letter-spacing: 0;
        text-align: right;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .content-header-div1 {
        margin-left: 30px;
    }

    .content-header-div2 {
        margin-left: 20px;
        font-size: 18px;
        color: #4a8fe2;
        letter-spacing: 0;
    }
    .content-header-div3 {
        margin-left: 14px;
    }
    .footer {
        color: #7f7f7f;
        text-align: center;
    }
    .el-scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
            overflow-x: hidden;
        }
        .el-scrollbar__bar.is-horizontal {
            display: none;
        }
    }
    .content-list {
        flex-grow: 1;
        overflow-x: hidden;
        overflow-y: auto;
        .content-item {
            .content-info-big {
                padding-left: 30px;
                height: 80px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
            .content-info-left {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                img {
                    width: 34px;
                    height: 34px;
                }
            }
            .content-info-text {
                height: 40px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-start;
            }
            .content-info-up {
                padding-left: 14px;
                font-size: 14px;
                color: #4a4a4a;
                letter-spacing: 0;
            }
            .content-info-bottom {
                padding-left: 14px;
                font-size: 12px;
                color: #7f7f7f;
                letter-spacing: 0;
            }

            .content-info-right-red {
                padding-right: 30px;
                font-size: 18px;
                letter-spacing: 0;
                text-align: right;
                color: #e24054;
            }
            .content-info-right-blue {
                padding-right: 30px;
                font-size: 18px;
                letter-spacing: 0;
                text-align: right;
                color: #4a8fe2;
            }
            .separate-line {
                margin-left: 30px;
                margin-right: 30px;
                background-color: #f2f2f2;
                height: 1px;
            }
        }
    }
}
.float-button {
    position: fixed;
    left: 40%;
    bottom: 10%;
}
</style>
