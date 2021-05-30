<template>
  <div id="viewerContainer">
    <div id="viewer" class="pdfViewer" v-if="numPages">
      <PageView v-for="i in numPages" :key="i" :pageNum="i" />
    </div>
  </div>
</template>

<script>
import PageView from './PageView.vue'

export default {
  components: { PageView },
  props: {
    numPages: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    this.lastTime = new Date()
    this.timer = null
    this.$EventBus.$on('toScrollPage', this.scrollPage)
    document
      .querySelector('#viewerContainer')
      .addEventListener('scroll', this.onPageScroll)
  },
  methods: {
    scrollPage(distance) {
      document.querySelector('#viewerContainer').scrollTo(0, distance)
    },
    onPageScroll() {
      const startTime = new Date()
      const remaining = 500 - (startTime - this.lastTime)
      clearTimeout(this.timer)
      if (startTime - this.lastTime > 500) {
        this.lastTime = startTime
        this.getCurPage()
      } else {
        // 最后一次也执行
        this.timer = setTimeout(() => {
          this.getCurPage()
        }, remaining)
      }
    },
    getCurPage() {
      // 获取基础值
      const base =
        (document.querySelector('#viewerContainer').scrollTop -
          document.querySelector(`#page-1`).offsetTop) /
          document.querySelector(`#page-1`).clientHeight +
        1
      this.$EventBus.$emit('onPageChange', Math.round(base))
    },
  },
}
</script>
