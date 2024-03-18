import { computed, onMounted, ref } from "vue";
import { http } from "@/utils/http";
import { keyBy } from "lodash";
import { useRoute } from "vue-router";
import { useStorage } from "@vueuse/core";

export function useModel(symbol?: string) {
  const route = useRoute();
  const models = ref({});
  const storage = useStorage<any>("models", {});
  if (!symbol) {
    symbol = route.query.entity as any;
    if (!symbol) {
      symbol = route.path.split("/")[3];
    }
  }

  async function load() {
    const r = await http.get("/generator/models");
    models.value = keyBy(r, "serverPath");
    storage.value = {
      models: models.value,
      time: new Date().getTime()
    };
  }

  onMounted(async () => {
    // await load();
    if (
      storage.value.time &&
      new Date().getTime() - storage.value.time < 10000
    ) {
      models.value = storage.value.models;
    } else {
      await load();
    }
  });

  const currentModel = computed(() => {
    return models.value[symbol] || { fields: [] };
  });

  const computedRules = computed(() => {
    return currentModel.value?.fields.reduce((acc, cur) => {
      if (cur.required) {
        acc[cur.prop] = [
          {
            required: true,
            message: `请输入${cur.label}`,
            trigger: "blur"
          }
        ];
      }
      return acc;
    }, {});
  });

  return {
    models,
    currentModel,
    computedRules
  };
}

export function useInitData(fn: Function) {
  const initData = ref({});

  async function load() {
    const r = await http.get("/common/init-data");
    initData.value = r;

    fn && fn(r);
  }

  onMounted(async () => {
    await load();
  });

  return {
    initData
  };
}
