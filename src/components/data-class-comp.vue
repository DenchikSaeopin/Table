<template>
  <v-dialog v-model="ComponentDialog" :persistent="persistent">
    <template v-slot:activator="{on, attrs}">
      <v-text-field :value="value" :label="label" :disabled="disabled" readonly v-bind="{ ...attrs, ...$attrs}" v-on="on" @click="destroy_comp = true">
      </v-text-field>
    </template> 
    
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{data_class.ClassCaption}}</v-toolbar-title>           
      </v-toolbar> 
     
      <table-class v-if="destroy_comp" :dataClass="data_class" :data="dataset" :selected_rows="selected_rows" :highlighted_row_index="highlighted_row_index">
        <template v-slot:default="{ selected }">        
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">  
              <v-btn :disabled="(IsMultiSelect == false && selected.length != 1) || (AllowBlank == false && selected.length == 0)"
                v-bind="attrs" v-on="on" 
                icon x-small fab
                @click="save(selected)"
                autofocus 
              >
                <v-icon>mdi-content-save</v-icon>   
              </v-btn>
            </template>
            <span>Сохранить</span>
          </v-tooltip> 

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">  
              <v-btn :disabled="AllowBlank == false" 
                v-bind="attrs" v-on="on" 
                icon x-small fab
                @click="save_empty()" 
              >
                <v-icon>mdi-content-save-outline</v-icon>   
              </v-btn>
            </template>
            <span>Сохранить пустой выбор</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :disabled="AllowBlank == false && selected.length == 0" 
                v-bind="attrs" 
                v-on="on" 
                icon x-small fab
                @click="close_dialog()" 
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Закрыть</span>
          </v-tooltip>  
        </template>  
      </table-class>

    </v-card>
  </v-dialog>
</template>

<script>
import service from "/service";

export default {
  name: 'DataClassComp',
  components: {
    TableClass: () => import("./Table") 
  },

  props: {
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    class_name: {
      type: String,
      required: true
    },
    comboObj_class: {
      type: Object,
      required: true
    },
    LookupKeyFieldName: {
      type: String,
      required: true
    },
    LookupResultFieldName: {
      type: String,
      required: true
    }, 
    IsMultiSelect: {
      type: Boolean,
      required: true    
    },
    AllowBlank: {
      type: Boolean,
      required: true      
    },
    UseConstrain: {
      type: Boolean,
      required: true
    }  
  },
  
  data() {
    return {
      data_class: {},
      dataset: [],
      
      nameText: Object.keys(this.comboObj_class)[0], // отображение
      keyFieldName: Object.keys(this.comboObj_class)[1], // значение

      ComponentDialog: false,
      persistent: true,
      
      selected_rows: [],
      comboObj_class_new: this.comboObj_class,

      highlighted_row_index: 0,

      destroy_comp: true
    }
  },
 
  created() {
    let class_obj = service(this.class_name)
    
    this.data_class = Object.assign({}, class_obj.data_class)
    this.dataset = class_obj.dataset

    if(this.comboObj_class != {}) { 
      this.dataset.forEach((item) => {
        if(item[this.keyFieldName] == this.comboObj_class[this.nameText]) {
          this.selected_rows.push(item)
        } 
      })
    }

    let id = this.data_class.PrimaryKeyList  // вспомогательное значение

    this.highlighted_row_index = this.selected_rows[0][id] - 1; 
   
    if(this.UseConstrain == true) {
      this.dataset = this.dataset.filter(row => JSON.stringify(row) != JSON.stringify(this.selected_rows[0]))
      this.selected_rows = []
      this.highlighted_row_index = 0
    }
  },

  methods: {
    save(selected) {
      if(selected.length == 1) {
        this.comboObj_class_new[this.keyFieldName] = selected[0][this.LookupKeyFieldName] // значение
        this.comboObj_class_new[this.nameText] = selected[0][this.LookupResultFieldName] // отображение

        this.$emit('change', this.comboObj_class_new) // один объект
        this.ComponentDialog = false
              
      } else {
        let arr_obj = []

        selected.forEach(item => {
          let obj_arr = {}
          
          obj_arr[this.nameText] = item[this.LookupResultFieldName]
          obj_arr[this.keyFieldName] = item[this.LookupKeyFieldName]
          
          arr_obj.push(obj_arr)
        })
        this.$emit('change', arr_obj)
        this.ComponentDialog = false
      }

      this.selected_rows = JSON.parse(JSON.stringify(selected)) // selected_rows = selected

      this.destroy_comp = false
    },

    save_empty() {
      this.comboObj_class_new[this.keyFieldName] = null
      this.comboObj_class_new[this.nameText] = null

      this.$emit('change', this.comboObj_class_new)
      this.ComponentDialog = false 

      this.destroy_comp = false
    },

     close_dialog() {
      this.ComponentDialog = false
      this.destroy_comp = false
    }

  },
  
  computed: {
    value() {
      if(this.selected_rows.length == 1 || this.selected_rows.length == 0) {
        return this.comboObj_class[this.nameText]
      } else
        return `${this.selected_rows[0][this.LookupResultFieldName]} + еще ${this.selected_rows.length - 1} строки`
      }
  }
}
</script>

<style scoped>
  button {
    border: 0px;
  }

</style>