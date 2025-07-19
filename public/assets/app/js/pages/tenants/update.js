mixins.push({
  data: {
    tenant: {
      loading: true,
      loaded: false,
      error: true,
      messages: ['tenant error'],
      delete: false,
      fields: {
        uuid: {
          error: true,
          messages: ['uuid error'],
          value: 'uuid value'
        },
        createdAt: {
          error: true,
          messages: ['createdAt error'],
          value: 'createdAt value'
        },
        updatedAt: {
          error: true,
          messages: ['updatedAt error'],
          value: 'updatedAt value'
        },
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
        active: {
          error: true,
          messages: ['active error'],
          value: 'active value'
        },

      }
    },

  },
  methods: {
    init: () => {
      App.getTenant()
      App.getRoles()
    },

    getTenant: async () => {
      doLog('getTenant()')

      try {
        clearFormErrors(App.tenant)

        for (const field in App.tenant.fields) {
          App.tenant.fields[field].value = ''
        }

        App.tenant.loading = true

        const response = (await axios({
          method: 'get',
          url: `/api/v1/tenants/${tenantUuid}`,
        })).data

        console.log('response', response)

        App.tenant.fields.name.value = response.content.data.name
        App.tenant.fields.description.value = response.content.data.description
        App.tenant.fields.appTitle.value = response.content.data.appTitle
        App.tenant.fields.appShortTitle.value = response.content.data.appShortTitle
        App.tenant.fields.active.value = response.content.data.active
        App.tenant.fields.createdAt.value = response.content.data.createdAt
        App.tenant.fields.updatedAt.value = response.content.data.updatedAt
        App.tenant.fields.uuid.value = response.content.data.uuid

        App.tenant.loading = false
        App.tenant.loaded = true
      } catch (error) {
        doLog("getTenant() error", error)
        // notify('Ocorreu um erro interno. Por favor tenta novamente', 'danger')

        if (isAxiosError(error) && isApiError(error)) {
          const response = error.response.data
          console.log('error response', response)

          if (response.code === 404) {
            App.tenant.error = true
            App.tenant.messages.push('Inquilino não encontrado.')
            return
          }

          formPopulate(App.tenant, response)
        } else {
          notify('Ocorreu um erro interno. Por favor tenta novamente', 'danger')
          App.tenant.error = true
          App.tenant.messages.push('Ocorreu um erro interno. Por favor tenta novamente')
        }
      }

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
          method: 'put',
          url: `/api/v1/tenants/${tenantUuid}`,
          data: {
            name: App.tenant.fields.name.value,
            description: App.tenant.fields.description.value,
            appTitle: App.tenant.fields.appTitle.value,
            appShortTitle: App.tenant.fields.appShortTitle.value,
            active: App.tenant.fields.active.value,
          }
        })).data

        // const uuid = response.content.data.uuid
        App.tenant.messages = ['Inquilino editado com sucesso.']

        App.getTenant()
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

    deleteTenant: async () => {
      doLog('deleteTenant()')

      try {
        App.tenant.loading = true

        const response = (await axios({
          method: 'delete',
          url: `/api/v1/tenants/${tenantUuid}`
        })).data

        App.tenant.messages = ['Inquilino apagado com sucesso.']

        setTimeout(() => {
          window.location.href = '/app/tenants'
        }, 1000)
      } catch (error) {
        doLog("deleteTenant() error", error)

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