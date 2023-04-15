<template>
    <div class="pdf-preview">
      <vue-pdf-embed :source="state.source" :style="scale" class="vue-pdf-embed" :page="state.pageNum" />
    </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import { createLoadingTask } from "vue3-pdfjs/esm"; // 获得总页数

// const props = defineProps({
//     pdfUrl: {
//         type: String,
//         required: true
//     }
// })

const state = reactive({
    // source: props.pdfUrl, //预览pdf文件地址
    source: "https://virtual-experiment-system.oss-cn-shanghai.aliyuncs.com/13-04-2023/8e5fea8ae0584f038534fd2c8e0430db/2023SEME_Slides%20Lesson12%20Contract%20management.pdf",
    pageNum: 1, //当前页面
    scale: 1, // 缩放比例
    numPages: 0, // 总页数
});

onMounted(() => {
  const loadingTask = createLoadingTask(state.source);
      loadingTask.promise.then((pdf:{numPages: number}) => {
          state.numPages = pdf.numPages;
          console.log("页数为",state.numPages)
      });
});

</script>
<style lang="css" scoped>
.pdf-preview {
    position: relative;
    height: 100vh;
    padding: 20px 0;
    box-sizing: border-box;
    background: rgb(66, 66, 66);
}

.vue-pdf-embed {
    text-align: center;
    width: 515px;
    border: 1px solid #e5e5e5;
    margin: 0 auto;
    box-sizing: border-box;
}

</style>
