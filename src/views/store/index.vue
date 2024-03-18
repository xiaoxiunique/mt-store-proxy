<script setup lang="ts">
import { onMounted, ref } from "vue";
// import { G } from "@/store/unstorage";

defineOptions({
  name: "Store"
});

const store = ref({});

// onMounted(() => {
//   store.value = G.getItem("store");
// });
</script>

<template>
  <div class="px-4 py-4">
    <h1>外卖小哥助手</h1>
    {{ store }}
  </div>
</template>
