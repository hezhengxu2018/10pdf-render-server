<template>
  <div id="app">
    <Toolbar
      :numPages="numPages"
      @toggleSecondaryToolbar="
        isSecondaryToolbarHidden = !isSecondaryToolbarHidden
      "
    ></Toolbar>
    <SecondaryToolbar :isHidden="isSecondaryToolbarHidden" />
    <ViewContainer :numPages="numPages"></ViewContainer>
    <div id="overlayContainer" :class="isOverlayHidden ? 'hidden' : ''">
      <MetaData :metaData="metaData" :numPages="numPages"></MetaData>
    </div>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar.vue'
import SecondaryToolbar from './components/SecondaryToolbar.vue'
import ViewContainer from './components/ViewContainer.vue'
import MetaData from './components/MetaData.vue'
import { getPDFMetadata } from './api/index'

export default {
  name: 'App',
  components: {
    Toolbar,
    SecondaryToolbar,
    MetaData,
    ViewContainer,
  },
  provide() {
    return {
      url: this.url,
      viewport: this.viewport,
    }
  },
  data() {
    return {
      numPages: 0,
      viewport: 1.5,
      url: './server/static/b85n.pdf',
      metaData: {},
      isSecondaryToolbarHidden: false,
      isOverlayHidden: true,
    }
  },
  mounted() {
    getPDFMetadata(this.url, this.viewport).then((res) => {
      const { numPages } = res
      this.metaData = res
      this.numPages = Number(numPages)
    })
  },
}
</script>
