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
      >
        <span>打开</span>
      </button>

      <button
        id="secondaryPrint"
        class="secondaryToolbarButton print visibleMediumView"
        title="打印"
        tabindex="53"
      >
        <span>打印</span>
      </button>

      <button
        id="secondaryDownload"
        class="secondaryToolbarButton download visibleMediumView"
        title="下载"
        tabindex="54"
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
        class="secondaryToolbarButton selectTool toggled"
        title="启用文本选择工具"
        tabindex="60"
      >
        <span>文本选择工具</span>
      </button>
      <button
        id="cursorHandTool"
        class="secondaryToolbarButton handTool"
        title="启用手形工具"
        tabindex="61"
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

export default {
  props: {
    isHidden: {
      type: Boolean,
      default: true,
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
      this.$emit('jumpToPage', val)
      this.$emit('toggleSecondaryToolbar')
    },
  },
}
</script>
