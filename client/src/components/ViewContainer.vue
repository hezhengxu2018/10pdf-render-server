<template>
  <div id="viewerContainer">
    <div id="viewer" class="pdfViewer" v-if="numPages">
      <PageView v-for="i in numPages" :key="i" :pageNum=i />
    </div>
  </div>
</template>

<script>
import PageView from "./PageView.vue";

export default {
  components: { PageView },
  props: {
    numPages: {
      type: Number,
      default: 0,
    }
  },
};
</script>
