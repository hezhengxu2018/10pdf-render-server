<template>
  <div id="viewerContainer">
    <div id="viewer" class="pdfViewer" v-if="numPages">
      <PageView v-for="i in numPages" :key="i" :pageNum="i" />
    </div>
  </div>
</template>

<script>
import PageView from './PageView.vue'
import eventsList from '../eventsList'

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
    this.$EventBus.$on(eventsList.TO_SCROLL_PAGE, this.scrollPage)
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
      const delay = 200
      const remaining = delay - (startTime - this.lastTime)
      clearTimeout(this.timer)
      if (startTime - this.lastTime > delay) {
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
      const base = Math.round(
        (document.querySelector('#viewerContainer').scrollTop -
          document.querySelector(`#page-1`).offsetTop) /
          document.querySelector(`#page-1`).clientHeight +
          1
      )
      console.log(
        document.querySelector('#viewerContainer').scrollTop -
          document.querySelector(`#page-${base}`).offsetTop
      )
      this.$EventBus.$emit(eventsList.ON_PAGE_CHANGE, base)
    },
  },
}
</script>
