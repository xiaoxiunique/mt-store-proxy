import { onMounted, ref } from "vue";
import OSS from "ali-oss";
import { http } from "@/utils/http";

export function useOSS() {
  const STSToken = ref<any>({});
  const fileRef = ref<any>();
  const file = ref(null);
  const loading = ref(false);
  const url = ref("");
  const completed = ref(false);

  async function getSTSToken() {
    const r = await http.get("/oss/token");
    return r && r.data;
  }

  async function uploadFile({ file }) {
    if (!STSToken.value) {
      STSToken.value = await getSTSToken();
    }
    if (!file) {
      alert("no file");
      return;
    }
    loading.value = true;

    const {
      AccessKeyId: accessKeyId,
      AccessKeySecret: accessKeySecret,
      SecurityToken: securityToken,
      bucket = "bsc-test2022",
      region = "oss-cn-hangzhou"
    } = STSToken.value;
    const client = new OSS({
      accessKeyId,
      accessKeySecret,
      stsToken: securityToken,
      bucket,
      region
    });

    // @ts-ignore
    const name = "message/" + file.name;
    const result = await client.put(name, file);
    url.value = result.url;
    loading.value = false;
    completed.value = true;
  }

  onMounted(async () => {
    STSToken.value = await getSTSToken();
  });

  return {
    uploadFile,
    loading,
    start: uploadFile,
    url,
    file,
    fileRef,
    completed
  };
}
