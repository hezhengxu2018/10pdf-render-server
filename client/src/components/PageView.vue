<template>
  <div
    class="spread"
    :id="`page-${pageNum}`"
    v-if="pageNum"
    v-observe-visibility="{
      throttle: 300,
      callback: visibilityChanged,
      once: true,
    }"
  >
    <div
      class="page"
      :aria-label="`第 ${pageNum} 页`"
      :style="`height:${pageSize.height}px; width:${pageSize.width}px;`"
    >
      <div class="loadingContainer" v-if="isLoading">
        <img
          class="loadingSpinner"
          src="/img/gooey-ring-spinner.svg"
          v-if="!onError"
        />
        <p v-else class="onErrorMessage">
          页面加载失败，
          <span @click="onRetryClick">点击重试</span>
        </p>
      </div>
      <div class="canvasWrapper" v-show="!isLoading"></div>
      <div class="textLayer">
        <div class="endOfContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { TextLayerBuilder } from 'pdfjs-dist/es5/web/pdf_viewer'
import { getPDFPageText } from '../api/index'

export default {
  props: {
    pageNum: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Object,
      default: () => ({ width: 0, height: 0 }),
    },
    url: {
      type: String,
      default: '',
    },
    viewport: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    viewport: {
      handler() {
        this.visibilityChanged(true)
      },
    },
  },
  data() {
    return {
      isLoading: true,
      onError: false,
    }
  },
  methods: {
    visibilityChanged(isVisible) {
      if (isVisible) {
        const pageWrapper = document.querySelector(`#page-${this.pageNum}`)
        const imgWrapper = pageWrapper.querySelector('.canvasWrapper')
        const imageUrl = `/api/renderPage?filePath=${this.url}&viewport=${this.viewport}&pageNum=${this.pageNum}`
        if (imgWrapper.querySelector('img')) {
          console.log('已经有图了')
        }
        this.loadImageAsync(imageUrl)
          .then((img) => {
            imgWrapper.appendChild(img)
            this.isLoading = false
          })
          .catch(() => {
            this.onError = true
          })
        getPDFPageText(this.url, this.pageNum, this.viewport).then((res) => {
          const textLayerDiv = pageWrapper.querySelector('.textLayer')
          textLayerDiv.setAttribute(
            'style',
            `width: ${res.viewport.width}px; margin: 0 auto;`
          )
          const textLayer = new TextLayerBuilder({
            textLayerDiv,
            pageIndex: this.pageNum - 1,
            viewport: res.viewport,
          })
          textLayer.setTextContent(res.textContent)
          textLayer.render()
        })
      }
    },
    loadImageAsync(src) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = src
        image.onload = () => {
          resolve(image)
        }
        image.onerror = () => {
          reject()
        }
      })
    },
    onRetryClick() {
      this.onError = false
      this.isLoading = true
      this.visibilityChanged(true)
    },
  },
}
</script>

<style>
.loadingContainer {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
}
.loadingSpinner {
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}
.onErrorMessage {
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}
.onErrorMessage span {
  color: rgb(26, 105, 251);
  cursor: pointer;
}
</style>
