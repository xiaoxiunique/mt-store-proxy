import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useRouter, useRoute } from "vue-router";

type UseDetailParams = {
  path: string;
  name: string;
  query: string;
  params: string;
  meta: string;
};

export function useTabs(body: UseDetailParams) {
  const router = useRouter();

  function goto() {
    // 保存信息到标签页
    useMultiTagsStoreHook().handleTags("push", body);
    // 路由跳转
    void router.push({ name: body.name, query: body.query });
  }

  return {
    goto
  };
}
