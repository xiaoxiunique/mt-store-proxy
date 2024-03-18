<script setup lang="ts">
import { inject } from "vue";
import { FormProps } from "./types.ts";

const props = withDefaults(defineProps<FormProps>(), {
  formKey: "form",
  prop: "",
  label: "",
  options: []
});

const form = inject(props.formKey, {});
</script>

<template>
  <el-select style="width: 100%" v-model="form[props.prop]" :placeholder="'请选择 ' + props.label">
    <el-option
      v-for="item in props.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
