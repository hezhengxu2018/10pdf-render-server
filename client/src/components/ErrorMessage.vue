<template>
  <div id="errorWrapper" v-show="isShow">
    <div id="errorMessageLeft">
      <span id="errorMessage">
        {{ message }}
      </span>
    </div>
    <div id="errorMessageRight">
      <button id="errorClose" @click="onCloseClick">关闭</button>
    </div>
    <div class="clearBoth"></div>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  data() {
    return {
      isShow: true,
      message: '',
    }
  },
  methods: {
    onCloseClick() {
      this.isShow = false
    },
  },
}
</script>
