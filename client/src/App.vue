<template>
  <div id="app">
    <div id="overlayContainer" :class="isOverlayHidden ? 'hidden' : ''">
      <DocumentProperties
        :metaData="metaData"
        :numPages="numPages"
        :currentPageSize="currentPageSize"
        @toggleDocumentProperties="onToggleDocumentProperties"
      ></DocumentProperties>
    </div>
    <Toolbar
      :numPages="numPages"
      :curPage="curPage"
      @toggleSecondaryToolbar="onToggleSecondaryToolbar"
      @scaleChange="onScaleChange"
      @jumpToPage="jumpToPage"
    ></Toolbar>
    <SecondaryToolbar
      :isHidden="isSecondaryToolbarHidden"
      @toggleSecondaryToolbar="onToggleSecondaryToolbar"
      @toggleDocumentProperties="onToggleDocumentProperties"
    />
    <ViewContainer
      :numPages="numPages"
      :pageSizeList="pageSizeList"
      :url="url"
      :viewport="viewport"
      v-if="toggle"
    ></ViewContainer>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar.vue'
import SecondaryToolbar from './components/SecondaryToolbar.vue'
import ViewContainer from './components/ViewContainer.vue'
import DocumentProperties from './components/DocumentProperties.vue'
import { getPDFMetadata, getPDFPageSize } from './api/index'
import eventsList from './eventsList'

export default {
  name: 'App',
  components: {
    Toolbar,
    SecondaryToolbar,
    DocumentProperties,
    ViewContainer,
  },
  data() {
    return {
      numPages: 0,
      viewport: 1,
      url: './server/static/b85n.pdf',
      curPage: 1,
      metaData: {},
      isSecondaryToolbarHidden: true,
      isOverlayHidden: true,
      pageSizeList: [],
      toggle: true,
    }
  },
  computed: {
    currentPageSize() {
      return this.pageSizeList[this.curPage - 1]
    },
  },
  mounted() {
    // register the Subscribe
    this.$EventBus.$on(eventsList.ON_PAGE_CHANGE, this.onPageChange)
    getPDFMetadata(this.url, this.viewport).then((res) => {
      const { numPages } = res
      this.metaData = res
      this.numPages = Number(numPages)
    })
    getPDFPageSize(this.url, this.viewport).then((res) => {
      this.pageSizeList = res
    })
  },
  methods: {
    onScaleChange(e) {
      if (Number.isNaN(Number(e))) {
        const buffer = 30
        if (e === 'page-fit') {
          const displayHeight =
            document.querySelector('#viewerContainer').clientHeight
          this.viewport = Number(
            (
              (displayHeight - buffer) /
              this.currentPageSize.viewBox[3]
            ).toFixed(2)
          )
        }

        if (e === 'page-width') {
          const currentPageDiv =
            document.querySelectorAll('.spread')[this.curPage - 1]
          this.viewport = Number(
            (
              (currentPageDiv.clientWidth - buffer) /
              this.currentPageSize.viewBox[2]
            ).toFixed(2)
          )
        }
      } else {
        this.viewport = Number(e)
      }
      this.toggle = false
      getPDFPageSize(this.url, this.viewport).then((res) => {
        this.pageSizeList = res
        this.toggle = true
        this.$nextTick().then(() => {
          const pageDOM = document.querySelector(
            `#page-${this.$refs.toolbar.curPage}`
          )
          this.$EventBus.$emit(eventsList.TO_SCROLL_PAGE, pageDOM.offsetTop)
        })
      })
    },
    onToggleSecondaryToolbar() {
      this.isSecondaryToolbarHidden = !this.isSecondaryToolbarHidden
    },
    onToggleDocumentProperties() {
      this.isOverlayHidden = !this.isOverlayHidden
      this.isSecondaryToolbarHidden = true
    },
    onPageChange(value) {
      this.curPage = value
    },
    jumpToPage(value) {
      if (value > this.numPages) {
        this.curPage = this.numPages
      } else if (value < 1) {
        this.curPage = 1
      } else {
        this.curPage = parseInt(value, 10)
      }
      const pageDOM = document.querySelector(`#page-${this.curPage}`)
      this.$EventBus.$emit(eventsList.TO_SCROLL_PAGE, pageDOM.offsetTop)
    },
  },
}
</script>
