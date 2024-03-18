import { ElDescriptions, ElDescriptionsItem } from "element-plus";
import { defineComponent, h } from "vue";

// 封装element-plus的el-col组件
export default defineComponent({
  name: "Labels",
  props: {
    options: {
      type: Array,
      default: () => []
    },
    prop: {
      type: String,
      default: "name"
    },
    label: {
      type: String,
      default: "value"
    }
  },
  render() {
    const options = this.options;
    const items = options.map((item: any) => {
      return h(
        ElDescriptionsItem,
        {
          label: item[this.prop]
        },
        { default: () => item[this.label] }
      );
    });

    return h(
      ElDescriptions,
      {
        column: 1,
        border: true
      },
      items
    );
  }
});
