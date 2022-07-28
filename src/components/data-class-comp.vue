<template >
  <v-dialog v-model="ComponentDialog" :persistent="persistent">
    <template v-slot:activator="{on ,attrs}">
      <v-text-field :value="value" :label="label" :disabled="disabled" 
        readonly v-bind="{ ...attrs, ...$attrs}" v-on="on">
      </v-text-field>
    </template> 
    
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{data_class.ClassCaption}}</v-toolbar-title>           
      </v-toolbar> 
     
      <table-class :dataClass="data_class" :data="dataset" :selected_rows="selected_rows">
        <template v-slot:default="TableProps">
          
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">  
              <v-btn :disabled="(IsMultiSelect == false && TableProps.selected.length != 1) || (IsMultiSelect == true && TableProps.selected.length == 0)" v-bind="attrs" v-on="on" @click="save(TableProps)" icon x-small fab>
                <v-icon>mdi-content-save</v-icon>   
              </v-btn>
            </template>
            <span>Сохранить</span>
          </v-tooltip> 

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">  
              <v-btn v-bind="attrs" v-on="on" @click="save_empty(TableProps)" icon x-small fab>
                <v-icon>mdi-content-save-outline</v-icon>   
              </v-btn>
            </template>
            <span>Сохранить пустой выбор</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" @click="ComponentDialog = false" icon x-small fab>
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
      comboObj_class_new: this.comboObj_class
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
    
    if(this.UseConstrain == true) {
      this.dataset = this.dataset.filter(row => JSON.stringify(row) != JSON.stringify(this.selected_rows[0]))
      this.selected_rows = []
    }
  },

  methods: {
    save(prop) {
      if(prop.selected.length == 1) {
        this.comboObj_class_new[this.keyFieldName] = prop.selected[0][this.LookupKeyFieldName] // значение
        this.comboObj_class_new[this.nameText] = prop.selected[0][this.LookupResultFieldName] // отображение

        this.$emit('change', this.comboObj_class_new) // один объект
        this.ComponentDialog = false      
      } else {
        let arr_obj = []

        prop.selected.forEach(item => {
          let obj_arr = {}
          
          obj_arr[this.nameText] = item[this.LookupResultFieldName]
          obj_arr[this.keyFieldName] = item[this.LookupKeyFieldName]
          
          arr_obj.push(obj_arr)
        })
        this.$emit('change', arr_obj)
        this.ComponentDialog = false
      }

    },

    save_empty() {
      this.comboObj_class_new[this.keyFieldName] = null
      this.comboObj_class_new[this.nameText] = null

      this.$emit('change', this.comboObj_class_new)
      this.ComponentDialog = false 
    },

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