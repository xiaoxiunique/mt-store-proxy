<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <el-descriptions border :column="1" v-bind="$attrs">
    <el-descriptions-item v-for="(item, i) in props.data" label-class-name="bg-red-100" :label="item.label">{{
      item.ratio
    }}</el-descriptions-item>
  </el-descriptions>
</template>
