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
  <el-input-number
    v-bind="$attrs"
    :min="0"
    controls-position="right"
    :style="'width: 100%'"
    v-model="form[props.prop]"
    :placeholder="'请输入' + props.label"
  />
</template>
