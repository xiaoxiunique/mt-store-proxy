import { h, ref } from "vue";
import { addDialog } from "@/components/ReDialog/index";
import { message } from "@/utils/message";
import { http } from "@/utils/http";
import editForm from "../views/basic/page/common-form.vue";

export function useAddDialog(symbol: string, fn: Function) {
  const formRef = ref();
  function openDialog(title = "新增", row: any) {
    addDialog({
      title: `${title}`,
      props: {
        formInline: row || {}
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, {
          ref: formRef,
          formInline: row,
          symbol: symbol
        }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = { ...options.props.formInline };

        function chores() {
          message(`操作成功`, {
            type: "success"
          });
          done(); // 关闭弹框
        }

        FormRef.validate(async valid => {
          if (valid) {
            await http.post(`/${symbol}`, { data: { ...curData } });
            await new Promise(resolve => setTimeout(resolve, 1000));
            fn && fn();
            chores();
          }
        });
      }
    });
  }

  return {
    openDialog
  };
}
