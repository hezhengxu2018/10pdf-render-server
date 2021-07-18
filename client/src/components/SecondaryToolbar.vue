<template>
  <div
    id="secondaryToolbar"
    :class="`secondaryToolbar doorHangerRight ${isHidden ? 'hidden' : ''}`"
  >
    <div
      id="secondaryToolbarButtonContainer"
      style="max-height: 489px"
      v-clickoutside="hideSecondaryToolbar"
    >
      <button
        id="secondaryOpenFile"
        class="secondaryToolbarButton openFile visibleLargeView"
        title="打开文件"
        tabindex="52"
        @click="toggleOpenPDF"
      >
        <span>打开</span>
      </button>

      <button
        id="secondaryDownload"
        class="secondaryToolbarButton download visibleMediumView"
        title="下载"
        tabindex="54"
        @click="onDownloadClick"
      >
        <span>下载</span>
      </button>

      <div class="horizontalToolbarSeparator visibleLargeView"></div>

      <button
        id="firstPage"
        class="secondaryToolbarButton firstPage"
        title="转到第一页"
        tabindex="56"
        @click="jumpToPage(1)"
      >
        <span>转到第一页</span>
      </button>
      <button
        id="lastPage"
        class="secondaryToolbarButton lastPage"
        title="转到最后一页"
        tabindex="57"
        @click="jumpToPage(-1 >>> 0)"
      >
        <span>转到最后一页</span>
      </button>

      <div class="horizontalToolbarSeparator"></div>

      <button
        id="cursorSelectTool"
        :class="`secondaryToolbarButton selectTool ${!isGrab ? 'toggled' : ''}`"
        title="启用文本选择工具"
        tabindex="60"
        @click="toggleHandTool('selectTool')"
      >
        <span>文本选择工具</span>
      </button>
      <button
        id="cursorHandTool"
        :class="`secondaryToolbarButton handTool ${isGrab ? 'toggled' : ''}`"
        title="启用手形工具"
        tabindex="61"
        @click="toggleHandTool('handTool')"
      >
        <span>手形工具</span>
      </button>
      <div class="horizontalToolbarSeparator spreadModeButtons"></div>

      <button
        id="documentProperties"
        class="secondaryToolbarButton documentProperties"
        title="文档属性…"
        tabindex="68"
        @click="showDocumentProperties"
      >
        <span>文档属性…</span>
      </button>
    </div>
  </div>
</template>

<script>
import clickoutside from '../utils/directive'
import eventsList from '../eventsList'

export default {
  props: {
    isHidden: {
      type: Boolean,
      default: true,
    },
    isGrab: {
      type: Boolean,
      default: false,
    },
  },
  directives: {
    clickoutside,
  },
  methods: {
    hideSecondaryToolbar() {
      this.$emit('toggleSecondaryToolbar')
    },
    showDocumentProperties() {
      this.$emit('toggleDocumentProperties')
    },
    jumpToPage(val) {
      this.$EventBus.$emit(eventsList.JUMP_PAGE_TO, val)
      this.$emit('toggleSecondaryToolbar')
    },
    toggleHandTool(val) {
      if (this.isGrab && val === 'selectTool') {
        this.$emit('toggleHandTool')
        this.$emit('toggleSecondaryToolbar')
      }
      if (!this.isGrab && val === 'handTool') {
        this.$emit('toggleHandTool')
        this.$emit('toggleSecondaryToolbar')
      }
    },
    toggleOpenPDF() {
      this.$emit('toggleOpenPDF')
    },
    onDownloadClick() {
      this.$emit('download')
    },
  },
}
</script>
