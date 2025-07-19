mixins.push({
  data: {
    role: {
      loading: true,
      loaded: false,
      error: true,
      messages: ['role error'],
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

      }
    }

  },
  methods: {
    init: () => {
      clearFormErrors(App.role)

      for (const field in App.role.fields) {
        App.role.fields[field].value = ''
      }

      App.role.loading = false
      App.role.loaded = true
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

      if (error) {
        App.tenant.error = true
        App.tenant.messages.push('Verifique todos os campos.')
        return
      }

      try {
        App.role.loading = true

        const response = (await axios({
          method: 'post',
          url: `/api/v1/tenants/${tenantUuid}/roles`,
          data: {
            name: App.role.fields.name.value,
            description: App.role.fields.description.value,
          }
        })).data

        const uuid = response.content.data.uuid
        App.role.messages = ['Papel criado com sucesso.']
        notify('Papel criado com sucesso.', 'success')

        setTimeout(() => {
          window.location.href = '/app/tenants/' + tenantUuid + '/roles/' + uuid
        }, 1000)
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
  }
})