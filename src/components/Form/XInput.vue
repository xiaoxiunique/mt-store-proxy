<script setup lang="ts">
import { inject } from "vue";
import { FormProps } from "./types.ts";

const props = withDefaults(defineProps<FormProps>(), {
  formKey: "form",
  prop: "",
  label: ""
});

const form = inject(props.formKey, {});
</script>

<template>
  <el-input v-model="form[props.prop]" :placeholder="'请输入' + props.label" v-bind="$attrs" />
</template>
