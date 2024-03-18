import { ref, watch } from "vue";
import { FormInstance } from "element-plus";
import { useRestAPI } from "@/hooks/useRestAPI";

export function useCommonEditConfig(props, emit, api) {
  const form = ref({} as any);
  const formRef = ref<FormInstance>(null);

  watch(
    () => props.data,
    val => {
      form.value = val as any;
    }
  );

  const { loading, create, update } = useRestAPI({
    api
  });

  function handleClose() {
    formRef.value.resetFields();
    emit("close");
  }

  function handleSubmit() {
    formRef.value.validate(async valid => {
      if (valid) {
        if (props.data.id) {
          update(form.value).then(() => {
            setTimeout(() => {
              handleClose();
              emit("submit");
            }, 200);
          });
        } else {
          create(form.value).then(() => {
            setTimeout(() => {
              handleClose();
              emit("submit");
            }, 200);
          });
        }
      }
    });
  }
  return {
    form,
    formRef,
    loading,
    handleClose,
    handleSubmit
  };
}
