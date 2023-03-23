<template>
    <img :src="imageUrl" height="45" alt="" />
    <!-- header -->
    <h1>
       Test
    </h1>
    <button type="button" @click="increment">Clicks: {{ count }}</button>
    <p>
        <router-link to="/">Go to Home</router-link><br />
        <router-link to="/test">Go to Test</router-link>
    </p>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import logo from '@/assets/logo.svg';

const imageUrl = new URL(logo, import.meta.url).href;

const count = ref(0);

const increment = () => (count.value += 1);
</script>

<style>
h1 {
    margin: 5px;
}

button {
    margin-top: 10px;
}
</style>
