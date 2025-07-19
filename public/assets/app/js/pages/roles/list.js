mixins.push({
  data: {

    roles: {
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
          label: 'Nome',
          field: 'name',
          minWidth: 200,
          sortable: true,
          html: true,
          render: (value, row) => {
            return `
              <a href="/app/tenants/${tenantUuid}/roles/${row.uuid}">
                ${row.name}
              </a>
            `
          }
        },
        {
          label: 'Descrição',
          field: 'description',
          sortable: false,
        },
        {
          label: 'Criado em',
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
          label: 'Ativo',
          field: 'active',
          sortable: true,
          width: 100,
          align: 'center',
          nowrap: true,
          html: true,
          render: (value, row) => {
            return row.active
              ? `<span class='label label-success'>${'Ativo'}</span>`
              : `<span class='label label-danger'>${'Inativo'}</span>`
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
        App.getRoles()
      },
    },

  },
  methods: {

    getRoles: async () => {
      doLog('getRoles()')

      try {
        App.roles.loading = true

        const options = Object.assign(App.roles.initialOptions)

        const response = (await axios({
          method: 'get',
          url: `/api/v1/tenants/${tenantUuid}/roles`,
          params: options,
        })).data

        App.roles.meta = response.content.meta
        App.roles.list = response.content.data

        App.roles.loading = false
        App.roles.loaded = true
      } catch (error) {
        doLog("getRoles() error", error)
        notify('Ocorreu um erro interno. Por favor tenta novamente', 'danger')
      }

    },

  }
})