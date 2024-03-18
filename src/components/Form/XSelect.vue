<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from "vue";
import { get } from "lodash";
import { http } from "@/utils/http";
import { FormProps } from "@/components/Form/types";

const props = withDefaults(defineProps<FormProps>(), {
  formKey: "form",
  prop: "",
  label: "",
  k: "",
  api: "",
});

const form = inject(props.formKey, {});
const list = ref([]);

async function load() {
  const res = await http.get(props.api, {
    params: {
      _limit: 100,
      _sort: 'createdAt:desc'
    }
  });
  list.value = res.data.docs;

  if (!form.value[props.prop] && props.init) {
    form.value[props.prop] = list.value[0]["_id"];
  }
}

const computedList = computed(() => {
  return list.value.map(item => ({
    value: item._id,
    label: get(item, props.v)
  }));
});

onMounted(async () => {
  await load();
});
</script>

<template>
  <el-select style="width: 100%" v-model="form[props.prop]" filterable clearable v-bind="$attrs">
    <el-option
      v-for="item in computedList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
