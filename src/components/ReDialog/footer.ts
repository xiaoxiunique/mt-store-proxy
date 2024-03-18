import { h } from "vue";
import { ElButton, ElMessage, ElMessageBox } from "element-plus";
import { http } from "@/utils/http";
import { batchDownload } from "@/hooks/useDownload";

export const order = function ({ props }) {
  async function down() {
    const res: any = await http.post(
      "/order/download?id=" + props.formInline._id
    );

    await batchDownload(res.data.title, res.data.urls);
  }

  async function agree() {
    if (!props.formInline.official) {
      ElMessage({
        message: "请选择公证处",
        type: "error"
      });
      return;
    }

    if (!props.formInline.videoQR) {
      ElMessage({
        message: "请上传签署码",
        type: "error"
      });
      return;
    }

    await http.put(`/order/${props.formInline._id}`, {
      data: {
        ...props.formInline,
        status: 3
      }
    });
  }

  async function refuse() {
    ElMessageBox.prompt("请输入驳回原因", "Tip", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }).then(async ({ value }) => {
      await http.put(`/order/${props.formInline._id}`, {
        data: {
          ...props.formInline,
          status: -1,
          remark: value
        }
      });
      ElMessage({
        type: "success",
        message: `驳回成功`
      });
    });
  }

  const children = [];
  if (props.formInline.status === 0) {
    children.push(
      ...[
        h(
          ElButton,
          {
            onClick: async () => {
              await down();
            }
          },
          () => "下载资料"
        ),
        h(
          ElButton,
          {
            type: "success",
            onClick: async () => {
              await agree();
            }
          },
          () => "审核通过"
        ),
        h(
          ElButton,
          {
            type: "danger",
            onClick: async () => {
              await refuse();
            }
          },
          () => "驳回"
        )
      ]
    );
  }

  return h(
    "div",
    {
      class: "inline-block mr-4"
    },
    children
  );
};
