<script setup lang="ts">
import Main from '@/components/Main.vue';
const n = ref('123');
</script>

<template>
    {{ n }}
    <main>
        <Main>Popup</Main>
    </main>
</template>

<style>
main {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
