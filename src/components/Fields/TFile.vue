<script setup lang="ts">
import JsFileDownloader from "js-file-downloader";

const props = defineProps({
  files: {
    type: Array,
    default: () => []
  }
});

async function handleDownload(item) {
  await new JsFileDownloader({
    url: `/api/v1/upload/${item.response.url}`
  });
}
</script>

<template>
  <div class="cursor-pointer text-blue-200" v-if="files?.length > 0" @click="handleDownload(props.files[0])">下载</div>
  <div v-else>-</div>
</template>
