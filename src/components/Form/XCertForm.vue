<script setup lang="ts">
import { inject, ref } from "vue";
import FormGroup from "@/components/Form/FormGroup.vue";
import { FormProps } from "./types.ts";

const props = withDefaults(defineProps<FormProps>(), {
  formKey: "form",
  prop: "",
  label: ""
});

const form = inject(props.formKey, { meta: [] });
form.value.meta = form.value.meta || [];

</script>

<template>
  <div>
    <template v-for="(item, index) in form.meta" :key="index">
      <FormGroup
        class="relative cursor-pointer"
        v-model:data="form.meta[index]"
        @remove="
          () => {
            form.meta.splice(index, 1);
          }
        "
      />
    </template>

    <!--      add 'add' btn-->
    <el-form-item class="mt-4">
      <el-button
        class="w-full"
        type="primary"
        @click="
          form.meta.push({
            type: 'group',
            title: '分组' + form.meta.length,
            children: []
          });
        "
        >添加新的分组</el-button
      >
    </el-form-item>
  </div>
</template>
