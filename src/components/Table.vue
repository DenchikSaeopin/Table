<!-- [x] Доработать функционал кнопки "Закрыть", чтобы при ее нажатии не сохранялись ранее выбранные несохраненные строки при переоткрытии окна -->
<!-- [x] Доработать функционал кнопки "Сохранить", чтобы при ее самом 1ом нажатии не отображалось "Исходное значение + число строк" -->
<!-- [x] Копирование - открытие диал окна и сохр 1 скопир строки -->
<!-- [x] Duplicated keys warn при сохранении нескольких выборов при isMultiselect = true -->
<!-- [?] При сохранении пустого выбора не появляются все строки (+та которая была выбрана заранее и скрыта) -->
<!-- [ ] Работа клавиатурой -->

<template>
  <div>
    <v-toolbar flat dense>
      <v-btn-toggle>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click="void(0)" v-bind="attrs" v-on="on" icon x-small fab>
              <v-icon>mdi-database-refresh</v-icon>
            </v-btn>
          </template>
          <span>Обновить данные таблицы</span>
        </v-tooltip>        
      </v-btn-toggle>
      
      <v-divider class="mx-4" vertical></v-divider>

      <v-btn-toggle>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="!dif_columns.length" v-bind="attrs" v-on="on" @click="show_all_col" icon x-small fab> 
              <v-icon>mdi-eye-outline</v-icon>
            </v-btn>
          </template>
          <span>Отобразить все скрытые поля</span>
        </v-tooltip>

        <v-menu offset-x transition="scale-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="!dif_columns.length" v-on="on" v-bind="attrs" icon x-small fab>
              <v-icon dense>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(col, key) in dif_columns" :key="key" @click="show_column(col.name)" > 
              <v-list-item-title>{{ col.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn-toggle>
      
      <v-divider class="mx-4" vertical></v-divider>
      
      <v-btn-toggle>
        <v-tooltip bottom> 
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click="dialog = true; destroy_comp = true" v-bind="attrs" v-on="on" icon x-small fab>
              <v-icon>mdi-table-row-plus-after</v-icon>
            </v-btn>
          </template>  
          <span>Добавить строку</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="!selected.length" v-bind="attrs" v-on="on" @click="delete_rows" icon x-small fab>
              <v-icon>mdi-table-row-remove</v-icon>
            </v-btn>
          </template>
          <span>Удалить выбранные строки</span>
        </v-tooltip>

        <v-tooltip bottom> 
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="selected.length != 1" @click="editItem" v-bind="attrs" v-on="on"  icon x-small fab>
              <v-icon>mdi-table-row</v-icon>
            </v-btn>
          </template>  
          <span>Изменить строку</span>
        </v-tooltip>

        <v-tooltip bottom> 
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="selected.length != 1" @click="copy" v-bind="attrs" v-on="on" icon x-small fab>
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>  
          <span>Копировать строку</span>
        </v-tooltip>

        <v-dialog v-model="dialog" max-width="500px">          
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">{{DialogTitle}}</v-card-title>
            <v-card-text>
              <v-container>
                <v-row> 
                  <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation                  
                  >
                    <row-edit
                      v-if="destroy_comp"
                      :dataset = "dataset"
                      :RowOper="RowOper" 
                      :ViewProperties="ViewProperties" 
                      :InvisibleColumns="InvisibleColumns" 
                      :editedIndex="editedIndex"
                      :PrimaryKeyList = "PrimaryKeyList"  
                    >
                    </row-edit>
                  </v-form>
                </v-row>
              </v-container>                    
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="cancel">
               Отмена
              </v-btn>
              <v-btn :disabled="!valid" color="primary" text @click="save">
               Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>          
      </v-btn-toggle>
      
      <v-divider class="mx-4" vertical></v-divider>
        
      <v-btn-toggle>
        <slot :selected="selected"></slot>
      </v-btn-toggle>
    
    </v-toolbar>

    <v-divider></v-divider>

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="filtered_dataset"
      :items-per-page="5"
      class="elevation-1"
      :item-class="row_class_select"
      @click:row="row_click"
    > 
  
    <!-- ФОРМАТИРОВАНИЕ ЗНАЧЕНИЙ -->
    <template v-for="slot in field_slots" v-slot:[slot.slot_name] = "{ item }">
      {{ slot.func(item[slot.field], slot.DisplayFormat, slot.PropType) }}     
    </template>

    <!-- CHECKBOX -->
    <template v-for="(check_item, key) in headers_checkbox" v-slot:[`item.${check_item.check_header}`] = "{ item }">
      <v-simple-checkbox
        :key="key"
        v-model="item[check_item.check_header]"
        disabled
      >
      </v-simple-checkbox>
    </template>  

      <!-- РАБОТА СО СТОЛБЦАМИ -->
      <template v-for="(col, key) in headers" v-slot:[`header.${col.value}`] = "{ header }"> 
        {{ header.text }}
          <v-menu :key="key" offset-x transition="scale-transition" :close-on-content-click="false" :ref="`menu_${col.value}`">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                icon
                v-bind="attrs"
                v-on="on" 
                class="btn_menu"  
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template> 

            <v-list class="menu">
              <v-list-item @click="hide_column(col.value, col.text)">                      
                <v-list-item-icon class="hide_col">
                  <v-icon dense>mdi-eye-off</v-icon>
                </v-list-item-icon>               
                <v-list-item-content>
                  <v-list-item-title>Скрыть</v-list-item-title>
                </v-list-item-content>
              </v-list-item> 

              <v-list-item v-if="Object.keys(filters).includes(col.value)">
                <v-list-item-icon class="filter_col">
                  <v-icon dense>mdi-filter</v-icon>
                </v-list-item-icon>  
                <v-list-item-content>
                  <v-text-field
                    v-model="filters[col.value]"
                    class="pa-4"
                    type="text"
                    label="Фильтр"
                    single-line
                    dense
                    style=""           
                  ></v-text-field>
                </v-list-item-content>                
              </v-list-item>           
            </v-list>      
          </v-menu>

          <v-btn 
            v-if="Object.keys(filters).includes(col.value) && filters[col.value] != '' "
            :key="key"               
            x-small
            icon
            @click="filters[col.value] = ''"
          >
            <v-icon>mdi-filter-off</v-icon>
          </v-btn> 
      </template>        
    </v-data-table>
  </div>
</template>

<script>
import RowEdit from './row-edit'

export default {
  name: "Table",
  components: { RowEdit },

  props: {
    dataClass: {
      type: Object,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    selected_rows: {
      type: Array,
      default: null
    },

    highlighted_row_index: {
      type: Number,
      default: -1
    }
  },

  data() {
    return {
      field_slots: [],
      filters: {},
      hiddenColumns: [],
      editedIndex: -1,
      headers_checkbox: [],
      RowOper: {},
      defaultItem: {},
      dialog: false,
      destroy_comp: false,
      valid: true,
      dataset: this.data,
      ViewProperties: this.dataClass.ViewProperties,
      QuickSearch: this.dataClass.QuickSearch,
      InvisibleColumns: this.dataClass.InvisibleColumns,
      DefaultValues: this.dataClass.DefaultValues,
      PrimaryKeyList: this.dataClass.PrimaryKeyList,
      selected: [], 
      selected_rows_id: [], 
      highlightIndex: -1,
      highlightIndex_init: -1,
      //selected_init: [] // сохранение исходного selected (его подсветка) после закрытия диалогового окна
    }
  },

  created() {
    for(let inv_col in this.InvisibleColumns.split(',')) {
      this.hiddenColumns.push({name: this.InvisibleColumns.split(',')[inv_col], text: this.InvisibleColumns.split(',')[inv_col]})      
    }
        
    this.ViewProperties.forEach ((item) => {
      for(let key in item) {
        if(item[key].DisplayFormat != "") {
          this.field_slots.push({slot_name: "item." + key, field: String(key), func: this.format_value, DisplayFormat: item[key].DisplayFormat, PropType: item[key].PropType})  
        }          
      }        
    })
    
    this.filters = this.get_filters();

    this.DefaultValues.forEach((item) => {   // создание дефолтного объекта типа: {name: '...', desc: '...', date: '...', salary: '...'}
      for(let key in item) {
        if(item[key].type == "bool") { item[key].value = !!item[key].value }
        
        this.RowOper[key] = item[key].value  
        this.defaultItem[key] = item[key].value                              
      }  
    })

    let count = 0
    this.ViewProperties.forEach(item => {
      for(let key in item) {
        if(item[key].PropType == "CHECKBOX") {
          this.headers_checkbox.push({"check_header": key, "number": count+=1})   
          this.dataset.forEach(row => {
            for(let key_ds in row) {
              if(key_ds == key) {
                row[key_ds] = !!row[key_ds]
              }
            }
          })   
        }          
      } 
    });
   
    if(this.selected_rows) {
      this.selected = JSON.parse(JSON.stringify(this.selected_rows))
      this.selected_rows.forEach(item => {this.selected_rows_id.push(item[this.PrimaryKeyList])}) 
    }

    if(this.highlighted_row_index) { this.highlightIndex = this.highlighted_row_index }
  },

  mounted() {
    document.addEventListener("keyup", this.KeyHandler);
  },

  destroyed () {
    document.removeEventListener("keyup", this.KeyHandler)
  },

  methods: {

    format_value(val, DisplayFormat, PropType) {
      
      if(val == "") {
        return val = "";
      }
      else {
        if(PropType == "DATE" || PropType == "DATETIME") {
          val = new Date(val) 

          let formatter = new Intl.DateTimeFormat('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          });  

          if(DisplayFormat == "DD-MM-YYYY") {          
            val = formatter.formatToParts(val).map(({type, value}) => { 
              switch (type) {
                case 'literal': return value = '-';
                default: return value;
              }
            }).reduce((string, part) => string + part); 
          }
      
          if(DisplayFormat == "YYYY-MM") {         
            val = formatter.formatToParts(val).map(({type, value}) => { 
              switch (type) {
                case 'literal': return value = '-';
                case 'day': return value = formatter.formatToParts(new Date(val)).find(val => val.type === 'year').value;
                case 'year': return value = '';
                default : return value;
              }
            }).reduce((string, part) => string + part);        
            val = val.slice(0,-1);
          }

          if(DisplayFormat == "DD-MM-YY") {        
            val = formatter.formatToParts(val).map(({type, value}) => {
              switch (type) {
                case 'literal': return value = '-';
                case 'year': return value.slice(0,-2);
                default : return value;
              }
            }).reduce((string, part) => string + part);                
          }        
        }

        // if(PropType == "DATETIME") {
          
        //   // let formatter = new Intl.DateTimeFormat('ru', {
        //   //   weekday: 'long',
        //   //   year: 'numeric',
        //   //   month: 'numeric',
        //   //   day: 'numeric',
        //   //   hour: 'numeric',
        //   //   minute: 'numeric',
        //   //   second: 'numeric',
        //   //   hour12: true,
        //   //   timeZone: 'UTC'
        //   // });      


        // }

        if(PropType == "SIMPLE") {
          if(DisplayFormat == "Salary") {
            val = new Intl.NumberFormat("ru", {style: "currency", currency: "RUB"}).format(val); 
          }        
        }
        
        return val;        
      }
    },

    get_filters() { //filters
      let obj = new Object
      let arr = new Array

      if(this.QuickSearch.length) {
        arr = this.QuickSearch.split(',')                 
      } else {
        for(let value in this.dataset[0]) {
          arr.push(value);          
        }           
      } 
      for(let val of arr) { 
        if(!(this.hiddenColumns.find(item => item.name == val))) { 
          obj[val] = "";  
        } 
      } 
      return obj;
    },

    hide_column(column, col_name) {
      this.$refs[`menu_${column}`][0].isActive = false;
      this.hiddenColumns.push({name: column, text: col_name})
    },

    show_column(name) {
      this.hiddenColumns.splice(this.hiddenColumns.findIndex(item => item.name == name), 1)         
    },

    show_all_col() {
      let arr_ic = [];
      
      for(let col in this.InvisibleColumns.split(',')) {
        arr_ic.push({name: this.InvisibleColumns.split(',')[col], text: this.InvisibleColumns.split(',')[col]})      
      }

      this.hiddenColumns = arr_ic;      
    },

    delete_rows() {
      this.dataset = this.dataset.filter(item => { return this.selected.indexOf(item) < 0 });
      this.selected = [];      
    },

    editItem() {      
      this.editedIndex = this.dataset.indexOf(this.selected[0])
      this.RowOper = Object.assign({}, this.selected[0])
      this.destroy_comp = true
      this.dialog = true

      this.highlightIndex_init = this.highlightIndex
      //this.selected_init = JSON.parse(JSON.stringify(this.selected)) // сохранение исходного selected (его подсветка) после закрытия диалогового окна
    },

    cancel() {
      this.destroy_comp = false
      this.dialog = false
      this.$nextTick(() => { // execute a function after the data has been set and the DOM has updated.
        this.RowOper = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() { 
      if(this.$refs.form.validate()) {
        if (this.editedIndex > -1) {  
          Object.assign(this.dataset[this.editedIndex], this.RowOper)
        } else {
          this.RowOper[this.PrimaryKeyList] = this.dataset.length + 1
          this.dataset.push(this.RowOper) 
        }
        this.cancel()
        
        this.selected = [] // сохранение исходного selected (его подсветка) после закрытия диалогового окна

        this.highlightIndex = this.highlightIndex_init
        this.selected_rows_id.splice(0, this.selected_rows_id.length, this.highlightIndex_init)
        
        this.destroy_comp = false;
      }
    },

    copy() { 
      this.destroy_comp = true
      this.dialog = true

      this.RowOper = Object.assign({}, this.selected[0])
      this.RowOper[this.PrimaryKeyList] = this.dataset.length + 1
          
    },

    KeyHandler() {
      if (event.keyCode == 37 && this.highlightIndex > -1) {
        this.highlightIndex -= 1 
      } else if (event.keyCode == 39 && this.highlightIndex < this.dataset.length - 1) {
        this.highlightIndex += 1
      } else if(event.keyCode == 32 && this.highlightIndex != -1) {

        const id = this.highlightIndex + 1
        const row_num = this.selected_rows_id.indexOf(id)

        if(row_num == -1) {
          this.selected_rows_id.push(id)
          this.selected.push(this.dataset[this.highlightIndex])
        } else {
          this.selected_rows_id.splice(row_num, 1)
          this.selected.splice(this.selected.findIndex(str => JSON.stringify(str) == JSON.stringify(this.dataset[this.highlightIndex])), 1)
        } 
      }
    },

    row_click(item) {
      const id = item[this.PrimaryKeyList] //вспомогательное значение
      const row_num = this.selected_rows_id.indexOf(id)

      if(row_num == -1) {
        this.selected_rows_id.push(id)
        this.selected.push(item)
        this.highlightIndex = id - 1
      } else {
        this.selected_rows_id.splice(row_num, 1)
        this.selected.splice(this.selected.findIndex(str => JSON.stringify(str) == JSON.stringify(item)), 1)
      }
    },

    row_class_select(item) {
      if(this.dataset.findIndex(str => JSON.stringify(str) == JSON.stringify(item)) === this.highlightIndex) {  //  БЫЛО - if(item[this.PrimaryKeyList] === this.highlightIndex)
        return "row_highlighted"
      }           
    }
  },

  computed: {  
    headers() {
      let result = [];
                 
      for (let value in this.dataset[0]) {
        if (!(this.hiddenColumns.find(item => item.name == value))) {
          this.ViewProperties.forEach ((item) => {
            for(let key in item) {
              if(key == value) {                
                result.push({ 
                  text: item[key].Name, 
                  value: value, 
                  align: item[key].Align ? item[key].Align : "left", 
                  sortable: String(item[key].Sortable) == "false" ? item[key].Sortable : true 
                }) 
              }
            }        
          })                                             
        }
      }
      return result;
    },

    filtered_dataset() {
      return this.dataset.filter((item) => {
        let result = true;
        
        for(let field in this.filters) {         
          if(this.filters[field]) {
            result = result && item[field].toString().toLowerCase().includes(this.filters[field].toLowerCase())
          }
        }             
        return result     
      })
    },

    dif_columns() { //выпадающий список скрытых колонок не считая InvisibleColumns
      return this.hiddenColumns.filter(column => !this.InvisibleColumns.split(',').includes(column.name))
    },

    DialogTitle() {
      return this.editedIndex === -1 ? 'Новая строка' : 'Изменение строки'
    },    
  }, 

  watch: {
    dialog(val) {
      val || this.cancel()
    }
  }


}
</script>

<style scoped>
  .v-list-item {
    min-height: 30px;
    padding: 0 10px
  }
  
  .v-list {
    padding: 2px
  }
  
  button {
    border: 0px;
  }

  .show-btns {
    color: #0b0c0c !important;
  }

  .btn_menu {
    opacity: 0;
    float: left;
  }

  .v-btn--round {
    border-radius: 10%;
  }
 
  th:hover .btn_menu  {
    opacity: 1 !important;
  }

  .v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child { 
    margin-right: 10px;
  }
 
  .v-list-item__content {
    padding: 0px
  } 

  .v-application .pa-4 {
    padding: 0px !important;
  } 

  .menu .hide_col {
    margin-top: 5px;
    margin-bottom: 4px
  } 

  .menu .filter_col {
    margin-top: 10px; 
    margin-bottom: 0px   
  }

</style>

<style>
  tr.v-data-table__selected {
    background: #a4ebf0 !important;
  }
  
  .row_highlighted {
    background-color:rgb(236, 235, 235)
  }

  /* .row_selected {
    background-color:rgb(117, 228, 228) 
  } */
</style>