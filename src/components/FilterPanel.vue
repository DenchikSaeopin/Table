<template>
  <div>
    <v-toolbar dense flat>
      <v-toolbar-items>
        <v-text-field label="Поиск" prepend-inner-icon="mdi-magnify" v-model="search"></v-text-field>
      </v-toolbar-items>
      
      <v-spacer></v-spacer>
      
      <v-btn-toggle>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="load_in_table" v-bind="attrs" v-on="on" icon x-small fab>
                <v-icon>mdi-application-export</v-icon>
              </v-btn>
            </template>
          <span>Отобразить данные в таблице</span>
        </v-tooltip>   
      </v-btn-toggle>
    </v-toolbar>
 
    <v-divider></v-divider>
      
    <v-data-table
      v-model="selected"
      show-select
      :item-key="PrimaryKeyList"
      :headers="headers"
      :items="items"
      :group-by="groupable_col"
      class="elevation-1"
      show-group-by
      dense
      ref="table"
      :search="search"
      :items-per-page="10"
    >
    <!-- disable-pagination -->
      <template v-slot:group.header="{groupBy, group, isOpen, toggle}">
        <th colspan="4">
          <v-checkbox :label="`${customGroupNames[groupBy[0]]} : ${group}`" :value="group" v-model="selected_NODEs"></v-checkbox>
          <v-icon @click="toggle">{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
        </th>
      </template>
    </v-data-table>

  </div>
</template>

<script>
export default {

  props: {
    dataClass: {
      type: Object,
      required: true
    },
    data: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      ViewProperties: this.dataClass.ViewProperties,
      PrimaryKeyList: this.dataClass.PrimaryKeyList,
      groupable_col: '',
      selected: [],
      selected_NODEs: [],
      selected_NODEs_old: [],
      search: ''
    }
    
  },
  
  mounted() {
    let table = this.$refs.table;
    let keys = Object.keys(table.$vnode.componentInstance.openCache);
    
    keys.forEach(x => {
      table.$vnode.componentInstance.openCache[x] = false;
    })
  },
  
  computed: {

    items() {
      //нахождение параметра для groupable

      this.ViewProperties.forEach(item => {
        for(let key in item) {
          if(item[key].PropType == "TREE") {
            this.groupable_col = key  
          }
        }
      }) // groupable_col = "NODE_NAME"
       
      // создание массива с отображаемыми столбцами
      let arr_col = new Array
      
      this.ViewProperties.forEach(item => {
        for(let key in item) {
          arr_col.push(key)
        }
      }) 
      arr_col.push(this.PrimaryKeyList) // ["NODE_NAME", "SIGN", "PATH/id"]
      
      //наполнение items (items_arr)   
      let items_arr = []
      
      this.data.forEach(item => {       
        for(let key in item) {   
          if(typeof item[key] == 'object') {                   
            item[key].forEach(item_int => {
              let obj = {}
              for(let key_int in item_int) {
                if(key_int == this.groupable_col) {
                  obj['name'] = item_int[key_int]
                } else if(arr_col.find(col => col == key_int)) {
                  obj[key_int] = item_int[key_int]
                }                
              }
            obj[this.groupable_col] = item[this.groupable_col]
            items_arr.push(obj)
            })             
          }       
        }        
      })
    
      return items_arr 
    },

    customGroupNames() {
      let customGroupNames = new Object

      this.ViewProperties.forEach(item => {
        for(let key in item) {
          if(item[key].PropType == "TREE") {
            customGroupNames[key] = item[key].Name
          }    
        }
      })

      return customGroupNames
    },

    headers() {
      let result = [];
      result.push({ text: "Название", value: 'name', groupable: false}) // нужна ли эта строка(?)

      for(let value in this.data[0]) {
        this.ViewProperties.forEach(item => {
          for(let key in item) {
            if(key == value) {
              result.push({
                text: item[key].Name, 
                value: value,
                groupable: item[key].PropType == "TREE" ? true : false,
              })
            } 
          }
        })
      }

      return result
    },
  },

  methods: {

    load_in_table() {
      let item_arr = []
      let ID_arr = []

      this.selected.forEach(item => {
        for(let key in item) {
          if(key == this.PrimaryKeyList) {
            ID_arr.push(item[key])
          }
        }
      })

      this.data.forEach(item => {
        for(let key in item) {
          if(typeof item[key] == 'object') {
            item[key].forEach(item_int => {
              if(ID_arr.includes(item_int[this.PrimaryKeyList])) {
                item_arr.push(item_int)
              }
            })
          }
        }
      })

      alert('Загружено')
    }
  },

  watch: {

    selected_NODEs(node_new, node_old) {   

      console.log('node_old',node_old)
      console.log('node_new',node_new)

      this.selected_NODEs_old = node_old 
      
      if(node_old.length == node_new.length + 1) { // удаление соотв. группы из 'selected_NODEs'   
        let dif = node_old.filter(x => !node_new.includes(x))[0] 
        
        this.selected = this.selected.filter(item => { return !Object.values(item).includes(dif) } )
      } 
      
      else if (node_new.length == node_old.length + 1) { // добавление соотв. группы в 'selected_NODEs' 
      
      console.log('node_new.length == node_old.length + 1')
       
        this.items.forEach(item => { //было: items_arr
          if(Object.values(item).includes(node_new.at(-1))) {
            this.selected.push(item)
          }
        })

      } 
    },
    
    selected(selected_new, selected_old) {  

      // console.log('selected_old',selected_old)
      // console.log('selected_new',selected_new)
      
      if(selected_old.length > selected_new.length) { // снятие строки и изменение selected_NODEs 
        
        if(selected_new.length == 0) {this.selected_NODEs = []} // deselect все
        
        else { // убрана 1 строка и если надо убирается соотв. группа в selected_NODEs 
          let dif_NODE = selected_old.filter(x => !selected_new.includes(x))[0][this.groupable_col]   
          let arr_NODEs = []
          selected_new.forEach(item => { arr_NODEs.push(item[this.groupable_col]) })
        
          if(!arr_NODEs.includes(dif_NODE)) { 
            this.selected_NODEs = this.selected_NODEs.filter(item => item != dif_NODE)
          } 
        }
      }
      
      else if(selected_new.length > selected_old.length) { // добавлена строка и если надо добавляется соотв. группа в selected_NODEs      
       
        if(selected_new.length == selected_old.length + 1) {
          if(!this.selected_NODEs.includes(selected_new.at(-1)[this.groupable_col])) {
            this.selected_NODEs.push(selected_new.at(-1)[this.groupable_col])     
          } 
        }
        
        else { // select all 
          let arr_temp = []
          selected_new.forEach(item => {arr_temp.push(item[this.groupable_col])})  // добавляются только те что отображены (см. Rows per page)     
          
          this.selected_NODEs = Array.from(new Set(arr_temp))          
        }
      }      
    },

    search() {
      this.selected_NODEs.splice(0, this.selected_NODEs.length)

      //this.selected_NODEs = this.selected_NODEs_old

      console.log('search() nodes',this.selected_NODEs)
    }
  }
}
</script>

