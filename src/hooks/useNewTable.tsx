import {
  addDialog,
  ButtonProps,
  closeDialog,
  DialogOptions
} from "@/components/ReDialog";
import { computed, h, onMounted, reactive, ref, watch } from "vue";
import { message } from "@/utils/message";
import { http } from "@/utils/http";
import { PaginationProps } from "@pureadmin/table";
import { useModel } from "@/hooks/useModelConfig";
import JsFileDownloader from "js-file-downloader";
import { formatToken, getToken } from "@/utils/auth";
import { isFunction } from "@pureadmin/utils";
import { batchDownload } from "@/hooks/useDownload";
import { ElMessage, ElMessageBox } from "element-plus";

export function useTable(symbol: string, editForm: any) {
  const form = ref({});
  const { currentModel } = useModel(symbol);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 15,
    currentPage: 1,
    background: true
  });
  const tableConfig = ref({
    fields: []
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const computedRules = computed(() => {
    return currentModel.value?.fields.reduce((acc, cur) => {
      if (cur.required) {
        acc[cur.prop] = [
          {
            required: true,
            message: `请输入${cur.label}`,
            trigger: "blur"
          }
        ];
      }
      return acc;
    }, {});
  });

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm() {
    form.value = {};
    pagination.currentPage = 1;
    onSearch();
  }

  async function getList() {
    const r = await http.get(`/${symbol}?_sort=createdAt:desc`, {
      params: {
        ...form.value,
        _start: pagination.currentPage - 1,
        _limit: pagination.pageSize
      }
    });
    pagination.total = r.data.totalDocs;
    return {
      data: r.data.docs || []
    };
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getList();
    dataList.value = data;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  watch(() => pagination.currentPage, onSearch);
  // 数据导出
  async function onExport() {
    loading.value = true;
    await new JsFileDownloader({
      url: `https://www.fuzhengyun.com/api/v1/${symbol}/data/export`,
      filename: `${currentModel.value.label}.xlsx`,
      headers: [
        {
          name: "Authorization",
          value: formatToken(getToken().accessToken)
        }
      ]
    });
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function initFormParams() {
    return currentModel.value?.fields.reduce((acc, cur) => {
      acc[cur.prop] = cur.default;

      if (cur.dataType === "Date") {
        acc[cur.prop] = new Date();
      }

      if (cur.dataType === "Number") {
        acc[cur.prop] = 0;
      }

      return acc;
    }, {});
  }

  function openDialog(title = "新增", row: any, dialogOption?: DialogOptions) {
    const initParams = initFormParams();

    let defaultFooterBtn: Array<ButtonProps> = [
      {
        label: "取消",
        text: true,
        bg: true,
        btnClick: ({ dialog: { options, index } }) => {
          const done = () => closeDialog(options, index, { command: "cancel" });
          if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
            options.beforeCancel(done, { options, index });
          } else {
            done();
          }
        }
      },
      {
        label: "确定",
        type: "primary",
        text: true,
        bg: true,
        btnClick: ({ dialog: { options, index } }) => {
          const done = () => closeDialog(options, index, { command: "sure" });
          if (options?.beforeSure && isFunction(options?.beforeSure)) {
            options.beforeSure(done, { options, index });
          } else {
            done();
          }
        }
      }
    ] as Array<ButtonProps>;

    async function agree(props: any) {
      if (!props.formInline.official) {
        ElMessage({
          message: "请选择公证处",
          type: "error"
        });
        return false;
      }

      if (!props.formInline.videoQR) {
        ElMessage({
          message: "请上传签署码",
          type: "error"
        });

        // 获取元素
        const element = document.getElementById("uploadVideoQR");
        if (element) {
          // 滚动到元素的位置
          element.scrollIntoView({ behavior: "smooth" });

          // 设置元素的背景颜色
          element.style.backgroundColor = "yellow";

          // 在一段时间后恢复元素的背景颜色
          setTimeout(() => {
            element.style.backgroundColor = "";
          }, 500);

          // 再次设置元素的背景颜色
          setTimeout(() => {
            element.style.backgroundColor = "yellow";
          }, 1000);

          // 再次恢复元素的背景颜色
          setTimeout(() => {
            element.style.backgroundColor = "";
          }, 1500);
        }

        return false;
      }

      await http.put(`/order/${props.formInline._id}`, {
        data: {
          ...props.formInline,
          status: 3
        }
      });
      return true;
    }

    if (currentModel.value.key === "Order") {
      const orderStatus = {
        PRE_PROCESS: 0,
        REJECTED: -1,
        ACCEPTED: 1,
        SCAN_SIGN_CODE: 3,
        PROCESSING_WAIT_FOR_VIDEO_CODE: 6,
        SCAN_VIDEO_CODE: 7,
        PROCESSING_WAIT_FOR_NOTARIZATION_FILE: 4,
        DOWNLOAD_MATERIALS: 5
      };

      const prepare = [
        {
          label: "下载资料",
          type: "primary",
          async btnClick({ dialog }) {
            const orderId = dialog.options.props.formInline._id;
            const res: any = await http.post(`/order/download?id=${orderId}`);
            await batchDownload(res.data.title, res.data.urls);
          },
          status: orderStatus.PRE_PROCESS
        },
        {
          label: "资料审核通过，上传签署码",
          type: "success",
          async btnClick({ dialog }) {
            const err = await agree(dialog.options.props);
            if (!err) return;
            closeDialog(dialog.options, dialog.index, { command: "sure" });
          },
          status: orderStatus.PRE_PROCESS
        },
        {
          label: "修改资料",
          async btnClick({ dialog: { options, index } }) {
            const done = () => closeDialog(options, index, { command: "sure" });
            if (options?.beforeSure && isFunction(options?.beforeSure)) {
              options.beforeSure(done, { options, index });
            } else {
              done();
            }
          },
          status: orderStatus.PRE_PROCESS
        },
        {
          label: "签署码审核通过，上传视频码",
          type: "primary",
          bg: true,
          btnClick: ({ dialog: { options, index } }) => {
            if (!options.props.formInline.videoCert) {
              ElMessage({
                message: "请上传视频码",
                type: "error"
              });

              // 获取元素
              const element = document.getElementById("uploadVideoCertQR");
              if (element) {
                // 设置元素的背景颜色
                element.style.backgroundColor = "#fcfd5c";

                // 在一段时间后恢复元素的背景颜色
                setTimeout(() => {
                  element.style.backgroundColor = "";
                }, 500);

                // 再次设置元素的背景颜色
                setTimeout(() => {
                  element.style.backgroundColor = "#fcfd5c";
                }, 1000);

                // 再次恢复元素的背景颜色
                setTimeout(() => {
                  element.style.backgroundColor = "";
                }, 1500);
              }

              return false;
            }

            const done = () => closeDialog(options, index, { command: "sure" });
            if (options?.beforeSure && isFunction(options?.beforeSure)) {
              options.beforeSure(done, { options, index });
            } else {
              done();
            }

            ElMessage({
              message: "视频码上传成功",
              type: "success"
            });
          },
          //@ts-ignore
          status: orderStatus.PROCESSING_WAIT_FOR_VIDEO_CODE
        },
        {
          label: "上传证书",
          type: "primary",
          bg: true,
          btnClick: ({ dialog: { options, index } }) => {
            if (!options.props.formInline.certFile) {
              ElMessage({
                message: "请上传公证书",
                type: "error"
              });

              // 获取元素
              const element = document.getElementById("uploadCertFile");
              if (element) {
                // 设置元素的背景颜色
                element.style.backgroundColor = "#fcfd5c";

                // 在一段时间后恢复元素的背景颜色
                setTimeout(() => {
                  element.style.backgroundColor = "";
                }, 500);

                // 再次设置元素的背景颜色
                setTimeout(() => {
                  element.style.backgroundColor = "#fcfd5c";
                }, 1000);

                // 再次恢复元素的背景颜色
                setTimeout(() => {
                  element.style.backgroundColor = "";
                }, 1500);
              }

              return false;
            }

            const done = () => closeDialog(options, index, { command: "sure" });
            if (options?.beforeSure && isFunction(options?.beforeSure)) {
              options.beforeSure(done, { options, index });
            } else {
              done();
            }

            ElMessage({
              message: "公证书上传完成",
              type: "success"
            });
          },
          status: orderStatus.PROCESSING_WAIT_FOR_NOTARIZATION_FILE
        },
        {
          label: "等待用户认证",
          disabled: true,
          status: orderStatus.SCAN_SIGN_CODE
        },
        {
          label: "等待视频认证",
          disabled: true,
          status: orderStatus.SCAN_VIDEO_CODE
        },
        {
          label: "公证完成",
          disabled: true,
          status: orderStatus.DOWNLOAD_MATERIALS
        }
      ] as Array<ButtonProps>;

      // @ts-ignore
      defaultFooterBtn = prepare.filter(item => item.status === row.status);
    }

    addDialog({
      ...dialogOption,
      title: `${title}`,
      props: {
        formInline: row || initParams
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      footerButtons: defaultFooterBtn,
      contentRenderer: () =>
        h(editForm, {
          ref: formRef,
          formInline: row,
          fields: currentModel.value?.fields,
          formRules: computedRules.value
        }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = { ...options.props.formInline };

        function chores() {
          message(`操作成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              try {
                await http.post(`/${symbol}`, { data: { ...curData } });
                // 实际开发先调用新增接口，再进行下面操作
                chores();
              } catch (e) {
                message(e.response.data.message || e.message, {
                  type: "error"
                });
              }
            } else {
              try {
                await http.put(`/${symbol}/${curData._id}`, {
                  data: { ...curData }
                });
                // 实际开发先调用编辑接口，再进行下面操作
                chores();
              } catch (e) {
                message(e.response.data.message || e.message, {
                  type: "error"
                });
              }
            }
          }
        });
      }
    });
  }

  async function handleDelete(row) {
    await http.delete(`/${symbol}/${row._id}`);
    message(`删除成功`, { type: "success" });
    onSearch();
  }

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    tableConfig,
    currentModel,
    fields: computed(() => currentModel.value?.fields),
    // 分页
    pagination,
    dataList,
    /** 搜索 */
    onSearch,
    onExport,
    /** 重置 */
    resetForm,
    /** 新增、编辑部门 */
    openDialog,
    /** 删除部门 */
    handleDelete,
    handleSelectionChange
  };
}
