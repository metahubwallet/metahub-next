<script setup lang="ts">
interface Props {
    isShow: boolean;
    title: string;
    isCusFooter?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    isCusFooter: false,
});
</script>

<template>
    <n-modal class="import-modal" v-model:show="props.isShow" @mask-click="$emit('close')">
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
                <div class="dialog-foot flex justify-end" v-if="!props.isCusFooter">
                    <n-button @click="$emit('close')" class="mr-2">
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
