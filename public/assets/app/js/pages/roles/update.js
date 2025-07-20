mixins.push({
  data: {
    role: {
      loading: true,
      loaded: false,
      error: false,
      messages: [],
      delete: false,
      fields: {
        uuid: {
          error: false,
          messages: [],
          value: ''
        },
        createdAt: {
          error: false,
          messages: [],
          value: ''
        },
        updatedAt: {
          error: false,
          messages: [],
          value: ''
        },
        name: {
          error: false,
          messages: [],
          value: ''
        },
        description: {
          error: false,
          messages: [],
          value: ''
        },
        active: {
          error: false,
          messages: [],
          value: ''
        },

      }
    },

  },
  methods: {
    init: () => {
      App.getRole()
    },

    getRole: async () => {
      doLog('getRole()')

      try {
        clearFormErrors(App.role)

        for (const field in App.role.fields) {
          App.role.fields[field].value = ''
        }

        App.role.loading = true

        const response = (await axios({
          method: 'get',
          url: `/api/v1/tenants/${tenantUuid}/roles/${roleUuid}`,
        })).data

        App.role.fields.name.value = response.content.data.name
        App.role.fields.description.value = response.content.data.description
        App.role.fields.active.value = response.content.data.active
        App.role.fields.createdAt.value = response.content.data.createdAt
        App.role.fields.updatedAt.value = response.content.data.updatedAt
        App.role.fields.uuid.value = response.content.data.uuid

        App.role.loading = false
        App.role.loaded = true
      } catch (error) {
        doLog("getRole() error", error)
        // notify('Ocorreu um erro interno. Por favor tenta novamente', 'danger')

        if (isAxiosError(error) && isApiError(error)) {
          const response = error.response.data
          console.log('error response', response)

          if (response.code === 404) {
            App.role.error = true
            App.role.messages.push('Papel não encontrado.')
            return
          }

          formPopulate(App.role, response)
        } else {
          notify('Ocorreu um erro interno. Por favor tenta novamente', 'danger')
          App.role.error = true
          App.role.messages.push('Ocorreu um erro interno. Por favor tenta novamente')
        }
      }
    },

    saveRole: async () => {
      doLog('saveRole()')

      clearFormErrors(App.role)

      let error = false

      if (!App.role.fields.name.value) {
        App.role.fields.name.error = true
        App.role.fields.name.messages.push('Campo obrigatório.')
        error = true
      }

      if (!App.role.fields.description.value) {
        App.role.fields.description.error = true
        App.role.fields.description.messages.push('Campo obrigatório.')
        error = true
      }

      if (!App.role.fields.active.value) {
        App.role.fields.active.error = true
        App.role.fields.active.messages.push('Campo obrigatório.')
        error = true
      }

      if (error) {
        App.role.error = true
        App.role.messages.push('Verifique todos os campos.')
        return
      }

      try {
        App.role.loading = true

        const response = (await axios({
          method: 'put',
          url: `/api/v1/tenants/${tenantUuid}/roles/${roleUuid}`,
          data: {
            name: App.role.fields.name.value,
            description: App.role.fields.description.value,
            active: App.role.fields.active.value,
          }
        })).data

        App.getRole()

        App.role.messages = ['Papel editado com sucesso.']

      } catch (error) {
        doLog("saveRole() error", error)

        if (isAxiosError(error) && isApiError(error)) {
          const response = error.response.data
          formPopulate(App.role, response)
        } else {
          notify('Ocorreu um erro interno. Por favor tenta novamente', 'danger')
          App.role.error = true
          App.role.messages.push('Ocorreu um erro interno. Por favor tenta novamente')
        }
      } finally {
        App.role.loading = false
      }
    },

    deleteRole: async () => {
      doLog('deleteRole()')

      try {
        App.role.loading = true

        const response = (await axios({
          method: 'delete',
          url: `/api/v1/tenants/${tenantUuid}/roles/${roleUuid}`
        })).data

        App.role.messages = ['Papel apagado com sucesso.']

        setTimeout(() => {
          window.location.href = '/app/tenants/' + tenantUuid
        }, 1000)
      } catch (error) {
        doLog("deleteRole() error", error)

        if (isAxiosError(error) && isApiError(error)) {
          const response = error.response.data
          formPopulate(App.role, response)
        } else {
          notify('Ocorreu um erro interno. Por favor tenta novamente', 'danger')
          App.role.error = true
          App.role.messages.push('Ocorreu um erro interno. Por favor tenta novamente')
        }
      } finally {
        App.role.loading = false
      }
    },
  }
})