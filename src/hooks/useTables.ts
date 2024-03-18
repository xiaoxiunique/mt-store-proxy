import { onMounted, reactive, ref, watch } from "vue";
import { PaginationProps } from "@pureadmin/table";
import { http } from "@/utils/http";
import { FormInstance } from "element-plus";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import { AxiosResponse } from "axios";
import { log } from "console";

interface Result {
  list: List[];
  page: Page;
}
interface Page {
  totalCount: number;
  totalPage: number;
  start: number;
  limit: number;
  currentPage: number;
}

interface List {
  _id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  roleId: string;
}

export function useTables({ api, defaultParams = {} }) {
  const params = reactive({
    _start: 0,
    _limit: 10,
    _sort: "createdAt:desc",
    ...defaultParams
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const loading = ref<boolean>(false);
  const data = ref<any[]>([]);
  const formRef = ref<FormInstance>();

  async function onSearch() {
    loading.value = true;
    http
      .get<any, Result>(api, {
        params: {
          ...params,
          _start:(pagination.currentPage - 1) * pagination.pageSize,
        }
      })
      .then(res => {
        const _res = res;
        console.log("_res", _res);
        data.value = _res.data.docs as any[];
        data.value.forEach((item, index) => {
          item.id = item._id;
          item.key = index;
          item.index = index + 1;
        });

        pagination.total = _res.data.page.totalCount;
        pagination.pageSize = _res.data.page.limit;
        pagination.currentPage = _res.data.page.currentPage;
      })
      .catch(err => {
        debugger;
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }

  watch(() => pagination.currentPage, onSearch);

  async function resetForm() {
    formRef.value?.resetFields();
    await onSearch();
  }

  onMounted(() => {
    void onSearch();
  });

  return {
    loading,
    params,
    pagination,
    data,
    resetForm,
    onSearch
  };
}

export function useStaticsTables(name) {
  const { data, loading, update, load } = useSystemConfig(name, {
    list: []
  });

  async function remove(id) {
    const index = data.value.list.findIndex(item => item.id === id);
    data.value.list.splice(index, 1);
    await update();
  }

  async function add(item) {
    item.id = +Date.now();
    item.createdAt = new Date();
    data.value.list.push(item);
    await update();
  }

  async function updateOne(item) {
    const index = data.value.list.findIndex(i => i.id === item.id);
    data.value.list.splice(index, 1, item);
    await update();
  }

  return {
    loading,
    load,
    data,
    remove,
    add,
    updateOne
  };
}
