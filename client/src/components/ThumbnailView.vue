<template>
  <div :title="`第 ${pageNum} 页`">
    <div
      :class="`thumbnail ${pageNum === curPage ? 'selected' : ''}`"
      :id="`thumbnail-${this.pageNum}`"
      v-observe-visibility="{
        throttle: 300,
        callback: visibilityChanged,
        once: true,
      }"
      @click="onThumbnailClick"
    >
      <div
        class="thumbnailSelectionRing"
        style="width: 100px; height: 128px"
      ></div>
    </div>
  </div>
</template>

<script>
import eventsList from '../eventsList'

export default {
  props: {
    pageNum: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      default: '',
    },
    curPage: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    visibilityChanged(isVisible) {
      if (isVisible) {
        const thumbnailWrapper = document.querySelector(
          `#thumbnail-${this.pageNum}`
        )
        const imgWrapper = thumbnailWrapper.querySelector(
          '.thumbnailSelectionRing'
        )
        const imageUrl = `/api/renderPage?filePath=${this.url}&viewport=0.25&pageNum=${this.pageNum}`
        this.loadImageAsync(imageUrl)
          .then((img) => {
            imgWrapper.appendChild(img)
            thumbnailWrapper.setAttribute('data-loaded', 'true')
          })
          .catch(() => {
            this.onError = true
          })
      }
    },
    loadImageAsync(src) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = src
        image.className = 'thumbnailImage'
        image.style = 'width: 98px; height: 126px'
        image.setAttribute('aria-label', `页面 ${this.pageNum} 的缩略图`)
        image.onload = () => {
          resolve(image)
        }
        image.onerror = () => {
          reject()
        }
      })
    },
    onThumbnailClick() {
      this.$EventBus.$emit(eventsList.ON_PAGE_CHANGE, this.pageNum)
      this.$EventBus.$emit(eventsList.JUMP_PAGE_TO, this.pageNum)
    },
  },
}
</script>
