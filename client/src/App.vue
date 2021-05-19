<template>
  <div id="app">
    <Toolbar :numPages=numPages></Toolbar>
    <ViewContainer :numPages=numPages></ViewContainer>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar.vue'
import ViewContainer from './components/ViewContainer.vue'
import { getPDFMetadata } from "./api/index";

export default {
  name: 'App',
  components: {
    Toolbar,
    ViewContainer
  },
  provide() {
    return {
      url: this.url,
      viewport: this.viewport
    }
  },
  data() {
    return {
      numPages: 0,
      viewport: 1.5,
      url: './server/static/b85n.pdf'
    }
  },
  mounted() {
    getPDFMetadata(this.url,this.viewport).then(res=>{
      const {numPages} = res
      this.numPages= Number(numPages)
    })
  }
}
</script>
