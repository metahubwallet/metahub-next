<script lang="ts" setup></script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <n-scrollbar class="full">
                <top-handle
                    :back-text="$t('auth.back')"
                    :title="$t('public.readAndAgreeProtocols')"
                ></top-handle>
                <div class="cover-content _effect">
                    <div class="import-protocol">
                        {{ $t('public.viewUserProtocolsContent') }}
                    </div>
                </div>
            </n-scrollbar>
        </div>
        <!-- router -->
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';

.import-protocol {
    background-color: white;
    font-size: 15px;
    margin: 15px;
    text-indent: 2em;
    color: #333333;
}
</style>
