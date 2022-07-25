<template>
  <div>   
    <v-col v-for="(value, name) in RowOper" :key="name">      
      <v-text-field
        v-if="!(InvisibleColumns.includes(name)) && ViewProperties.find(item => Object.keys(item).join('') == name)[name].PropType == 'SIMPLE'"
        v-model="RowOper[name]"
        :label="ViewProperties.find(item => Object.keys(item).join('') == name)[name].Name" 
        :disabled="ViewProperties.find(item => Object.keys(item).join('') == name)[name].ReadOnly && editedIndex != -1"
        :rules="[
          ViewProperties.find(item => Object.keys(item).join('') == name)[name].AllowBlank ? true : () => !!RowOper[name] || 'Заполните поле!',
          !(!!ViewProperties.find(item => Object.keys(item).join('') == name)[name].MinValue) ? true : () => Number(RowOper[name]) > ViewProperties.find(item => Object.keys(item).join('') == name)[name].MinValue || `Не меньше ${ViewProperties.find(item => Object.keys(item).join('') == name)[name].MinValue}!`,
          !(!!ViewProperties.find(item => Object.keys(item).join('') == name)[name].MaxValue) ? true : () => Number(RowOper[name]) < ViewProperties.find(item => Object.keys(item).join('') == name)[name].MaxValue || `Не больше ${ViewProperties.find(item => Object.keys(item).join('') == name)[name].MaxValue}!`,
        ]"
      >
      </v-text-field>
              
      <date-time-picker 
        v-else-if="!(InvisibleColumns.includes(name)) && (ViewProperties.find(item => Object.keys(item).join('') == name)[name].PropType == 'DATE' || ViewProperties.find(item => Object.keys(item).join('') == name)[name].PropType == 'DATETIME')"
        v-model="RowOper[name]"
        :label="ViewProperties.find(item => Object.keys(item).join('') == name)[name].Name"
        :disabled="ViewProperties.find(item => Object.keys(item).join('') == name)[name].ReadOnly && editedIndex != -1"
        :rules="[ViewProperties.find(item => Object.keys(item).join('') == name)[name].AllowBlank ? true : () => !!RowOper[name] || 'Заполните поле!']"
        :PropType="ViewProperties.find(item => Object.keys(item).join('') == name)[name].PropType"     
      >
      </date-time-picker>

      <select-combo
        v-else-if="!(InvisibleColumns.includes(name)) && ViewProperties.find(item => Object.keys(item).join('') == name)[name].PropType == 'COMBO'"
        :label="ViewProperties.find(item => Object.keys(item).join('') == name)[name].Name" 
        :disabled="ViewProperties.find(item => Object.keys(item).join('') == name)[name].ReadOnly && editedIndex != -1"
        :rules="[ViewProperties.find(item => Object.keys(item).join('') == name)[name].AllowBlank ? true : () => !!RowOper[name] || 'Не выбрано!']"
        :comboList="ViewProperties.find(item => Object.keys(item).join('') == name)[name].ComboList"
        :ComboClass="ViewProperties.find(item => Object.keys(item).join('') == name)[name].ComboClass"
        :LookupKeyFieldName="ViewProperties.find(item => Object.keys(item).join('') == name)[name].LookupKeyFieldName"
        :LookupResultFieldName="ViewProperties.find(item => Object.keys(item).join('') == name)[name].LookupResultFieldName"
       
        :comboObj="comboObj(name)"
        @change="updateObj"
      >
      </select-combo> 

      <v-checkbox 
        v-else-if="!(InvisibleColumns.includes(name)) && ViewProperties.find(item => Object.keys(item).join('') == name)[name].PropType == 'CHECKBOX'"
        v-model="RowOper[name]"
        :label="ViewProperties.find(item => Object.keys(item).join('') == name)[name].Name"
        :disabled="ViewProperties.find(item => Object.keys(item).join('') == name)[name].ReadOnly && editedIndex != -1" 
      >
      </v-checkbox>

      <data-class-comp
        v-else-if="!(InvisibleColumns.includes(name))"
        :class_name="ViewProperties.find(item => Object.keys(item).join('') == name)[name].PropType"
        :label="ViewProperties.find(item => Object.keys(item).join('') == name)[name].Name"
        :disabled="ViewProperties.find(item => Object.keys(item).join('') == name)[name].ReadOnly && editedIndex != -1"
        :LookupKeyFieldName="ViewProperties.find(item => Object.keys(item).join('') == name)[name].LookupKeyFieldName"
        :LookupResultFieldName="ViewProperties.find(item => Object.keys(item).join('') == name)[name].LookupResultFieldName"
        :IsMultiSelect="ViewProperties.find(item => Object.keys(item).join('') == name)[name].IsMultiSelect"

        :comboObj_class="comboObj_class(name)"
        @change="updateObj_class"
      >
      </data-class-comp>
    </v-col>
  
  </div>
</template>

<script>
import DateTimePicker from './date-time-picker';
import SelectCombo from "./select-combo";
import DataClassComp from './data-class-comp';

export default {
  name: 'RowEdit',

  components: { 
    DateTimePicker, 
    SelectCombo,
    DataClassComp 
  },

  props: {        
    RowOper: {
      type: Object,
      required: true
    },
    editedIndex: {
      type: Number,
      required: true
    },
    ViewProperties: {
      type: Array,
      required: true
    },
    InvisibleColumns: {
      type: String,
      required: true
    },
    dataset: {
      type: Array,
      required: true
    }
  },

  methods: {
    comboObj(name) {
      let obj = {}

      obj[name] = this.RowOper[name]
      obj[this.ViewProperties.find(item => Object.keys(item).join('') == name)[name].KeyFieldName] = this.RowOper[this.ViewProperties.find(item => Object.keys(item).join('') == name)[name].KeyFieldName]

      return obj
    },
    
    updateObj(newObj) {
      // console.log(newObj)
      for(let key in newObj) {
        this.RowOper[key] = newObj[key]
      }

      // let rules_keys = Object.keys(this.rules)
      
      // rules_keys.forEach(key => {
      //   this.rules[key] = true
      // })  
         
    },

    comboObj_class(name) {
      let obj_1 = {}

      obj_1[name] = this.RowOper[name]
      obj_1[this.ViewProperties.find(item => Object.keys(item).join('') == name)[name].KeyFieldName] = this.RowOper[this.ViewProperties.find(item => Object.keys(item).join('') == name)[name].KeyFieldName]

      return obj_1
    },
   
    updateObj_class(newObj_class) {
      if(typeof(newObj_class) == "object" && !(Array.isArray(newObj_class))) {
        for(let key in newObj_class) {
          this.RowOper[key] = newObj_class[key]
        }        
      } else { //мульти-выбор
            
        for(let key in newObj_class[0]) {
          this.RowOper[key] = newObj_class[0][key] 
        }
        
        newObj_class.shift() 
               
        newObj_class.forEach(item => {
          let row = Object.assign({}, this.RowOper)
          for(let key in item) {
            row[key] = item[key]
          }
          this.dataset.push(row)
        });
      }
    }

  },
}
</script>