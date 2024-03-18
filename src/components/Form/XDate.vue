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
  <el-date-picker
    style="width: 100%"
    v-model="form[props.prop]"
    type="datetime"
    placeholder="选择日期"
    :clearable="false"
    :picker-options="{
      disabledDate: time => {
        return time.getTime() > Date.now();
      }
    }"
  />
</template>
