<script setup lang="ts">
const nodeEnv = env.VITE_ENV;
const type = typeof nodeEnv;
</script>

<template>
    {{ nodeEnv }}
    {{ type }}
    <main>
        <Main>Popup</Main>
    </main>
</template>
