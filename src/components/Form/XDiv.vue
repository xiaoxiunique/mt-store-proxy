<template>
  <div
    :class="['title-warp', `${model}-question`]"
    :style="{ width: `${width}px` }"
  >
    <div class="quill">
      <div class="q-container">
        <div
          :id="keyName"
          ref="editorRef"
          :tabindex="0"
          class="q-editor"
          :style="{ fontSize: `${fontSize}px !important` }"
          :contenteditable="model === 'edit'"
          @focus="handleFocus"
          @blur="handleTitleChange"
          v-html="title"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    title: {
      type: String,
      default: ""
    },
    fontSize: {
      type: [String, Number],
      default: 14
    },
    width: {
      type: [String, Number],
      default: ""
    },
    keyName: {
      type: String,
      default: ""
    },
    model: {
      type: String,
      default: "edit"
    }
  },
  setup(props, context) {
    const editorRef = ref();
    const handleTitleChange = e => {
      context.emit("update:title", e.target.innerHTML);
      window.removeEventListener("paste", pasteFn);
    };
    const handleFocus = () => {
      window.addEventListener("paste", pasteFn);
    };
    const pasteFn = e => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData(
        "text/plain"
      );
      const newNode = document.createElement("span");
      newNode.innerHTML = paste;
      window.getSelection().getRangeAt(0).insertNode(newNode);
    };
    return { editorRef, handleTitleChange, handleFocus };
  }
});
</script>
<style lang="scss" scoped>
.q-editor {
  box-sizing: border-box;
  line-height: 1.42;
  height: 100%;
  outline: none;
  overflow-y: auto;
  tab-size: 4;
  -moz-tab-size: 4;
  padding: 5px 8px;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  border: 1px solid transparent;
  span {
    font-size: 0 !important;
  }
}
.edit-question {
  .q-editor {
    &:focus {
      outline: 0px;
      border: 1px solid rgb(24, 144, 255) !important;
    }
    &:hover {
      border: 1px dashed #aaaaaa;
      transition: all 0.5s;
    }
  }
}
.title-warp {
  box-sizing: border-box;
  margin: 0px;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: "tnum";
  width: 100%;
  color: rgba(0, 0, 0, 0.65);
  border: 1px solid transparent;
  transition: all 0.3s ease 0s;
  .quill {
    text-align: center;
    .q-container {
      box-sizing: border-box;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 13px;
      height: 100%;
      margin: 0;
      position: relative;
    }
  }
}
</style>
