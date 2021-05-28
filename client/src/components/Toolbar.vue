<template>
  <div class="toolbar">
    <div id="toolbarContainer">
      <div id="toolbarViewer">
        <div id="toolbarViewerLeft">
          <button
            id="sidebarToggle"
            class="toolbarButton toggled"
            title="切换侧栏"
            tabindex="11"
          >
            <span data-l10n-id="toggle_sidebar_label">切换侧栏</span>
          </button>
          <div class="toolbarButtonSpacer"></div>
          <button
            id="viewFind"
            class="toolbarButton"
            title="在文档中查找"
            tabindex="12"
          >
            <span data-l10n-id="findbar_label">查找</span>
          </button>
          <div class="splitToolbarButton hiddenSmallView">
            <button
              class="toolbarButton pageUp"
              title="上一页"
              id="previous"
              tabindex="13"
            >
              <span data-l10n-id="previous_label">上一页</span>
            </button>
            <div class="splitToolbarButtonSeparator"></div>
            <button
              class="toolbarButton pageDown"
              title="下一页"
              id="next"
              tabindex="14"
            >
              <span data-l10n-id="next_label">下一页</span>
            </button>
          </div>
          <input
            type="number"
            id="pageNumber"
            class="toolbarField pageNumber"
            title="页面"
            value="1"
            size="4"
            min="1"
            tabindex="15"
            autocomplete="off"
            :max="numPages"
          />
          <span id="numPages" class="toolbarLabel">/ {{numPages}}</span>
        </div>
        <div id="toolbarViewerRight">
          <button
            id="presentationMode"
            class="toolbarButton presentationMode hiddenLargeView"
            title="切换到演示模式"
            tabindex="31"
            data-l10n-id="presentation_mode"
          >
            <span data-l10n-id="presentation_mode_label">演示模式</span>
          </button>

          <button
            id="openFile"
            class="toolbarButton openFile hiddenLargeView"
            title="打开文件"
            tabindex="32"
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
          <a
            href="#page=1&amp;zoom=auto,-338,792"
            id="viewBookmark"
            class="toolbarButton bookmark hiddenSmallView"
            title="当前在看的内容（复制或在新窗口中打开）"
            tabindex="35"
          >
            <span data-l10n-id="bookmark_label">当前在看</span>
          </a>

          <div class="verticalToolbarSeparator hiddenSmallView"></div>

          <button
            id="secondaryToolbarToggle"
            class="toolbarButton"
            title="工具"
            tabindex="36"
            @click="$emit('toggleSecondaryToolbar')"
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
            >
              <span data-l10n-id="zoom_out_label">缩小</span>
            </button>
            <div class="splitToolbarButtonSeparator"></div>
            <button
              id="zoomIn"
              class="toolbarButton zoomIn"
              title="放大"
              tabindex="22"
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
            >
              <option
                id="pageAutoOption"
                title=""
                value="auto"
                selected="selected"
                >
                自动缩放
              </option>
              <option id="pageActualOption" title="" value="page-actual">
                实际大小
              </option>
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
              <option title="" value="1">100%</option>
              <option title="" value="1.25">125%</option>
              <option title="" value="1.5">150%</option>
              <option title="" value="2">200%</option>
              <option title="" value="3">300%</option>
              <option title="" value="4">400%</option>
            </select>
          </span>
        </div>
      </div>
      <div id="loadingBar" class="hidden">
        <div class="progress" style="height: 100%; width: 100%;">
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
      default: 0
    }
  }
}
</script>
