<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { http } from "@/utils/http";
import { get } from "lodash";

const props = defineProps({
  value: {
    type: String
  },
  k: {
    type: String,
    default: "_id"
  },
  label: {
    type: String,
    default: "name"
  },
  api: {
    type: String,
    default: "/sys-roles"
  },
  params: {
    type: Object,
    default: () => ({
      _start: 0,
      _limit: 100
    })
  }
});
const emit = defineEmits(["update:value"]);

const list = ref([]);
const selValue = ref("");

watch(
  () => props.value,
  val => {
    val !== "_id" && (selValue.value = val);
  }
);

watch(
  () => selValue.value,
  val => {
    if (val === "_id") {
      return;
    }
    emit("update:value", val);
  }
);

async function load() {
  const res = await http.get(props.api, {
    params: props.params
  });
  list.value = res.data.docs;

  if (!props.value) {
    selValue.value = list.value[0][props.k];
  }
}

const computedList = computed(() => {
  return list.value.map(item => ({
    value: item[props.k],
    label: get(item, props.label)
  }));
});

onMounted(async () => {
  selValue.value = props.value;
  await load();
});
</script>

<template>
  <el-select v-model="selValue" filterable clearable>
    <el-option
      v-for="item in computedList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
