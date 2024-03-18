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
  <el-upload
    v-model:file-list="form[props.prop]"
    class="upload-demo"
    action="https://swap.yuanyic.com/api/v1/upload"
  >
    <el-button type="primary">点击上传文件</el-button>
    <template #tip>
      <div class="el-upload__tip">
        上传附件
      </div>
    </template>
  </el-upload>
</template>
