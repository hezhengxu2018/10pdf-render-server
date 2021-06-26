<template>
  <div id="documentPropertiesOverlay" class="container">
    <div class="dialog">
      <div class="row">
        <span data-l10n-id="document_properties_file_name">文件名:</span>
        <p id="fileNameField">
          {{ getFilename(this.url) }}
        </p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_file_size">文件大小:</span>
        <p id="fileSizeField">
          {{ fileSizeFormatter(metaData.contentLength) }} ({{
            metaData.contentLength.toLocaleString()
          }}
          字节)
        </p>
      </div>
      <div class="separator"></div>
      <div class="row">
        <span data-l10n-id="document_properties_creation_date">创建日期:</span>
        <p id="creationDateField">
          {{
            metaData.info ? dateFormatter(this.metaData.info.CreationDate) : '-'
          }}
        </p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_modification_date">
          修改日期:
        </span>
        <p id="modificationDateField">
          {{ metaData.info ? dateFormatter(this.metaData.info.ModDate) : '-' }}
        </p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_creator">创建者:</span>
        <p id="creatorField">
          {{ metaData.info ? metaData.info.Creator : '-' }}
        </p>
      </div>
      <div class="separator"></div>
      <div class="row">
        <span data-l10n-id="document_properties_producer">PDF 生成器：</span>
        <p id="producerField">
          {{ metaData.info ? metaData.info.Producer : '-' }}
        </p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_version">PDF 版本:</span>
        <p id="versionField">
          {{ metaData.info ? metaData.info.PDFFormatVersion : '' }}
        </p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_page_count">页数:</span>
        <p id="pageCountField">{{ metaData.info ? numPages : 0 }}</p>
      </div>
      <div class="row">
        <span data-l10n-id="document_properties_page_size">页面大小：</span>
        <p id="pageSizeField">
          {{
            `${currentPageSize.viewBox[2]} × ${currentPageSize.viewBox[3]} 毫米`
          }}
        </p>
      </div>
      <div class="separator"></div>
      <div class="row">
        <span data-l10n-id="document_properties_linearized">
          快速 Web 视图：
        </span>
        <p id="linearizedField">
          {{ metaData.info && metaData.info.IsLinearized ? '是' : '否' }}
        </p>
      </div>
      <div class="buttonRow">
        <button
          id="documentPropertiesClose"
          class="overlayButton"
          @click.stop="onCloseClick"
        >
          <span>关闭</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { PDFDateString } from 'pdfjs-dist'

export default {
  props: {
    metaData: {
      type: Object,
      default: () => ({ info: {}, contentLength: 0 }),
    },
    numPages: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      default: '',
    },
    currentPageSize: {
      type: Object,
      default: () => ({ viewBox: [] }),
    },
  },
  methods: {
    dateFormatter(date) {
      if (this.metaData.info) {
        return `${PDFDateString.toDateObject(
          date
        ).toLocaleDateString()}  ${PDFDateString.toDateObject(
          date
        ).toLocaleTimeString()}`
      }
      return ''
    },
    fileSizeFormatter(value) {
      if (value / 1024 / 1024 > 1) {
        return `${(value / 1024 / 1024).toFixed(2)} MB`
      }
      return `${(value / 1024).toFixed(2)} KB`
    },
    getFilename(url) {
      const reURI = /^(?:(?:[^:]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/
      const reFilename = /[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i
      const splitURI = reURI.exec(url)
      const suggestedFilename =
        reFilename.exec(splitURI[1]) ||
        reFilename.exec(splitURI[2]) ||
        reFilename.exec(splitURI[3])
      return suggestedFilename[0]
    },
    onCloseClick() {
      this.$emit('toggleDocumentProperties')
    },
  },
}
</script>
