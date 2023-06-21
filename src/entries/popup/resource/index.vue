<script setup lang="ts">
const showResBox = ref(true);

// 初始化
onMounted(async () => {
    await localCache.get('smoothMode', false).then((res) => {
        console.log(res);
        console.log(Boolean(res));

        smoothMode.value = Boolean(res);
    });
});

// 切换顺畅模式
const smoothMode = ref(true);
const smoothModeCPU = ref('~');
const changeSmoothMode = async () => {
    await localCache.set('smoothMode', smoothMode.value);
};

// 新标签页跳转
const toLink = (url: string) => {
    chrome.tabs.create({ url: url });
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('resource.resources')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar class="full">
                    <div class="res-container" :class="{ padding: showResBox }">
                        <!-- header -->
                        <div class="res-header" v-show="showResBox">
                            <!-- smooth mode -->
                            <div class="smooth-mode" :class="{ on: smoothMode }">
                                <!-- smoothMode switch -->
                                <div class="line1">
                                    <div>{{ $t('resource.smoothMode') }}</div>
                                    <n-switch
                                        style="display: block"
                                        v-model:value="smoothMode"
                                        active-color="#C02BFC"
                                        @change="changeSmoothMode"
                                    ></n-switch>
                                </div>

                                <!-- recharge -->
                                <div class="line2">
                                    <div>{{ $t('resource.remainingNET') }} {{ smoothModeCPU }}</div>
                                    <div>
                                        <span @click="$router.push({ name: 'recharge' })">
                                            {{ $t('resource.recharge') }} >
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- links -->
                            <div class="links">
                                <div
                                    class="link flex justify-between items-center"
                                    @click="toLink('https://eospowerup.io/')"
                                >
                                    {{ $t('resource.freeCPU') }}
                                    <icon-right theme="filled" size="14" fill="#4a4a4a" />
                                </div>
                                <div
                                    class="link flex justify-between items-center"
                                    @click="toLink('https://rex.tokenpocket.pro/#/')"
                                    style="margin-top: 8px"
                                >
                                    {{ $t('resource.tradeREX') }}
                                    <icon-right theme="filled" size="14" fill="#4a4a4a" />
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
.full {
    background-color: #fff;

    .res-container {
        display: flex;
        flex-direction: column;
        &.padding {
            padding: 15px;
        }
        .res-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .smooth-mode {
                width: 222px;
                height: 100px;
                background: #ffffff;
                box-shadow: 0px 0px 12px 1px rgba(131, 60, 191, 0.0784313725490196);
                border-radius: 8px;
                border: 1px solid #dbdbdb;
                &.on {
                    border: #bf01fa 1px solid;
                    background-image: linear-gradient(
                        rgba(247, 197, 244, 0.6),
                        rgba(234, 225, 250, 0.06)
                    );
                }
            }
            .links {
                display: flex;
                flex-direction: column;
                width: 115px;
                height: 100px;
                font-size: 12px;
                .link {
                    padding: 12px;
                    width: 115px;
                    height: 46px;
                    background: #ffffff;
                    box-shadow: 0px 0px 12px 1px rgba(131, 60, 191, 0.0784313725490196);
                    border-radius: 8px;
                    border: 1px solid #dbdbdb;
                    text-align: center;
                    cursor: pointer;
                    .arrow-icon {
                        width: 15px;
                        height: 15px;
                        img {
                            width: 11px;
                        }
                    }
                }
            }
        }
        .line1 {
            padding: 15px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        .line2 {
            padding: 0 15px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            font-weight: 400;
            vertical-align: middle;
            color: #222;
            span {
                cursor: pointer;
                font-size: 12px;
                color: #c02bfc;
            }
        }
    }
}
</style>
