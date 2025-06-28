const messagesValidator = require('./validator-messages')
const Validator = require('validatorjs')

Validator.register('phone', function (value, requirement, attribute) {
  return value.match(/^\d{2}\d{8}$/)
}, 'Este campo precisa ser um telefone com DDD+TELEFONE (apenas números).')

Validator.register('mobilephone', function (value, requirement, attribute) {
  return value.match(/^\d{2}\d{1}\d{8}$/)
}, 'Este campo precisa ser um celular com DDD+CELULAR (apenas números).')

Validator.register('genericphone', function (value, requirement, attribute) {
  return value.match(/^\d{2}\d?\d{8}$/)
}, 'Este campo precisa ser um celular com DDD+CELULAR (apenas números).')

Validator.register('dateformat', function (value, requirement, attribute) {
  return value.match(/^\d{4}-\d{2}-\d{2}$/)
}, 'Este campo precisa ser uma data no formato YYYY-MM-DD.')

Validator.register('datetimeformat', function (value, requirement, attribute) {
  return value.match(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/)
}, 'Este campo precisa ser uma data no formato YYYY-MM-DD HH:mm:ss.')

Validator.register('datetimeformat', function (value, requirement, attribute) {
  return value.match(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/)
}, 'Este campo precisa ser uma data no formato YYYY-MM-DD HH:mm:ss.')

Validator.register('uuid', function (value, requirement, attribute) {
  return value.match(/^[a-f0-9]{8}(-[a-f0-9]{4}){4}[a-f0-9]{8}$/)
}, 'Este campo precisa ser um UUID válido.')

const Validate = function (res, ret, fields, rules, customMessages = {}) {
  const translatedMessages = {}

  for (const i in messagesValidator) {
    const message = res.__(messagesValidator[i])
    translatedMessages[i] = message
  }

  const messages = Object.assign({}, translatedMessages, customMessages)
  const dataValidate = new Validator(fields, rules, messages)

  const fails = dataValidate.fails()
  const errors = dataValidate.errors.all()

  if (fails) {
    if (ret) {
      ret.setError(true)

      for (const field in errors) {
        const messages = errors[field]
        ret.setFieldError(field, true)

        for (const i in messages) {
          const message = messages[i]
          ret.addFieldMessage(field, message)
        }
      }

      ret.setCode(400)
    }

    return false
  }

  return true
}

module.exports = Validate
