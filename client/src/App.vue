<template>
  <div id="app" :class="isSidebarHidden ? '' : 'sidebarOpen'">
    <div id="overlayContainer" v-if="!isDocumentPropertiesHidden">
      <DocumentProperties
        :metaData="metaData"
        :numPages="numPages"
        :url="url"
        :currentPageSize="currentPageSize"
        @toggleDocumentProperties="onToggleDocumentProperties"
      ></DocumentProperties>
    </div>
    <div id="overlayContainer" v-if="!isOpenPDFHidden">
      <OpenPDF
        :url="url"
        @toggleOpenPDF="onToggleOpenPDF"
        @onURLChange="onURLChange"
      ></OpenPDF>
    </div>
    <Toolbar
      :numPages="numPages"
      :curPage="curPage"
      :isSidebarHidden="isSidebarHidden"
      @toggleSecondaryToolbar="onToggleSecondaryToolbar"
      @toggleOpenPDF="onToggleOpenPDF"
      @toggleSidebar="onToggleSidebar"
      @scaleChange="onScaleChange"
      @download="onDownloadClick"
    ></Toolbar>
    <Sidebar :numPages="numPages" :curPage="curPage" :url="url" />
    <SecondaryToolbar
      :isHidden="isSecondaryToolbarHidden"
      :isGrab="isGrab"
      @toggleSecondaryToolbar="onToggleSecondaryToolbar"
      @toggleDocumentProperties="onToggleDocumentProperties"
      @toggleHandTool="onToggleHandTool"
    />
    <ViewContainer
      :numPages="numPages"
      :pageSizeList="pageSizeList"
      :isGrab="isGrab"
      :url="url"
      :viewport="viewport"
      v-if="toggle"
    ></ViewContainer>
  </div>
</template>

<script>
import axios from 'axios'
import Toolbar from './components/Toolbar.vue'
import SecondaryToolbar from './components/SecondaryToolbar.vue'
import ViewContainer from './components/ViewContainer.vue'
import DocumentProperties from './components/DocumentProperties.vue'
import OpenPDF from './components/OpenPDF.vue'
import Sidebar from './components/Sidebar.vue'
import { getPDFMetadata, getPDFPageSize } from './api/index'
import eventsList from './eventsList'
import GrabToPan from './utils/grab_to_pan'

export default {
  name: 'App',
  components: {
    Toolbar,
    Sidebar,
    SecondaryToolbar,
    DocumentProperties,
    OpenPDF,
    ViewContainer,
  },
  data() {
    return {
      numPages: 0,
      viewport: 1,
      url: 'b85n.pdf',
      curPage: 1,
      metaData: {},
      isSecondaryToolbarHidden: true,
      isDocumentPropertiesHidden: true,
      isOpenPDFHidden: true,
      isSidebarHidden: true,
      isGrab: false,
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
    this.$EventBus.$on(eventsList.JUMP_PAGE_TO, this.jumpToPage)
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
          const pageDOM = document.querySelector(`#page-${this.curPage}`)
          this.$EventBus.$emit(eventsList.SCROLL_PAGE_TO, pageDOM.offsetTop)
          if (this.isGrab) {
            this.handTool = new GrabToPan({
              element: document.querySelector('#viewerContainer'),
            })
            this.handTool.activate()
          }
        })
      })
    },
    onDownloadClick() {
      const reg = /^(https|http|ftp|rtsp|mms)?:\/\//
      if (reg.test(this.url)) {
        alert('暂不支持跨域资源')
      }
      axios.get(this.url, {
        headers: { 'Content-disposition': 'attachment' },
      })
    },
    onToggleSecondaryToolbar() {
      this.isSecondaryToolbarHidden = !this.isSecondaryToolbarHidden
    },
    onToggleDocumentProperties() {
      this.isDocumentPropertiesHidden = !this.isDocumentPropertiesHidden
      this.isSecondaryToolbarHidden = true
    },
    onToggleOpenPDF() {
      this.isOpenPDFHidden = !this.isOpenPDFHidden
    },
    onPageChange(value) {
      this.curPage = value
    },
    onURLChange(value) {
      getPDFPageSize(value, this.viewport)
        .then((res) => {
          this.pageSizeList = res
          this.url = value
          this.onToggleOpenPDF()
          this.onScaleChange()
        })
        .catch(() => {
          alert('加载失败')
        })
    },
    onToggleHandTool() {
      this.isGrab = !this.isGrab
      if (this.isGrab) {
        this.handTool = new GrabToPan({
          element: document.querySelector('#viewerContainer'),
        })
        this.handTool.activate()
      } else {
        this.handTool.deactivate()
      }
    },
    onToggleSidebar() {
      this.isSidebarHidden = !this.isSidebarHidden
      if (!this.isSidebarHidden) {
        const thumbnailWrapper = document.querySelector(
          `#thumbnail-${this.curPage}`
        ).parentElement
        const thumbnailReservedHeight = 200
        const scrollDistance =
          thumbnailWrapper.scrollHeight - thumbnailReservedHeight
        document.querySelector('#thumbnailView').scrollTo(0, scrollDistance)
      }
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
      this.$EventBus.$emit(eventsList.SCROLL_PAGE_TO, pageDOM.offsetTop)
    },
  },
}
</script>
