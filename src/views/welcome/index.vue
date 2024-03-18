<script setup lang="ts">
import { computed, h, ref } from "vue";
import { addDialog, closeDialog } from "@/components/ReDialog/index";
import editForm from "./components/StoreForm.vue";
import { ElMessage } from "element-plus";
import SDK from "@/api/sdk";
import { useStorage } from "@vueuse/core";
import _ from "lodash";
import { useCopyToClipboard } from "@pureadmin/utils";

defineOptions({
  name: "Welcome"
});

const store = useStorage("store", {});
const sdk = ref(null);
sdk.value = new SDK(store.value.cookie);
const products = useStorage("products", []);
const tags = useStorage("tags", []);

const tagMap = computed(() => {
  const map = {};
  for (const tag of tags.value) {
    for (const subTag of tag.tags) {
      map[subTag.tag] = {
        parentTagId: tag.tag,
        parentTagName: tag.name,
        tagId: subTag.tag,
        tagName: subTag.name
      };
    }
  }
  return map;
});

const completedProducts = computed(() => {
  return products.value.map(product => {
    const tag = tagMap.value[product.tag];
    return {
      ...product,
      l1_tag: tag?.parentTagName,
      l2_tag: tag?.tagName
    };
  });
});

const tagProductMap = computed(() => {
  const map = {};
  for (const product of products.value) {
    if (!map[product.tag]) {
      map[product.tag] = [];
    }
    map[product.tag].push(product);
  }
  return map;
});

function clean() {
  store.value = {};
  products.value = [];
  tags.value = [];
}

window.ipcRenderer.on("login", async (event, arg) => {
  console.log("login", arg);
  closeDialog({}, 0, { command: "cancel" });
  ElMessage.success("登录成功");
  sdk.value = new SDK(arg.cookie);
  const r = await sdk.value.poiList();
  store.value = { ...r.data[0], cookie: arg.cookie };
});

window.ipcRenderer.on("product-list", (event, arg) => {
  products.value.push(...arg);
});

window.ipcRenderer.on("tags", (event, arg) => {
  for (const item of arg) {
    if (tags.value.find(tag => tag.name === item.name)) {
      continue;
    }
    tags.value.push(item);
  }
});

async function deleteStore() {
  const tagRes = await sdk.value.tagList(store.value.id);
  const tagIds = tagRes.tagList.map(item => item.id);
  await sdk.value.deletePoi(store.value.id, tagIds);
  ElMessage.success("删除成功");
}

function openProxy() {
  window.ipcRenderer.send("open-proxy");
}

async function uploadTag() {
  const newTags = [];
  for (const tag of tags.value) {
    console.log(tag);
    const parent = {
      id: "",
      name: tag.name,
      description: tag.description,
      level: 1,
      parentId: 0,
      top_flag: tag.top_flag,
      isLeaf: 1,
      time_zone: {},
      topTimeZone: {}
    };

    const data = await sdk.value.saveTag(store.value.id, [parent]);
    const parantId = data;
    newTags.push(tag);

    // [{"tagId":790340656,"tagName":"组合装19.9起"}]
    // TODO: upload project above tag
    const tagList = JSON.stringify([
      {
        tagId: parantId,
        tagName: tag.name
      }
    ]);
    if (tagProductMap.value[tag.tag]) {
      const products = tagProductMap.value[tag.tag];
      for (const product of products) {
        const upccode = _.get(product, "skus[0].upccode");
        if (!upccode) {
          continue;
        }
        const upcproject = await sdk.value.getUpcInfo(store.value.id, upccode);
        await sdk.value.saveProduct(
          store.value.id,
          product,
          upcproject.product,
          tagList
        );
      }
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    if (tag.tags) {
      for (const child of tag.tags) {
        const parentId = await sdk.value.saveTag(store.value.id, [
          {
            id: "",
            name: child.name,
            description: child.description,
            level: 2,
            parentId: parantId,
            top_flag: child.top_flag,
            isLeaf: 1,
            time_zone: {},
            topTimeZone: {}
          }
        ]);
        await new Promise(resolve => setTimeout(resolve, 200));

        const tagList = JSON.stringify([
          {
            tagId: parentId,
            tagName: child.name
          }
        ]);

        if (tagProductMap.value[child.tag]) {
          const products = tagProductMap.value[child.tag];
          for (const product of products) {
            const upccode = _.get(product, "skus[0].upccode");
            if (!upccode) {
              continue;
            }
            const upcproject = await sdk.value.getUpcInfo(store.value.id, upccode);
            await sdk.value.saveProduct(
              store.value.id,
              product,
              upcproject.product,
              tagList
            );
          }
        }
        // TODO: update project
      }
    }
  }
}

async function upload() {
  ElMessage.success("开始上传商品");
  for (const product of products.value) {
    await sdk.value.saveProduct(store.value.id, product);
  }
}

async function testUpload() {
  // await uploadTag();
  const product = products.value[0];
  const upccode = _.get(product, "skus[0].upccode");
  const upcInfo = await sdk.value.getUpcInfo(store.value.id, upccode);
  console.log(upcInfo.product);
  await sdk.value.saveProduct(store.value.id, product, upcInfo.product);
}

function copy(product) {
  useCopyToClipboard().clipboardValue.value = JSON.stringify(product);
  alert("已复制");
}

function openDialog() {
  addDialog({
    title: `添加门店`,
    props: {},
    width: "80%",
    draggable: true,
    fullscreenIcon: true,
    hideFooter: true,
    closeOnClickModal: false,
    contentRenderer: () => h(editForm, {}),
    beforeSure: (done, { options }) => {
      console.log("completed");
      done();
    }
  });
}

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

// Listen for data from main process
window.ipcRenderer.on("excel-data", (event, data) => {
  // Handle the data (e.g., download the Excel file)
  const blob = new Blob([s2ab(data)], {type: ''});
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'products.xls';
  link.click();
});

function download() {
  window.ipcRenderer.invoke("generate-excel", JSON.parse(JSON.stringify(completedProducts.value)));
}
</script>

<template>
  <div class="px-4 py-4">
    <h1>外卖小哥助手</h1>
    <div class="mt-4">
      <el-button type="primary" @click="openDialog">添加门店</el-button>
      <el-button type="success" @click="openProxy">抓取竞品</el-button>
      <el-button @click="uploadTag">导入商品</el-button>
      <el-button @click="testUpload" type="warning">测试商品上传</el-button>
      <el-button @click="clean" type="danger">清除数据</el-button>
      <el-button @click="download">下载数据</el-button>
    </div>

    <div class="py-4 space-y-2">
      <p class="font-bold">
        分类数量：{{ tags.length }} | 商品数量：{{ products.length }}
      </p>

      <div class="text-sm text-blue-400">
        <span v-for="tag in tags" :key="tag.id"> {{ tag.name }} | </span>
      </div>
      <div
        v-for="project in products"
        :key="project.id"
        class="flex gap-2 text-sm mt-2"
      >
        <div>
          {{ project.skus[0].upcCode }}
        </div>
        <el-avatar :src="project.picture" size="small" shape="square" />
        <div>
          {{ project.name }}
        </div>
        <div class="text-red-700">
          {{ project.min_price }}
        </div>

        <div @click="copy(project)"> copy</div>
      </div>
    </div>

    <div class="py-4 font-bold" v-if="store?.poiName">
      {{ store?.poiName }} ({{ store?.businessDesc }})

      <div class="mt-4">
        <el-button type="warning" @click="deleteStore">清除商品</el-button>
      </div>
    </div>
  </div>
</template>
