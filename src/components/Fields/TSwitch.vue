<script setup lang="ts">
import { ref } from "vue";
import { useModel } from "@/hooks/useModelConfig";
import { http } from "@/utils/http";

const props = defineProps(["row", "prop"]);
const value = ref(props.row[props.prop]);

const { currentModel } = useModel();

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
async function update() {
  await http.put(`${currentModel.value.serverPath}/${props.row._id}`, {
    data: {
      ...props.row,
      [props.prop]: value.value
    }
  });
}
</script>

<template>
  <el-checkbox v-model="value" @change="update" />
</template>
