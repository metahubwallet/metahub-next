<script setup lang="ts">
const wallet = store.wallet();
const { timeFormat } = tool;
</script>

<template>
    <n-scrollbar>
        <div
            v-for="(item, index) of wallet.recentTransations"
            :key="index"
            class="grid grid-cols-12 items-center border-gray-200 py-[10px] cursor-pointer"
            :class="index ? 'border-t' : ''"
            @click="$emit('select', item)"
        >
            <div class="col-span-7 ml-2">
                {{ $t('wallet.receiverAccount') }}:
                <span v-if="item.receiver.length == 42">
                    {{ item.receiver.substring(0, 10) }}...{{ item.receiver.substring(36) }}
                </span>
                <span v-else>{{ item.receiver }}</span>
            </div>

            <div class="col-span-5">
                {{ timeFormat(item.time) }}
            </div>
        </div>
    </n-scrollbar>
</template>

<style lang="scss" scoped></style>
