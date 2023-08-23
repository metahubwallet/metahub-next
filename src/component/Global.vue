<script setup lang="ts">
import { createDiscreteApi } from 'naive-ui';

const { message, dialog } = createDiscreteApi(['message', 'dialog']);
window.msg = message;
window.dialog = dialog;

</script>

<template></template>

<style lang="scss" scoped></style>
