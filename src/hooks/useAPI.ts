import { useAxios } from "@vueuse/integrations/useAxios";
import { http } from "@/utils/http";
import { AxiosRequestConfig } from "axios";
import { onMounted } from "vue";

export function useAPI() {
  return useAxios(http.getIns());
}

export function useAPIIns<T>(config: AxiosRequestConfig) {
  const { execute, ...other } = useAxios<T, T>(config, http.getIns());
  onMounted(() => {
    void execute(config.url);
  });
  return { execute, ...other };
}
