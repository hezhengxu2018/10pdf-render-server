<template>
  <div id="documentPropertiesOverlay" class="container">
    <div class="dialog">
      <div class="row">
        <span data-l10n-id="document_properties_file_name">文件名:</span>
        <p id="fileNameField">compressed.tracemonkey-pldi-09.pdf</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_file_size">文件大小:</span>
        <p id="fileSizeField">992 KB (1,016,315 字节)</p>
      </div>
      <div class="separator"></div>
      <div class="row">
        <span data-l10n-id="document_properties_title">标题:</span>
        <p id="titleField">-</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_author">作者:</span>
        <p id="authorField">-</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_subject">主题:</span>
        <p id="subjectField">-</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_keywords">关键词:</span>
        <p id="keywordsField">-</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_creation_date">创建日期:</span>
        <p id="creationDateField">{{ metaData.info ? dateFormatter(this.metaData.info.CreationDate) : '-' }}</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_modification_date"
          >修改日期:</span
        >
        <p id="modificationDateField">{{ metaData.info ? dateFormatter(this.metaData.info.ModDate) : '-' }}</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_creator">创建者:</span>
        <p id="creatorField">{{ metaData.info ? metaData.info.Creator : '-' }}</p>
      </div>
      <div class="separator"></div>
      <div class="row">
        <span data-l10n-id="document_properties_producer">PDF 生成器：</span>
        <p id="producerField">{{ metaData.info? metaData.info.Producer : '-' }}</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_version">PDF 版本:</span>
        <p id="versionField">{{ metaData.info ? metaData.info.PDFFormatVersion : '' }}</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_page_count">页数:</span>
        <p id="pageCountField">{{ metaData.info ? numPages : 0 }}</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_page_size">页面大小：</span>
        <p id="pageSizeField">215.9 × 279.4 毫米（文本，纵向）</p>
      </div>
      <div class="separator"></div>
      <div class="row">
        <span data-l10n-id="document_properties_linearized"
          >快速 Web 视图：</span
        >
        <p id="linearizedField">{{ metaData.info && metaData.info.IsLinearized ? "是" : "否" }}</p>
      </div>
      <div class="buttonRow">
        <button id="documentPropertiesClose" class="overlayButton">
          <span data-l10n-id="document_properties_close">关闭</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import { PDFDateString } from "pdfjs-dist/lib/pdf";

export default {
  props: {
    metaData: {
      type: Object,
      default: () => ({info: {}}),
    },
    numPages: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    dateFormatter(date) {
      if (this.metaData.info) {
        return `${PDFDateString.toDateObject(date).toLocaleDateString()  }  ${  PDFDateString.toDateObject(date).toLocaleTimeString()}`
      }
      return ''
    }
  }
};
</script>
