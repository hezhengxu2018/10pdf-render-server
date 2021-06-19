<template>
  <div id="sidebarContainer">
    <div id="toolbarSidebar">
      <div id="toolbarSidebarLeft">
        <div class="splitToolbarButton toggled">
          <button
            id="viewThumbnail"
            class="toolbarButton toggled"
            title="显示缩略图"
            tabindex="2"
            data-l10n-id="thumbs"
          >
            <span data-l10n-id="thumbs_label">缩略图</span>
          </button>
        </div>
      </div>

      <div id="toolbarSidebarRight">
        <div id="outlineOptionsContainer" class="hidden">
          <div class="verticalToolbarSeparator"></div>

          <button
            id="currentOutlineItem"
            class="toolbarButton"
            disabled=""
            title="查找当前大纲项目"
            tabindex="6"
            data-l10n-id="current_outline_item"
          >
            <span data-l10n-id="current_outline_item_label">当前大纲项目</span>
          </button>
        </div>
      </div>
    </div>
    <div id="sidebarContent">
      <div id="thumbnailView">
        <ThumbnailView
          v-for="i of numPages"
          :key="i"
          :pageNum="i"
          :pageSize="i"
          :url="url"
          :curPage="curPage"
        />
      </div>
    </div>
    <div id="sidebarResizer"></div>
  </div>
</template>

<script>
import ThumbnailView from './ThumbnailView.vue'

export default {
  components: { ThumbnailView },
  props: {
    numPages: {
      type: Number,
      default: 0,
    },
    curPage: {
      type: Number,
      default: 1,
    },
    url: {
      type: String,
      default: '',
    },
  },
  methods: {},
}
</script>
