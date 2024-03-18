import { nextTick, onMounted, ref } from "vue";
import { http } from "@/utils/http";

interface Permission {
  _id: string;
  name: string;
  icon: string;
  sort: number;
  path: string;
  children: Child[];
}

interface Child {
  _id: string;
  name: string;
  icon: string;
  sort: number;
  path: string;
  parentId: string;
}

export function usePermission() {
  const loading = ref<boolean>(false);
  const data = ref<Permission[]>([]);
  const allData = ref<Permission[]>([]);

  async function allList() {
    loading.value = true;
    http
      .get<any, Permission[]>("/sys-permissions/all")
      .then(res => {
        nextTick(() => {
          allData.value = res.data.map(item => {
            delete item.parentId;
            return item;
          });
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }

  async function onSearch() {
    await allList();
  }

  const load = (
    row: Permission,
    treeNode: unknown,
    resolve: (date: Permission[]) => void
  ) => {
    http
      .get<any, Permission[]>("/sys-permissions/tree", {
        params: {
          parentId: row._id
        }
      })
      .then(res => {
        resolve(res.data);
      });
  };

  onMounted(() => {
    void onSearch();
  });

  return {
    loading,
    data,
    onSearch,
    load,
    allData
  };
}
