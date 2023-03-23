<script setup lang="ts">
const settingStore = store.setting();
</script>

<template>
    {{ settingStore.language }}
    <el-button type="success" @click="settingStore.language = 'en'">Success</el-button>
    <main>
        <Main>Popup</Main>
    </main>
</template>
