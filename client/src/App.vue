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
    />
    <Sidebar :numPages="numPages" :curPage="curPage" :url="url" />
    <SecondaryToolbar
      :isHidden="isSecondaryToolbarHidden"
      :isGrab="isGrab"
      @toggleSecondaryToolbar="onToggleSecondaryToolbar"
      @toggleDocumentProperties="onToggleDocumentProperties"
      @toggleHandTool="onToggleHandTool"
      @toggleOpenPDF="onToggleOpenPDF"
      @download="onDownloadClick"
    />
    <ViewContainer
      :numPages="numPages"
      :pageSizeList="pageSizeList"
      :isGrab="isGrab"
      :url="url"
      :viewport="viewport"
      v-if="toggle"
    />
    <div id="errorMessage"></div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import FileSaver from 'file-saver'
import {
  Toolbar,
  SecondaryToolbar,
  ViewContainer,
  DocumentProperties,
  OpenPDF,
  Sidebar,
} from './components/index'
import { getPDFMetadata, getPageSize } from './api/index'
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
    getPDFMetadata(this.url, this.viewport)
      .then((res) => {
        const { numPages } = res
        this.metaData = res
        this.numPages = Number(numPages)
        getPageSize(this.url, this.viewport)
          .then((result) => {
            this.pageSizeList = result
          })
          .catch((err) => {
            this.$errorMessage(err)
          })
      })
      .catch((err) => {
        this.$errorMessage(err)
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
      getPageSize(this.url, this.viewport).then((res) => {
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
    onPageChange(value) {
      this.curPage = value
    },
    onURLChange(value) {
      getPDFMetadata(value, this.viewport)
        .then((result) => {
          const { numPages } = result
          this.metaData = result
          this.numPages = Number(numPages)
          getPageSize(value, this.viewport).then((res) => {
            // if pdf file is exists, to set numPages to zero make sure thumbnails rerender
            this.numPages = 0
            this.pageSizeList = res
            // change the url only when pdf file exists
            this.url = value
            this.onToggleOpenPDF()
            this.onScaleChange()
          })
        })

        .catch(() => {
          this.$errorMessage('资源加载失败')
        })
    },
    onDownloadClick() {
      FileSaver.saveAs(`/api/download?filePath=${this.url}`)
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
