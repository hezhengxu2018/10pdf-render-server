<template>
  <div id="documentPropertiesOverlay" class="container">
    <div class="dialog">
      <div>
        <label for="pdfurl">PDF文件地址:</label>
        <input id="pdfurl" :value="url" style="font-size: 14px" />
      </div>
      <div class="buttonRow">
        <button class="overlayButton" @click.stop="onSubmitClick">
          <span>确定</span>
        </button>
        <button class="overlayButton" @click.stop="onCloseClick">
          <span>关闭</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OpenPDF',
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  methods: {
    onCloseClick() {
      this.$emit('toggleOpenPDF')
    },
    onSubmitClick() {
      const url = document.querySelector('#pdfurl').value
      this.$emit('onURLChange', url)
    },
  },
}
</script>
