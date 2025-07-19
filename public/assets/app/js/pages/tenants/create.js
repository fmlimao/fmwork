mixins.push({
  data: {
    tenant: {
      loading: true,
      loaded: false,
      error: true,
      messages: ['tenant error'],
      delete: false,
      fields: {
        name: {
          error: true,
          messages: ['name error'],
          value: 'name value'
        },
        description: {
          error: true,
          messages: ['description error'],
          value: 'description value'
        },
        appTitle: {
          error: true,
          messages: ['appTitle error'],
          value: 'appTitle value'
        },
        appShortTitle: {
          error: true,
          messages: ['appShortTitle error'],
          value: 'appShortTitle value'
        },

      }
    }

  },
  methods: {
    init: () => {
      clearFormErrors(App.tenant)

      for (const field in App.tenant.fields) {
        App.tenant.fields[field].value = ''
      }

      App.tenant.loading = false
      App.tenant.loaded = true
    },

    saveTenant: async () => {
      doLog('saveTenant()')

      clearFormErrors(App.tenant)

      let error = false

      if (!App.tenant.fields.name.value) {
        App.tenant.fields.name.error = true
        App.tenant.fields.name.messages.push('Campo obrigatório.')
        error = true
      }

      if (!App.tenant.fields.appTitle.value) {
        App.tenant.fields.appTitle.error = true
        App.tenant.fields.appTitle.messages.push('Campo obrigatório.')
        error = true
      }

      if (!App.tenant.fields.appShortTitle.value) {
        App.tenant.fields.appShortTitle.error = true
        App.tenant.fields.appShortTitle.messages.push('Campo obrigatório.')
        error = true
      }

      if (error) {
        App.tenant.error = true
        App.tenant.messages.push('Verifique todos os campos.')
        return
      }

      try {
        App.tenant.loading = true

        const response = (await axios({
          method: 'post',
          url: '/api/v1/tenants',
          data: {
            name: App.tenant.fields.name.value,
            description: App.tenant.fields.description.value,
            appTitle: App.tenant.fields.appTitle.value,
            appShortTitle: App.tenant.fields.appShortTitle.value
          }
        })).data

        const uuid = response.content.data.uuid
        App.tenant.messages = ['Inquilino criado com sucesso.']
        notify('Inquilino criado com sucesso.', 'success')

        setTimeout(() => {
          window.location.href = '/app/tenants/' + uuid
        }, 1000)
      } catch (error) {
        doLog("saveTenant() error", error)

        if (isAxiosError(error) && isApiError(error)) {
          const response = error.response.data
          formPopulate(App.tenant, response)
        } else {
          notify('Ocorreu um erro interno. Por favor tenta novamente', 'danger')
          App.tenant.error = true
          App.tenant.messages.push('Ocorreu um erro interno. Por favor tenta novamente')
        }
      } finally {
        App.tenant.loading = false
      }
    },
  }
})