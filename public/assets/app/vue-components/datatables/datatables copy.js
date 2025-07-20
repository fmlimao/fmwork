Vue.component('datatables', {
  props: [
    'model',
  ],
  methods: {
    _eval: (col, row) => {
      if (typeof col.render === 'string') {
        return App[col.render](row[col.field], row)
      }

      if (typeof col.render === 'function') {
        return col.render(row[col.field], row)
      }
    },

    makePagination: (meta) => {
      const buttons = []

      buttons.push({
        label: '<span aria-hidden="true">&laquo;</span>',
        disabled: meta.currentPage === 1,
        active: false,
        page: meta.currentPage > 1 ? meta.currentPage - 1 : 1,
      })

      if (meta.pages <= 10) {
        for (let i = 1; i <= meta.pages; i++) {
          buttons.push({
            label: i,
            disabled: false,
            active: meta.currentPage === i,
            page: i,
          })
        }
      } else {
        /*

        1 : 1 2 3 4 5 ... 10 11
        2 : 1 2 3 4 5 ... 10 11
        3 : 1 2 3 4 5 ... 10 11
        4 : 1 2 3 4 5 ... 10 11
        5 : 1 2 ... 4 5 6 ... 10 11
        6 : 1 2 ... 5 6 7 ... 10 11
        7 : 1 2 ... 6 7 8 ... 10 11
        8 : 1 2 ... 7 8 9 10 11
        9 : 1 2 ... 7 8 9 10 11
        10 : 1 2 ... 7 8 9 10 11
        11 : 1 2 ... 7 8 9 10 11

        */

        if (meta.currentPage <= 4) {
          for (let i = 1; i <= 5; i++) {
            buttons.push({
              label: i,
              disabled: false,
              active: meta.currentPage === i,
              page: i,
            })
          }

          buttons.push({
            label: '...',
            disabled: true,
            active: false
          })

          for (let i = meta.pages - 1; i <= meta.pages; i++) {
            buttons.push({
              label: i,
              disabled: false,
              active: false,
              page: i,
            })
          }
        }
        else if (meta.currentPage >= meta.pages - 3) {
          for (let i = 1; i <= 2; i++) {
            buttons.push({
              label: i,
              disabled: false,
              active: false,
              page: i,
            })
          }

          buttons.push({
            label: '...',
            disabled: true,
            active: false
          })

          for (let i = meta.pages - 4; i <= meta.pages; i++) {
            buttons.push({
              label: i,
              disabled: false,
              active: meta.currentPage === i,
              page: i,
            })
          }
        }
        else {
          for (let i = 1; i <= 2; i++) {
            buttons.push({
              label: i,
              disabled: false,
              active: false,
              page: i,
            })
          }

          buttons.push({
            label: '...',
            disabled: true,
            active: false
          })

          for (let i = meta.currentPage - 1; i <= meta.currentPage + 1; i++) {
            buttons.push({
              label: i,
              disabled: false,
              active: meta.currentPage === i,
              page: i,
            })
          }

          buttons.push({
            label: '...',
            disabled: true,
            active: false
          })

          for (let i = meta.pages - 1; i <= meta.pages; i++) {
            buttons.push({
              label: i,
              disabled: false,
              active: false,
              page: i,
            })
          }
        }
      }

      buttons.push({
        label: '<span aria-hidden="true">&raquo;</span>',
        disabled: meta.currentPage === meta.pages,
        active: false,
        page: meta.currentPage < meta.pages ? meta.currentPage + 1 : meta.pages,
      })

      return buttons
    },

    handleChangePageOrSortlist: function (page, columnName) {
      if (!this.model.initialOptions.orderByColumnDefault) {
        this.model.initialOptions.orderByColumnDefault = this.model.initialOptions.orderByColumn
        this.model.initialOptions.orderByDirDefault = this.model.initialOptions.orderByDir
      }

      if (!page) page = this.model.meta.currentPage

      const options = {
        start: (page - 1) * this.model.meta.length,
      }

      if (columnName) {
        let column = this.model.initialOptions.orderByColumnDefault
        let dir = this.model.initialOptions.orderByDirDefault

        // Primeiro click na coluna
        if (columnName !== this.model.meta.orderBy.column) {
          column = columnName
          dir = 'ASC'
        }

        // Segundo click na coluna
        if (
          columnName === this.model.meta.orderBy.column
          && 'ASC' === this.model.meta.orderBy.dir
        ) {
          column = columnName
          dir = 'DESC'
        }

        // Terceiro click na coluna
        if (
          columnName === this.model.meta.orderBy.column
          && 'DESC' === this.model.meta.orderBy.dir
        ) {
          column = this.model.initialOptions.orderByColumnDefault
          dir = this.model.initialOptions.orderByDirDefault
        }

        options.orderByColumn = column
        options.orderByDir = dir
      } else {
        options.orderByColumn = this.model.meta.orderBy.column
        options.orderByDir = this.model.meta.orderBy.dir
        options.orderByColumn = options.orderByColumn
      }

      this.model.initialOptions.start = options.start
      this.model.initialOptions.orderByColumn = options.orderByColumn
      this.model.initialOptions.orderByDir = options.orderByDir

      this.model.getList()
    },

    handleHeaderClick: function (col) {
      this.handleChangePageOrSortlist(null, col.field)
    },

    handlePageChange: function (page) {
      this.handleChangePageOrSortlist(page)
    },
  },

  template: `
    <!-- Template -->
    <div class="vue-datatable">

      <div class="table-responsive" style="position: relative;" :class="{
        'minimal-height': model.list.length
      }">

        <table class="table table-striped">
          <thead>
            <tr>
              <th
                class="paginate-column nowrap"
                v-for="col in model.columns"
                :style="
                  ('width: ' + (col.width || 'auto') + 'px; ') +
                  (col.minWidth ? 'min-width: ' + col.minWidth + 'px; ' : '')
                "
                :class="{
                  'text-center': col.align === 'center',
                  'text-right': col.align === 'right',
                  'text-left': col.align === 'left',
                }"
                @click.prevent="handleHeaderClick(col)"
              >
                {{ col.label }}

                <span style="margin-left: 4px;" class="fa fa-sort-amount-asc" v-if="col.sortable && model.meta.orderBy.column === col.field && model.meta.orderBy.dir.toLowerCase() === 'asc'"></span>
                <span style="margin-left: 4px;" class="fa fa-sort-amount-desc" v-if="col.sortable && model.meta.orderBy.column === col.field && model.meta.orderBy.dir.toLowerCase() === 'desc'"></span>
                <span style="margin-left: 4px;" class="fa fa-sort-amount-asc text-muted" v-if="col.sortable && model.meta.orderBy.column !== col.field"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in model.list">

              <td
                v-for="col in model.columns"
                :class="{
                  'text-center': col.align === 'center',
                  'text-right': col.align === 'right',
                  'text-left': col.align === 'left',
                  'nowrap': col.nowrap,
                }"
              >

                <div v-if="col.field && !col.html && !col.render">{{ row[col.field] }}</div>

                <div v-if="!col.html && col.render">{{ _eval(col, row) }}</div>

                <div v-if="col.field && col.html && !col.render" v-html="row[col.field]" :class="{
                  'text-center': col.align === 'center',
                  'text-end': col.align === 'right',
                  'text-start': col.align === 'left',
                  'nowrap': col.nowrap,
                }"></div>

                <div v-if="col.html && col.render" v-html="_eval(col, row)" :class="{
                  'text-center': col.align === 'center',
                  'text-end': col.align === 'right',
                  'text-start': col.align === 'left',
                  'nowrap': col.nowrap,
                }"></div>

                <div v-if="col.buttons && Array.isArray(col.buttons)" class="buttons" :class="{
                  'text-center': col.align === 'center',
                  'text-end': col.align === 'right',
                  'text-start': col.align === 'left',
                  'nowrap': col.nowrap,
                }">
                  <button
                    v-for="btn in col.buttons"
                    :class="btn.class || ''"
                    :title="btn.title || ''"
                    @click.prevent="btn.click(row)"
                    v-html="btn.label"
                  >
                  </button>
                </div>

              </td>

            </tr>
          </tbody>
        </table>

        <div v-if="model.loading" class="loading">Carregando...</div>
      </div>

      <!-- .box-footer -->
      <div class="box-footer">
        <div class="row">
          <div class="col-xs-12 col-md-4">
            <p style="line-height: 34px;">
              <span class="text-muted" v-if="model.meta.filteredCount == model.meta.totalCount">Mostrando de {{ model.meta.start + 1 }} até {{ model.meta.start + model.list.length }} de {{ model.meta.totalCount }}</span>
              <span class="text-muted" v-else>Mostrando de {{ model.meta.start + 1 }} até {{ model.meta.start + model.list.length }} de {{ model.meta.filteredCount }} (filtrados de {{ model.meta.totalCount }})</span>
            </p>
          </div>

          <div class="col-xs-12 col-sm-8 text-end">
            <nav>
              <ul class="pagination no-margin pull-right" style="margin-top: 0;">
                <li v-for="b in makePagination(model.meta)" :class="{
                  'active': b.active,
                  'disabled': b.disabled,
                  'enabled': !b.disabled
                }" class="page-item">
                  <a href="#" @click.prevent="b.page ? handlePageChange(b.page) : false;"
                    v-html="b.label" :disabled="b.disabled" class="page-link"></a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <!-- /.row -->
      </div>
      <!-- /.box-footer -->

    </div>
    <!-- /Template -->
  `,
})
