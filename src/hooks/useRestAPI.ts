import { ref } from "vue";
import { http } from "@/utils/http";
import { ElMessage, ElMessageBox } from "element-plus";

export function useRestAPI({
  api,
  callback
}: {
  api: string;
  callback?: (data?: any) => any;
}) {
  const loading = ref<boolean>(false);

  async function update({ id, ...body }) {
    loading.value = true;
    http
      .request("put", `${api}/${id || body._id}`, { data: body })
      .then(() => {
        callback?.();
      })
      .finally(() => {
        loading.value = false;
      });
  }

  async function create(body) {
    loading.value = true;
    http
      .request("post", `${api}`, { data: body })
      .then(() => {
        callback?.();
      })
      .finally(() => {
        loading.value = false;
      });
  }

  async function remove({ id }) {
    loading.value = true;
    http
      .request("delete", `${api}/${id}`)
      .then(() => {
        callback?.();
      })
      .finally(() => {
        loading.value = false;
      });
  }

  return {
    loading,
    create,
    update,
    remove
  };
}

export function useEleRestfulAPI({
  api,
  callback
}: {
  api: string;
  callback?: (data?: any) => any;
}) {
  const { loading, create, update, remove } = useRestAPI({ api, callback });

  async function confirmWrapper({ id }) {
    ElMessageBox.confirm("确定要删除吗？", "Warning", {
      type: "warning"
    }).then(async () => {
      await remove(id);
      ElMessage({
        type: "success",
        message: "删除成功"
      });
    });
  }

  return {
    loading,
    create,
    update,
    remove
  };
}
