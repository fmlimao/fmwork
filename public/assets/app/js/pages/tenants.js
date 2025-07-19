mixins.push({
  data: {
    tenants: {
      loading: true,
      loaded: false,
      list: [],
      meta: {
        totalCount: 0,
        filteredCount: 0,
        start: 0,
        length: 10,
        pages: 0,
        currentPage: 0,
        orderBy: {
          column: 'name',
          dir: "ASC"
        }
      },
      initialOptions: {
        start: 0,
        length: 10,
        orderByColumn: 'name',
        orderByDir: 'ASC',
      },
      columns: [
        {
          label: locale['app.tenant.Nome'],
          field: 'name',
          minWidth: 200,
          sortable: true,
          html: true,
          render: (value, row) => {
            return `
              <a href="#" onclick="App.tenantSelect(event, '${row.uuid}');">
                ${row.name}
              </a>
            `
          }
        },
        {
          label: locale['app.tenant.Descrição'],
          field: 'description',
          sortable: false,
        },
        {
          label: locale['app.tenant.Título'],
          field: 'appTitle',
          sortable: false,
          width: 200,
        },
        {
          label: locale['app.tenant.Título curto'],
          field: 'appShortTitle',
          sortable: false,
          width: 200,
        },
        {
          label: locale['app.tenant.Criado em'],
          field: 'createdAt',
          sortable: true,
          width: 200,
          align: 'center',
          nowrap: true,
          html: true,
          render: (value, row) => {
            return datimeFormatDefault(row.createdAt, 'DD/MM/YYYY HH:mm:ss')
          }
        },
        {
          label: locale['app.tenant.Ativo'],
          field: 'active',
          sortable: true,
          width: 100,
          align: 'center',
          nowrap: true,
          html: true,
          render: (value, row) => {
            return row.active
              ? `<span class='label label-success'>${locale['app.tenant.Ativo']}</span>`
              : `<span class='label label-danger'>${locale['app.tenant.Inativo']}</span>`
          }
        },
        // {
        //   label: 'Ações',
        //   sortable: false,
        //   width: 120,
        //   nowrap: true,
        //   html: true,
        //   buttons: [
        //     {
        //       label: '<span class="fa fa-pencil"></span>',
        //       class: 'btn btn-outline-default btn-sm btn-flat',
        //       click: (row) => window.location.href = `/app/clients/${row._id}`
        //     },
        //     {
        //       label: '<span class="fa fa-trash"></span>',
        //       class: 'btn btn-outline-danger btn-sm btn-flat',
        //       click: (row) => App.deleteClient(row._id)
        //     }
        //   ]
        // },
      ],
      getList: () => {
        App.getTenants()
      },
    },

    tenant: {
      loading: true,
      error: true,
      messages: ['tenant error'],
      delete: false,
      fields: {
        uuid: {
          error: true,
          messages: ['uuid error'],
          value: 'uuid value'
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
    }

  },
  methods: {
    init: () => {
      App.getTenants()
    },

    getTenants: async () => {
      doLog('getTenants()')

      try {
        App.tenants.loading = true

        const options = Object.assign(App.tenants.initialOptions)

        const response = (await axios({
          method: 'get',
          url: '/api/v1/tenants',
          params: options,
        })).data

        App.tenants.meta = response.content.meta
        App.tenants.list = response.content.data

        App.tenants.loading = false
        App.tenants.loaded = true
      } catch (error) {
        doLog("getTenants() error", error)
        notify(locale['app.error.Ocorreu um erro interno. Por favor tenta novamente'], 'danger')
      }

    },

    tenantSelect: (event, uuid) => {
      doLog('tenantSelect()', uuid)

      if (event) event.preventDefault()

      // Vamos buscar o projeto
      const tenant = App.tenants.list.find(tenant => tenant.uuid === uuid)

      if (!tenant) {
        return
      }

      App.tenant.delete = false

      // Vamos preencher o formulario
      App.tenant.fields.uuid.value = tenant.uuid
      App.tenant.fields.name.value = tenant.name
      App.tenant.fields.description.value = tenant.description
      App.tenant.fields.appTitle.value = tenant.appTitle
      App.tenant.fields.appShortTitle.value = tenant.appShortTitle
      App.tenant.fields.active.value = tenant.active

      App.openNewTenantModal()
    },

    clearTenant: () => {
      clearFormErrors(App.tenant)

      App.tenant.loading = false

      for (const field in App.tenant.fields) {
        App.tenant.fields[field].value = ''
      }
    },

    cancelTenant: () => {
      doLog('cancelTenant()')

      clearFormErrors(App.tenant)

      for (const field in App.tenant.fields) {
        App.tenant.fields[field].value = ''
      }

      App.closeNewTenantModal()
    },

    saveTenant: async () => {
      doLog('saveTenant()')

      clearFormErrors(App.tenant)

      let error = false

      if (!App.tenant.fields.name.value) {
        App.tenant.fields.name.error = true
        App.tenant.fields.name.messages.push(locale['validator.Campo obrigatório.'])
        error = true
      }

      if (!App.tenant.fields.appTitle.value) {
        App.tenant.fields.appTitle.error = true
        App.tenant.fields.appTitle.messages.push(locale['validator.Campo obrigatório.'])
        error = true
      }

      if (!App.tenant.fields.appShortTitle.value) {
        App.tenant.fields.appShortTitle.error = true
        App.tenant.fields.appShortTitle.messages.push(locale['validator.Campo obrigatório.'])
        error = true
      }

      if (error) {
        App.tenant.error = true
        App.tenant.messages.push(locale['validator.Verifique todos os campos.'])
        return
      }

      try {
        App.tenant.loading = true

        let uuid = App.tenant.fields.uuid.value

        let response = null

        if (!uuid) {
          response = (await axios({
            method: 'post',
            url: '/api/v1/tenants',
            data: {
              name: App.tenant.fields.name.value,
              description: App.tenant.fields.description.value,
              appTitle: App.tenant.fields.appTitle.value,
              appShortTitle: App.tenant.fields.appShortTitle.value
            }
          })).data

          uuid = response.content.data.uuid
          formPopulate(App.tenant, response)
          App.tenant.messages = [locale['app.tenant.Inquilino criado com sucesso.']]
          notify(locale['app.tenant.Inquilino criado com sucesso.'], 'success')

          setTimeout(() => {
            App.tenantSelect(null, uuid)
          }, 1000)
        } else {
          response = (await axios({
            method: 'put',
            url: `/api/v1/tenants/${uuid}`,
            data: {
              name: App.tenant.fields.name.value,
              description: App.tenant.fields.description.value,
              appTitle: App.tenant.fields.appTitle.value,
              appShortTitle: App.tenant.fields.appShortTitle.value,
              active: App.tenant.fields.active.value
            }
          })).data
          formPopulate(App.tenant, response)
          App.tenant.messages = [locale['app.tenant.Inquilino atualizado com sucesso.']]
          notify(locale['app.tenant.Inquilino atualizado com sucesso.'], 'success')
        }

        await App.getTenants()
      } catch (error) {
        doLog("saveTenant() error", error)

        if (isAxiosError(error) && isApiError(error)) {
          const response = error.response.data
          formPopulate(App.tenant, response)
        } else {
          notify(locale['app.error.Ocorreu um erro interno. Por favor tenta novamente'], 'danger')
          App.tenant.error = true
          App.tenant.messages.push(locale['app.error.Ocorreu um erro interno. Por favor tenta novamente'])
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
          url: `/api/v1/tenants/${App.tenant.fields.uuid.value}`
        })).data

        formPopulate(App.tenant, response)
        App.tenant.messages = [locale['app.tenant.Inquilino apagado com sucesso.']]
        notify(locale['app.tenant.Inquilino apagado com sucesso.'], 'success')

        setTimeout(() => {
          App.cancelTenant()
          App.closeNewTenantModal()
        }, 1000)

        await App.getTenants()
      } catch (error) {
        doLog("deleteTenant() error", error)

        if (isAxiosError(error) && isApiError(error)) {
          const response = error.response.data
          formPopulate(App.tenant, response)
        } else {
          notify(locale['app.error.Ocorreu um erro interno. Por favor tenta novamente'], 'danger')
          App.tenant.error = true
          App.tenant.messages.push(locale['app.error.Ocorreu um erro interno. Por favor tenta novamente'])
        }
      } finally {
        App.tenant.loading = false
      }
    },

    openNewTenantModal: (clearValues = false) => {
      clearFormErrors(App.tenant)

      App.tenant.loading = false

      if (clearValues) {
        for (const field in App.tenant.fields) {
          App.tenant.fields[field].value = ''
        }
      }

      $('#newTenantModal').modal('show')
    },

    closeNewTenantModal: () => {
      $('#newTenantModal').modal('hide')
    },
  }
})