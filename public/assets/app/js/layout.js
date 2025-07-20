var App = new Vue({
  el: '#AppVue',
  data: {},
  mixins,
  methods: {
    _init: function () {
      if (App.init) {
        App.init()
      }
    }
  }
})

App._init()