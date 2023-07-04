<script lang="ts" setup>
import { WhiteItem } from '@/store/wallet/type';

// 初始化
onBeforeMount(() => {
    getData();
});

// 删除白名单
const domain = ref(Number(useRoute().query.domain));
const deleteWhiteListHandle = (list: WhiteItem[]) => {
    store.wallet().whitelist.forEach((item1, index) => {
        list.forEach((item2) => {
            if (JSON.stringify(item1) === JSON.stringify(item2))
                store.wallet().whitelist.splice(index, 1);
        });
    });
    store.wallet().setWhitelist(store.wallet().whitelist);
    getData();
};

// 获取白名单
const whiteActors = ref<Record<string, Record<string, WhiteItem[]>>>({});
const getData = () => {
    whiteActors.value = {};
    let list: Record<string, WhiteItem[]> = {};
    const domianWhiteList = store.wallet().whitelist.filter((item) => item.domain === domain.value);

    domianWhiteList.forEach((item) => {
        if (list[item.actor] && list[item.actor].length > 0) {
            list[item.actor].push(item);
        } else list[item.actor] = [item];
    });

    Object.keys(list).forEach((key) => {
        let subList: Record<string, WhiteItem[]> = {};
        list[key].forEach((item: WhiteItem) => {
            if (subList[item.contract] && subList[item.contract].length > 0) {
                subList[item.contract].push(item);
            } else subList[item.contract] = [item];
        });
        whiteActors.value[key] = subList;
    });
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.whitelist') + $t('wallet.detail')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar>
                    <div
                        :key="actorKey"
                        class="scrollbar-container-div"
                        v-for="(whiteLists, actorKey) in whiteActors"
                    >
                        <div class="all-container-div">
                            <div class="account-name">
                                <div class="account-name-left">
                                    {{ $t('setting.accountName') }}
                                </div>

                                <div class="account-name-right">{{ actorKey }}</div>
                            </div>
                            <div :key="codeKey" v-for="(whiteList, codeKey) in whiteLists">
                                <div class="account-type">
                                    <div class="account-type-left">{{ codeKey }}</div>
                                    <div
                                        @click="deleteWhiteListHandle(whiteList)"
                                        class="account-type-right"
                                    >
                                        {{ $t('setting.whiteListCancel2') }}
                                    </div>
                                </div>
                                <div
                                    class="account-cell"
                                    v-for="(whiteItem, index) in whiteList"
                                    :key="index"
                                >
                                    <div class="account-type-code">
                                        <div class="account-type-left">
                                            {{ whiteItem.action }}
                                        </div>
                                        <div
                                            @click="deleteWhiteListHandle([whiteItem])"
                                            class="account-type-right"
                                        >
                                            {{ $t('setting.whiteListCancel') }}
                                        </div>
                                    </div>
                                    <div
                                        :key="contractKey"
                                        class="contract-item"
                                        v-for="(contractValue, contractKey) in whiteItem.properties"
                                    >
                                        <div>{{ contractKey }}: {{ contractValue }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </n-scrollbar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.scrollbar-container-div {
    width: 100%;
}

.contract-item {
    width: 100%;
    margin: 8px 0px;
    font-size: 12px;
    color: #666666;
    text-align: right;
    word-wrap: break-word;
    &:last-child {
        padding-bottom: 12px;
    }
}

.account-name {
    height: 50px;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    margin-bottom: 10px;
}

.account-type {
    height: 36px;
    padding: 0 15px;
    color: #333;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .account-type-right {
        font-size: 12px;
        color: #409eff;
        border: 1px solid #409eff;
        padding: 1px 6px;
        cursor: pointer;
        border-radius: 4px;
    }
}

.account-type-code {
    padding: 0 0;
    color: #333;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .account-type-right {
        font-size: 12px;
        color: #409eff;
        border: 1px solid #409eff;
        padding: 1px 6px;
        cursor: pointer;
        border-radius: 4px;
    }
}

.bottom-btn-container {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
}

.account-cell {
    margin: 0px 15px 10px;
    background: #ffffff;
    border-radius: 6px;
    padding: 10px 10px 0px 10px;
}

.all-container-div {
    border-radius: 4px;
    font-size: 18px;
    color: #666666;
}

.account-tip {
    font-size: 14px;
    color: #666;
    margin: 15px;
    margin-top: 30px;
    .account-tip-one {
        margin-top: 6px;
    }
}
</style>
