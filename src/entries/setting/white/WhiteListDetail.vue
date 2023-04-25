<script lang="ts" setup>
import { WhiteItem } from '@/store/chain/types';

const loading = ref(false);
const domianWhiteList = ref<WhiteItem[]>([]);
const domain = ref(useRoute().query.domain);
let whiteListActorObj = reactive<any>({});

onBeforeMount(() => {
    setupData();
});

const handleDeleteArray = (deleteArray: any) => {
    store.chain().delWhiteObjs(deleteArray);
    setupData();
};

const { whitelist } = store.chain();
const setupData = () => {
    whiteListActorObj = {};
    domianWhiteList.value = whitelist.filter((item) => item.domain === domain.value);

    domianWhiteList.value.forEach((whiteObj) => {
        if (whiteListActorObj[whiteObj.actor] && whiteListActorObj[whiteObj.actor].length > 0) {
            whiteListActorObj[whiteObj.actor].push(whiteObj);
        } else {
            whiteListActorObj[whiteObj.actor] = [whiteObj];
        }
    });

    Object.keys(whiteListActorObj).forEach((key) => {
        let subArray = whiteListActorObj[key];
        let subArrayObj: any = {};
        subArray.forEach((whiteObj: WhiteItem) => {
            if (subArrayObj[whiteObj.contract] && subArrayObj[whiteObj.contract].length > 0) {
                subArrayObj[whiteObj.contract].push(whiteObj);
            } else {
                subArrayObj[whiteObj.contract] = [whiteObj];
            }
        });
        whiteListActorObj[key] = subArrayObj;
    });
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle :back-text="$t('auth.back')" title=""></top-handle>
            <div class="cover-content _effect">
                <n-scrollbar>
                    <div
                        :key="actorKey"
                        class="scrollbar-container-div"
                        v-for="(actorObj, actorKey) in whiteListActorObj"
                    >
                        <div class="all-container-div" v-loading="loading">
                            <div class="account-name">
                                <div class="account-name-left">
                                    {{ $t('setting.accountName') }}
                                </div>

                                <div class="account-name-right">{{ actorKey }}</div>
                            </div>
                            <div :key="codeKey" v-for="(codeObj, codeKey) in actorObj">
                                <div class="account-type">
                                    <div class="account-type-left">{{ codeKey }}</div>
                                    <div
                                        @click="handleDeleteArray(codeObj)"
                                        class="account-type-right"
                                    >
                                        {{ $t('setting.whiteListCancel2') }}
                                    </div>
                                </div>
                                <div
                                    class="account-cell"
                                    v-bind:key="whiteObj.id"
                                    v-for="whiteObj in codeObj"
                                >
                                    <div class="account-type-code">
                                        <div class="account-type-left">
                                            {{ whiteObj.action }}
                                        </div>
                                        <div
                                            @click="handleDeleteArray([whiteObj])"
                                            class="account-type-right"
                                        >
                                            {{ $t('setting.whiteListCancel') }}
                                        </div>
                                    </div>
                                    <div
                                        :key="contractKey"
                                        class="contract-item"
                                        v-for="(contractValue, contractKey) in whiteObj.properties"
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
@import '@/assets/css/color.scss';

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
