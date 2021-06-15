<template>
  <div class="toolbar">
    <div id="toolbarContainer">
      <div id="toolbarViewer">
        <div id="toolbarViewerRight">
          <button
            id="openFile"
            class="toolbarButton openFile hiddenLargeView"
            title="打开文件"
            tabindex="32"
            @click="onOpenPDFClick"
          >
            <span>打开</span>
          </button>

          <button
            id="print"
            class="toolbarButton print hiddenMediumView"
            title="打印"
            tabindex="33"
          >
            <span data-l10n-id="print_label">打印</span>
          </button>

          <button
            id="download"
            class="toolbarButton download hiddenMediumView"
            title="下载"
            tabindex="34"
          >
            <span data-l10n-id="download_label">下载</span>
          </button>
          <button
            id="secondaryToolbarToggle"
            class="toolbarButton"
            title="工具"
            tabindex="36"
            @click="onToggleSecondaryToolbarClick"
          >
            <span>工具</span>
          </button>
        </div>
        <div id="toolbarViewerMiddle">
          <div class="splitToolbarButton">
            <button
              id="zoomOut"
              class="toolbarButton zoomOut"
              title="缩小"
              tabindex="21"
              @click="onViewportChange(undefined, 'decrease')"
            >
              <span data-l10n-id="zoom_out_label">缩小</span>
            </button>
            <div class="splitToolbarButtonSeparator"></div>
            <button
              id="zoomIn"
              class="toolbarButton zoomIn"
              title="放大"
              tabindex="22"
              @click="onViewportChange(undefined, 'increase')"
            >
              <span data-l10n-id="zoom_in_label">放大</span>
            </button>
          </div>
          <span id="scaleSelectContainer" class="dropdownToolbarButton">
            <select
              id="scaleSelect"
              title="缩放"
              tabindex="23"
              data-l10n-id="zoom"
              :value="selectedViewport"
              @input="onViewportChange($event.target.value)"
            >
              <option id="pageFitOption" title="" value="page-fit">
                适合页面
              </option>
              <option id="pageWidthOption" title="" value="page-width">
                适合页宽
              </option>
              <option
                id="customScaleOption"
                title=""
                value="custom"
                disabled="disabled"
                hidden="true"
              ></option>
              <option title="" value="0.5">50%</option>
              <option title="" value="0.75">75%</option>
              <option title="" value="1" selected>100%</option>
              <option title="" value="1.25">125%</option>
              <option title="" value="1.5">150%</option>
              <option title="" value="2">200%</option>
              <option title="" value="2.5">250%</option>
              <option title="" value="3">300%</option>
              <option title="" value="3.5">350%</option>
              <option title="" value="4">400%</option>
            </select>
          </span>
        </div>
      </div>
      <div id="loadingBar" class="hidden">
        <div class="progress" style="height: 100%; width: 100%">
          <div class="glimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'toolbar',
  props: {
    numPages: {
      type: Number,
      default: 0,
    },
    curPage: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      selectedViewport: '1',
    }
  },
  methods: {
    jumpToPage(value) {
      this.$emit('jumpToPage', value)
    },
    onViewportChange(vp, type) {
      if (!type) {
        this.selectedViewport = vp
        this.$emit('scaleChange', vp)
      }

      if (type === 'increase') {
        if (this.$parent.viewport + 0.5 <= 4) {
          this.selectedViewport = String(
            Math.round((this.$parent.viewport + 0.5) * 2) / 2
          )
          this.$emit('scaleChange', Number(this.selectedViewport))
        }
      }

      if (type === 'decrease') {
        if (this.$parent.viewport - 0.5 >= 0.5) {
          this.selectedViewport = String(
            Math.round((this.$parent.viewport - 0.5) * 2) / 2
          )
          this.$emit('scaleChange', Number(this.selectedViewport))
        }
      }
    },
    onToggleSecondaryToolbarClick() {
      this.$emit('toggleSecondaryToolbar')
    },
    onOpenPDFClick() {
      this.$emit('toggleOpenPDF')
    },
  },
}
</script>
