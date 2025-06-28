class JsonResponse {
  constructor () {
    this.code = 200
    this.error = false
    this.errorCodes = []
    this.errorCodeDetails = []
    this.messages = []
    this.form = {}
    this.content = {}
    this.hasForm = false
    this.hasContent = false
  }

  setCode (code) {
    this.code = code
    return this
  }

  getCode () {
    return this.code
  }

  setError (error) {
    this.error = error
    return this
  }

  getError () {
    return this.error
  }

  addErrorCode (errorCode) {
    this.errorCodes.push(errorCode)
    return this
  }

  getErrorCodes () {
    return this.errorCodes
  }

  addErrorCodeDetail (errorCodeDetail) {
    this.errorCodeDetails.push(errorCodeDetail)
    return this
  }

  getErrorCodeDetails () {
    return this.errorCodeDetails
  }

  addMessage (message) {
    this.messages.push(message)
    return this
  }

  getMessages () {
    return this.messages
  }

  addContent (key, value) {
    this.content[key] = value
    this.hasContent = true
    return this
  }

  getContents () {
    return this.content
  }

  addField (field) {
    this.form[field] = {
      error: false,
      messages: []
    }
    this.hasForm = true

    return this
  }

  getField (field) {
    return this.form[field] ? this.form[field] : null
  }

  addFields (fields) {
    for (const i in fields) {
      const field = fields[i]
      this.addField(field)
    }

    return this
  }

  getFields () {
    return this.form
  }

  setFieldError (field, error) {
    if (!this.form[field]) this.addField(field)
    this.form[field].error = error
    return this
  }

  addFieldMessage (field, message) {
    if (!this.form[field]) this.addField(field)
    this.form[field].messages.push(message)
    return this
  }

  clearForm () {
    this.form = {}
    this.hasForm = false
    return this
  }

  mergeResponse (response) {
    if (typeof response.code !== 'undefined') this.setCode(response.code)

    if (typeof response.error !== 'undefined') this.setError(response.error)

    if (typeof response.messages !== 'undefined') {
      for (const message of response.messages) {
        this.addMessage(message)
      }
    }

    if (typeof response.form !== 'undefined') {
      for (const fieldName in response.form) {
        const field = response.form[fieldName]
        this.addField(fieldName)
        this.setFieldError(fieldName, field.error)

        for (const message of field.messages) {
          this.addFieldMessage(fieldName, message)
        }
      }
    }

    if (typeof response.content !== 'undefined') {
      for (const k in response.content) {
        this.addContent(k, response.content[k])
      }
    }
  }

  generate () {
    const obj = {}

    obj.code = this.code
    obj.error = this.error
    if (this.errorCodes.length) obj.errorCodes = this.errorCodes
    if (this.errorCodeDetails.length) obj.errorCodeDetails = this.errorCodeDetails
    if (this.messages.length) obj.messages = this.messages
    if (this.hasForm) obj.form = this.form
    if (this.hasContent) obj.content = this.content

    return obj
  }
}

module.exports = JsonResponse
