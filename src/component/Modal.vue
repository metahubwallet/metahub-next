<script setup lang="ts">
interface Props {
    isShow: boolean;
    title: string;
    showCancel?: boolean;
    cusFooter?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    showCancel: true,
    cusFooter: false,
});
</script>

<template>
    <n-modal v-model:show="props.isShow" @mask-click="$emit('close')">
        <n-card class="w-5/6" :title="props.title" :bordered="false">
            <template #header-extra>
                <icon-close
                    @click="$emit('close')"
                    theme="outline"
                    size="18"
                    fill="#6f6f6f"
                    class="mr-[10px] cursor-pointer"
                />
            </template>

            <slot></slot>

            <template #footer>
                <div class="flex justify-end" v-if="!props.cusFooter">
                    <n-button @click="$emit('close')" class="mr-2" v-if="showCancel">
                        {{ $t('public.cancel') }}
                    </n-button>
                    <n-button type="primary" @click="$emit('submit')">
                        {{ $t('public.ok') }}
                    </n-button>
                </div>
            </template>
        </n-card>
    </n-modal>
</template>

<style lang="scss" scoped></style>
