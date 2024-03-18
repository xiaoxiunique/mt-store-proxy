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
    action="/api/v1/upload"
    :show-file-list="false"
    name="file"
    :on-success="
      url => {
        form['icon'] = url.url;
      }
    "
  >
    <img v-if="form['icon']" :src="form['icon']" class="w-[100px] h-[100px]" />
    <div
      v-else
      class="mt-2 h-[80px] w-[80px] border-dotted border-gray-500 rounded-md border-2 items-center flex justify-center cursor-pointer"
    >
      <el-icon class="text-4xl">
        <Plus />
      </el-icon>
    </div>
  </el-upload>
</template>
