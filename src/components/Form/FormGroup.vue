<script setup lang="ts">
import { ref, watch } from "vue";
import { vDraggable } from "vue-draggable-plus";

const props = defineProps({
  data: {
    type: Object
  }
});

const emit = defineEmits(["update:data", "remove"]);
const group = ref({ ...props.data });

watch(
  () => props.data,
  val => {
    group.value = val;
  }
);

watch(
  () => group.value,
  val => {
    emit("update:data", val);
  },
  {
    deep: true
  }
);

const selectTypes = [
  {
    label: "文本输入",
    value: "input"
  },
  {
    label: "输入框",
    value: "textarea"
  },
  {
    label: "上传图片",
    value: "uploadImage"
  },
];
</script>

<template>
  <div class="bg-gray-100 mt-4 rounded-md p-4 relative">
    <div
      class="top-2 right-2 absolute p-2 h-[36px] w-[36px] rounded-[36px] bg-gray-300 flex justify-center items-center"
      @click="
        () => {
          emit('remove');
        }
      "
    >
      X
    </div>
    <div
      class="text-xl font-bold pb-2"
      :contenteditable="true"
      @blur="
        e => {
          group.title = e.target.innerText;
        }
      "
    >
      {{ group.title }}
    </div>
    <div
      v-draggable="[
        group.children,
        {
          animation: 150,
          ghostClass: 'ghost'
        }
      ]"
    >
      <div v-for="(item, index) in group.children" :key="index">
        <div class="py-2 mt-2">
          <el-popconfirm
            title="是否确认删除?"
            @confirm="
              () => {
                group.children.splice(index, 1);
              }
            "
          >
            <template #reference>
              <p>{{ item.key }}</p>
            </template>
          </el-popconfirm>
          <div class="flex flex-row justify-between mt-2">
            <div class="inline-block w-2/7">
              <el-select
                v-model="group.children[index].type"
                placeholder="请选择"
                class="w-full"
              >
                <el-option
                  v-for="item in selectTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="inline-block w-2/7" >
              <el-input v-model="group.children[index].key" placeholder="属性名" />
            </div>
            <div class="inline-block w-2/7">
              <el-input v-model="group.children[index].notes" class="w-1/3" placeholder="备注"></el-input>
            </div>
          </div>
          <div class="flex flex-row gap-x-2">
            <el-radio-group v-model="group.children[index].required">
              <el-radio label="1">必填</el-radio>
            </el-radio-group>
            <template v-if="group.children[index].type == 'uploadImage'">
              <el-radio-group v-model="group.children[index].isFile">
                <el-radio label="1">必须为文件</el-radio>
              </el-radio-group>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div
      class="h-[48px] flex justify-center items-center border-2 border-dotted border-gray-300"
    >
      <el-button
        class="w-[100px]"
        round
        @click="
          () => {
            group.children.push({
              type: 'input',
              key: 'input' + group.children.length,
              required: 1,
              isFile: 0
            });
          }
        "
        >添加
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
