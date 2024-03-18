import { computed, h, ref } from "vue";
import { useInitData, useModel } from "@/hooks/useModelConfig";
import dayjs from "dayjs";
import TFile from "@/components/Fields/TFile.vue";
import TMixed from "@/components/Fields/TMixed.vue";
import TOptions from "@/components/Fields/TOptions.vue";
import TSwitch from "@/components/Fields/TSwitch.vue";
import { useRoute } from "vue-router";

export function useFields(symbol) {
  const route = useRoute();
  const { currentModel } = useModel(symbol);

  const appendList = ref([]);
  if (!symbol) {
    symbol = route.query.entity as any;
  }

  const computedColumns = computed(() => {
    const showFields = currentModel.value?.fields.filter(
      item => item.tableShow !== false
    );

    return [
      {
        label: "#",
        type: "index"
      },
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...showFields.map((item: any) => {
        if (item.dataType === "Date") {
          return {
            ...item,
            formatter: (row, column, cellValue) => {
              return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
            }
          };
        }
        if (item.dataType === "Upload") {
          return {
            ...item,
            formatter: (row, column, cellValue) => {
              return h(TFile, {
                files: cellValue
              });
            }
          };
        }

        if (item.dataType === "Mixed") {
          return {
            ...item,
            formatter: (row, column, cellValue) => {
              if (!cellValue) {
                return "-";
              }

              return h(TMixed, {
                data: row[column["property"] + "Extend"],
                "class-name": "bg-red-300"
              });
            }
          };
        }

        if (item.dataType === "Boolean") {
          return {
            ...item,
            formatter: (row, column, cellValue) => {
              return h(TSwitch, {
                row: row,
                prop: column.property
              });
            }
          };
        }

        if (item.dataType === "Number") {
          return {
            ...item,
            formatter: (row, column, cellValue) => {
              return Number(cellValue).toFixed(2)
            }
          };
        }

        if (item.dataType === "Image") {
          return {
            ...item,
            formatter: (row, column, cellValue) => {
              if (!row[column.property]) {
                return (
                  <div class="w-full h-full flex justify-center items-center">
                    <svg
                      style={{ width: "50px", height: "50px" }}
                      t="1691343480803"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2426"
                      width="200"
                      height="200"
                    >
                      <path
                        d="M232.107 19.505h90.892c14.19 0 24.283 7.314 30.525 19.505a34.23 34.23 0 0 1-0.975 34.864 34.475 34.475 0 0 1-31.696 18.042c-46.275-0.195-92.745-0.195-139.069 0-19.7 0-38.522 4.047-55.588 14.287-35.304 21.456-53.882 53.443-54.467 95.232-0.537 37.742-0.195 75.484-0.195 113.226 0 7.948-0.976 15.506-5.315 22.674a35.596 35.596 0 0 1-39.985 16.238A35.889 35.889 0 0 1 0.195 319.098c0-49.542-0.536-99.28 0.195-148.821 0.585-50.323 21.65-90.6 60.709-120.93 22.04-17.067 47.055-26.575 74.41-29.452 2.097-0.39 4.535-0.39 7.022-0.39h89.576z m526.384 0h-90.94c-14.239 0-24.333 7.314-30.574 19.505a34.23 34.23 0 0 0 0.975 34.864c6.973 11.996 17.603 18.042 31.695 18.042 46.275-0.195 92.745-0.195 139.07 0 19.699 0 38.521 4.047 55.588 14.287 35.303 21.456 53.882 53.443 54.467 95.232 0.536 37.742 0.195 75.484 0.195 113.226 0 7.948 0.975 15.506 5.315 22.674a35.596 35.596 0 0 0 39.985 16.238 35.889 35.889 0 0 0 26.039-34.475c0-49.542 0.585-99.28-0.196-148.821-0.585-50.323-21.65-90.6-60.708-120.93a144.14 144.14 0 0 0-74.41-29.452 95.28 95.28 0 0 0-7.169-0.39h-89.332zM232.107 996.937h90.892c14.19 0 24.283-7.314 30.525-19.505a34.23 34.23 0 0 0-0.975-34.864 34.475 34.475 0 0 0-31.696-18.042c-46.275 0.195-92.745 0.195-139.069 0-19.7 0-38.522-4.048-55.588-14.288-35.304-21.455-53.882-53.443-54.467-95.232-0.537-37.741-0.195-75.483-0.195-113.225a41.545 41.545 0 0 0-5.315-22.674 35.596 35.596 0 0 0-39.985-16.238A35.889 35.889 0 0 0 0.195 697.295c0 49.591-0.536 99.328 0.195 148.87 0.585 50.323 21.65 90.6 60.709 120.93a144.14 144.14 0 0 0 81.627 29.842h89.38z m526.384 0h-90.94c-14.239 0-24.333-7.314-30.574-19.505a34.23 34.23 0 0 1 0.975-34.864 34.475 34.475 0 0 1 31.695-18.042c46.275 0.195 92.745 0.195 139.07 0 19.699 0 38.521-4.048 55.588-14.288 35.303-21.455 53.882-53.443 54.467-95.232 0.536-37.741 0.195-75.483 0.195-113.225 0-7.948 0.975-15.506 5.315-22.674a35.596 35.596 0 0 1 39.985-16.238 35.889 35.889 0 0 1 26.039 34.426c0 49.591 0.585 99.328-0.196 148.87-0.585 50.323-21.65 90.6-60.708 120.93a144.14 144.14 0 0 1-81.628 29.842h-89.331zM202.313 700.611c5.657 14.531 17.262 23.016 30.915 23.016h520.875c9.265 0 17.457-3.901 24.088-11.606 6.632-7.753 13.507-17.213 13.507-28.282V345.088c0-29.403-11.995-44.13-25.648-49.932-13.654-5.998-28.087-1.512-37.547 11.215l-181.59 246.004a30.769 30.769 0 0 1-25.648 13.75 30.769 30.769 0 0 1-25.6-13.75l-80.847-109.568a31.354 31.354 0 0 0-25.844-13.751c-10.24 0-18.92 4.876-25.747 13.946l-155.794 215.04a43.74 43.74 0 0 0-5.12 42.569z"
                        p-id="2427"
                        fill="#cdcdcd"
                      ></path>
                    </svg>
                  </div>
                );
              }

              return (
                <div class="w-full h-full flex justify-center items-center">
                  <img
                    src={row[column.property]}
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              );
            }
          };
        }

        if (item.dataType === "Options") {
          return {
            ...item,
            formatter: (row, column, cellValue) => {
              return item.options.find(
                (option: any) => option.value === cellValue
              )?.label;
            }
          };
        }

        if (item.dataType !== "DataSource") {
          return item;
        }
        return {
          ...item,
          prop: `${item.prop}Name`
        };
      }),
      ...appendList.value,
      {
        label: "创建时间",
        prop: "createdAt",
        formatter: (row, column, cellValue) => {
          return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      {
        label: "操作",
        fixed: "right",
        width: 160,
        slot: "operation"
      }
    ];
  });

  return {
    columns: computedColumns,
    enable: computed(() => {
      return currentModel.value?.fields.length > 0;
    })
  };
}
