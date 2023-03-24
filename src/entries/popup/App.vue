<script setup lang="ts">
const apiTest = () => {
    return api.cpu.setTime({ account: 'Tom' });
};
</script>

<template>
    {{ apiTest() }}
    <Main>Popup</Main>
</template>
