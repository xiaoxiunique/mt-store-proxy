import { computed, onMounted, ref, watch } from "vue";
import { http } from "@/utils/http";

export function useSystemConfig(name: string, init?: any) {
  const loading = ref(false);
  const origin = ref<unknown>(JSON.stringify({}));
  const data = ref<any>({});
  const computedUpdated = computed(() => {
    return JSON.stringify(data.value) !== origin.value;
  });

  async function update() {
    await http.request("put", `/system/configs/` + name, { data: {...data.value, name} });
    await load();
  }

  onMounted(async () => {
    await load();
  });

  async function load() {
    loading.value = true;
    const r = await http.request("get", `/system/configs/${name}`);
    loading.value = false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (JSON.stringify(r.data) !== "{}") {
      data.value = r.data;
    } else {
      if (init) {
        data.value = init || {};
        await update();
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    origin.value = JSON.stringify(r.data);
  }

  return {
    data,
    load,
    loading,
    origin,
    update,
    computedUpdated
  };
}
