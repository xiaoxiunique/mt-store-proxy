<script setup lang="ts">
import { defineOptions, ref, watch } from "vue";

defineOptions({
  name: "Upload"
});

const props = defineProps(["fileUrl"]);
const emit = defineEmits(["update:fileUrl"]);
const url = ref(props.fileUrl || {});

watch(
  () => props.fileUrl,
  val => {
    url.value = val;
  }
);

function onSuccess(r) {
  url.value = r.url;
  emit("update:fileUrl", url.value);
}
</script>

<template>
  <el-upload
    action="https://www.fuzhengyun.com/api/v1/upload"
    name="file"
    :show-file-list="false"
    :on-success="onSuccess"
  >
    <img
      v-if="url"
      :src="url"
      class="w-[80px] h-[80px] mt-2"
      alt="Upload File"
    />
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
