<script setup lang="ts">
import { nextTick, ref } from "vue";

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: [Number, String]
  }
});

const current = ref({});
nextTick(() => {
  current.value = props.item.options.find(item => item.value === props.data) || { label: 'unknown', type: 'warning' };
})
</script>

<template>
  <el-tag :type="current.type">{{ current.label }}</el-tag>
</template>
