<script setup lang="ts">
import { useGlobal } from "@pureadmin/utils";
import { h, computed, Transition, defineComponent } from "vue";
import { usePermissionStoreHook } from "@/store/modules/permission";

const props = defineProps({
  fixedHeader: Boolean
});

const { $storage, $config } = useGlobal<GlobalPropertiesApi>();

const keepAlive = computed(() => {
  return $config?.KeepAlive;
});

const transitions = computed(() => {
  return route => {
    return route.meta.transition;
  };
});

const hideTabs = computed(() => {
  return $storage?.configure.hideTabs;
});

const layout = computed(() => {
  return $storage?.layout.layout !== "mix";
});

const getSectionStyle = computed(() => {
  return [
    hideTabs.value && layout ? "padding-top: 48px;" : "",
    !hideTabs.value && layout ? "padding-top: 85px;" : "",
    hideTabs.value && !layout.value ? "padding-top: 80px" : "",
    !hideTabs.value && !layout.value ? "padding-top: 90px;" : "",
    props.fixedHeader ? "" : "padding-top: 0;"
  ];
});

const transitionMain = defineComponent({
  render() {
    return h(
      Transition,
      {
        // name:
        //   transitions.value(this.route) &&
        //   this.route.meta.transition.enterTransition
        //     ? "pure-classes-transition"
        //     : (transitions.value(this.route) &&
        //         this.route.meta.transition.name) ||
        //       "fade-transform",
        // enterActiveClass:
        //   transitions.value(this.route) &&
        //   `animate__animated ${this.route.meta.transition.enterTransition}`,
        // leaveActiveClass:
        //   transitions.value(this.route) &&
        //   `animate__animated ${this.route.meta.transition.leaveTransition}`,
        // mode: "out-in",
        // appear: true
      },
      {
        default: () => [this.$slots.default()]
      }
    );
  },
  props: {
    route: {
      type: undefined,
      required: true
    }
  }
});
</script>

<template>
  <section
    :class="[props.fixedHeader ? 'app-main' : 'app-main-nofixed-header']"
    :style="getSectionStyle"
  >
    <router-view>
      <template #default="{ Component, route }">
        <el-scrollbar>
          <keep-alive
            v-if="keepAlive"
            :include="usePermissionStoreHook().cachePageList"
          >
            <component
              :is="Component"
              :key="route.fullPath"
              class="main-content"
            />
          </keep-alive>
          <component
            v-else
            :is="Component"
            :key="route.fullPath"
            class="main-content"
          />
        </el-scrollbar>
      </template>
    </router-view>
  </section>
</template>

<style scoped>
.app-main {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
}

.app-main-nofixed-header {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.main-content {
  width: 100%;
  padding: 0 24px;
  height: calc(100vh - 190px);
}
</style>
