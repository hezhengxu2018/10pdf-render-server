<template>
  <div id="secondaryToolbar" :class="`secondaryToolbar doorHangerRight ${isHidden ? 'hidden' : ''}`">
    <div id="secondaryToolbarButtonContainer" style="max-height: 489px">
      <button
        id="secondaryPresentationMode"
        class="secondaryToolbarButton presentationMode visibleLargeView"
        title="切换到演示模式"
        tabindex="51"
      >
        <span>演示模式</span>
      </button>

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

      <a
        href="#page=3&amp;zoom=auto,-15,792"
        id="secondaryViewBookmark"
        class="secondaryToolbarButton bookmark visibleSmallView"
        title="当前在看的内容（复制或在新窗口中打开）"
        tabindex="55"
      >
        <span>当前在看</span>
      </a>

      <div class="horizontalToolbarSeparator visibleLargeView"></div>

      <button
        id="firstPage"
        class="secondaryToolbarButton firstPage"
        title="转到第一页"
        tabindex="56"
      >
        <span>转到第一页</span>
      </button>
      <button
        id="lastPage"
        class="secondaryToolbarButton lastPage"
        title="转到最后一页"
        tabindex="57"
      >
        <span>转到最后一页</span>
      </button>

      <!-- <div class="horizontalToolbarSeparator"></div>

      <button
        id="pageRotateCw"
        class="secondaryToolbarButton rotateCw"
        title="顺时针旋转"
        tabindex="58"
      >
        <span>顺时针旋转</span>
      </button>
      <button
        id="pageRotateCcw"
        class="secondaryToolbarButton rotateCcw"
        title="逆时针旋转"
        tabindex="59"
      >
        <span>逆时针旋转</span>
      </button> -->

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

      <!-- <div class="horizontalToolbarSeparator"></div>

      <button
        id="scrollVertical"
        class="secondaryToolbarButton scrollModeButtons scrollVertical toggled"
        title="使用垂直滚动"
        tabindex="62"
      >
        <span>垂直滚动</span>
      </button>
      <button
        id="scrollHorizontal"
        class="secondaryToolbarButton scrollModeButtons scrollHorizontal"
        title="使用水平滚动"
        tabindex="63"
      >
        <span>水平滚动</span>
      </button>
      <button
        id="scrollWrapped"
        class="secondaryToolbarButton scrollModeButtons scrollWrapped"
        title="使用平铺滚动"
        tabindex="64"
      >
        <span>平铺滚动</span>
      </button>

      <div class="horizontalToolbarSeparator scrollModeButtons"></div>

      <button
        id="spreadNone"
        class="secondaryToolbarButton spreadModeButtons spreadNone"
        title="不加入衔接页"
        tabindex="65"
      >
        <span>单页视图</span>
      </button>
      <button
        id="spreadOdd"
        class="secondaryToolbarButton spreadModeButtons spreadOdd toggled"
        title="加入衔接页使奇数页作为起始页"
        tabindex="66"
      >
        <span>双页视图</span>
      </button>
      <button
        id="spreadEven"
        class="secondaryToolbarButton spreadModeButtons spreadEven"
        title="加入衔接页使偶数页作为起始页"
        tabindex="67"
      >
        <span>书籍视图</span>
      </button> -->

      <div class="horizontalToolbarSeparator spreadModeButtons"></div>

      <button
        id="documentProperties"
        class="secondaryToolbarButton documentProperties"
        title="文档属性…"
        tabindex="68"
      >
        <span>文档属性…</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isHidden: {
      type: Boolean,
      default: true
    }
  }
}
</script>
