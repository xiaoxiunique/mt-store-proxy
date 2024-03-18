<script setup lang="ts"></script>

<template>
  <webview
    id="xhs"
    class="w-full h-[440px]"
    src="https://e.waimai.meituan.com"
    useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    contextisolation="true"
    disablewebsecurity=""
    partition="test1"
    preload="file:///Users/atom.hu/workspace/外包/美团/electron-pure-admin/src/views/welcome/components/preload.js"
  />
</template>
