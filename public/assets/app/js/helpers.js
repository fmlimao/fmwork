function isAxiosError(str) {
  if (
    typeof str === 'object'
    && typeof str.response !== 'undefined'
    && typeof str.response.data !== 'undefined'
  ) {
    return str.response.data
  }

  return false
}

function isApiError(str) {
  if (
    typeof str === 'object'
    && typeof str.code !== 'undefined'
  ) {
    return str
  }

  return false
}

function isJsonDefault(str) {
  return typeof str === 'object' && typeof str.code !== 'undefined'
}

function datimeFormatDefault(str, format, timezone = -3) {
  if (typeof str === 'undefined' || str === null) {
    return ''
  }

  return moment(str).utcOffset(timezone).format(format)
}

function phoneFormatDefault(str) {
  if (typeof str === 'undefined' || str === null) {
    return ''
  }

  return str.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
}

function cpfCnpjFormatDefault(str) {
  if (typeof str === 'undefined' || str === null) {
    return ''
  }

  if (str.length === 11) {
    return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  if (str.length === 14) {
    return str.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
}

function removeLoading() {
  // primeiro dou um fadeout na div
  $('.content-loading').fadeOut(200, function () {
    // depois removo ela
    $(this).remove()
  })
}

function notify(message, type) {
  $.notify({
    // options
    message: message
  }, {
    // settings
    type: type,
    animate: {
      enter: 'animate__animated animate__fadeInDown',
      exit: 'animate__animated animate__fadeOutUp'
    },
  })
}

function queryMessage(name, message, type) {
  const urlParams = new URLSearchParams(window.location.search)
  const excluded = urlParams.get(name)
  if (excluded) {
    notify(message, type)

    // remover da url
    urlParams.delete(name)

    // adicionar a nova url
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`)
  }
}

var LOG_ENABLED = false
var LOG_DISPLAY_ARGS = false

function doLog() {
  if (LOG_ENABLED) {
    if (LOG_DISPLAY_ARGS) {
      console.log('LOG', ...arguments)
    } else {
      console.log('LOG', arguments[0])
    }
  }
}

// ------------------------------------------

// configuro o moment no timezone -3
// moment.tz.setDefault('America/Sao_Paulo')
// moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

// configuro o header Authorization para todas as requisições
// axios.interceptors.request.use(function (config) {
//   config.headers.Authorization = `Bearer ${accessToken}`
//   return config
// }, function (error) {
//   return Promise.reject(error)
// })