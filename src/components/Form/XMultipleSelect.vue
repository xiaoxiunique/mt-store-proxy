<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from "vue";
import { get } from "lodash";
import { http } from "@/utils/http";
import { FormProps } from "@/components/Form/types";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<FormProps>(), {
  formKey: "form",
  prop: "",
  label: "",
  k: "",
  api: ""
});

const form = inject(props.formKey, {});
const list = ref([]);

async function load() {
  const res = await http.get(props.api, {
    params: {}
  });
  list.value = res.data.docs;
}

const computedList = computed(() => {
  return list.value.map(item => ({
    value: item._id,
    label: get(item, props.v)
  }));
});

const chooseList = ref([]);
watch(
  () => form.value[props.prop],
  () => {
    chooseList.value = computedList.value.filter(item => {
      // @ts-ignore
      return form.value[props.prop].includes(item.value);
    });
  }
);

function handleRatioChange() {
  form.value[props.prop + "Extend"] = chooseList;
}

onMounted(async () => {
  await load();

  if (form.value._id) {
    chooseList.value = form.value[props.prop + "Extend"];
  }
});
</script>

<template>
  <el-select
    style="width: 100%"
    v-model="form[props.prop]"
    v-if="!form._id"
    filterable
    clearable
    multiple
  >
    <el-option
      v-for="item in computedList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>

  <div class="px-4 py-4 mt-2 bg-gray-100 w-full rounded-[4px]" v-if="chooseList.length > 0">
    <div>配合比详情</div>
    <div v-for="(item, index) in chooseList" :key="index">
      <el-row :gutter="16" class="mt-2">
        <re-col :value="8">
          <el-input v-model="item.label" disabled />
        </re-col>
        <re-col :value="8">
          <el-input-number v-model="item.ratio" placeholder="材料用量" @change="handleRatioChange" />
        </re-col>
      </el-row>
    </div>
  </div>
</template>
