<template>
  <div id="app">
    <Toolbar
      ref="toolbar"
      :numPages="numPages"
      @toggleSecondaryToolbar="
        isSecondaryToolbarHidden = !isSecondaryToolbarHidden
      "
      @scaleChange="onScaleChange"
    ></Toolbar>
    <SecondaryToolbar :isHidden="isSecondaryToolbarHidden" />
    <ViewContainer
      :numPages="numPages"
      :pageSizeList="pageSizeList"
      :url="url"
      :viewport="viewport"
      v-if="toggle"
    ></ViewContainer>
    <div id="overlayContainer" :class="isOverlayHidden ? 'hidden' : ''">
      <MetaData :metaData="metaData" :numPages="numPages"></MetaData>
    </div>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar.vue'
import SecondaryToolbar from './components/SecondaryToolbar.vue'
import ViewContainer from './components/ViewContainer.vue'
import MetaData from './components/MetaData.vue'
import { getPDFMetadata, getPDFPageSize } from './api/index'
import eventsList from './eventsList'

export default {
  name: 'App',
  components: {
    Toolbar,
    SecondaryToolbar,
    MetaData,
    ViewContainer,
  },
  data() {
    return {
      numPages: 0,
      viewport: 1,
      url: './server/static/b85n.pdf',
      metaData: {},
      isSecondaryToolbarHidden: false,
      isOverlayHidden: true,
      pageSizeList: [],
      toggle: true,
    }
  },
  mounted() {
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
        const currentPageSize =
          this.pageSizeList[this.$refs.toolbar.curPage - 1]
        const buffer = 30
        if (e === 'page-fit') {
          const displayHeight =
            document.querySelector('#viewerContainer').clientHeight
          this.viewport = Number(
            ((displayHeight - buffer) / currentPageSize.viewBox[3]).toFixed(2)
          )
        }

        if (e === 'page-width') {
          const currentPageDiv =
            document.querySelectorAll('.spread')[this.$refs.toolbar.curPage - 1]
          this.viewport = Number(
            (
              (currentPageDiv.clientWidth - buffer) /
              currentPageSize.viewBox[2]
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
  },
}
</script>
