<script lang="ts" setup>
import { WhiteItem } from '@/types/settings';


const domains = ref<number[]>([]);
onBeforeMount(() => {
    store.setting().whitelist.forEach((whiteItem: WhiteItem) => {
        if (domains.value.indexOf(whiteItem.domain) == -1) {
            domains.value.push(whiteItem.domain);
        }
    });
});
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.whitelist')"></page-header>

            <div class="cover-content _effect">
                <div class="container">
                    <!-- list -->
                    <div class="setting-group" v-if="domains.length">
                        <div
                            :key="domain"
                            @click="
                                $router.push({
                                    name: 'whitelist-detail',
                                    query: { domain },
                                })
                            "
                            class="setting-item"
                            v-for="domain in domains"
                        >
                            <div class="setting-item-left">
                                <div class="item-title">{{ domain }}</div>
                            </div>
                            <div class="setting-item-right">
                                <div class="item-subtitle"></div>
                                <img class="bg-img" src="@/asset/img/right_arrow@2x.png" />
                            </div>
                        </div>
                    </div>

                    <n-empty v-else class="m-auto mt-[50%]" />
                </div>
            </div>
        </div>
        <!-- router -->
    </div>
</template>

<style lang="scss" scoped>
.setting-group {
    padding: 0;
    margin-top: 10px;
    background-color: #fff;
    border: 1px solid $color-separate;
    border-width: 1px 0 1px 0;
    &:first-child {
        margin-top: 15px;
    }
    .setting-item {
        height: 60px;
        border-bottom: 1px solid $color-separate;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        margin-left: 15px;
        padding-right: 15px;
        &:last-child {
            border-bottom-width: 0;
        }

        .setting-item-left {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            img {
                width: 30px;
                height: auto;
                margin-right: 15px;
            }
        }
        .setting-item-right {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            img {
                width: 7.5px;
                height: auto;
            }
        }

        .item-title {
            font-size: 14px;
            color: #4a4a4a;
        }
        .item-subtitle {
            font-size: 12px;
            color: #cccccc;
            margin-right: 10px;
        }
    }
}
</style>
