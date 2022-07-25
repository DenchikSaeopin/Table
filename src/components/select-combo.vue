<template>
    <div>
      <v-select :label="label" :disabled="disabled"
        :rules="rules"
        v-model="selected"
        :items="items"
        :item-text="nameText" 
        :item-value="keyFieldName"
        return-object
        @change="$emit('change', comboObj)"           
      >
      </v-select>         
    </div>
</template>

<script>
import service from "/service";

export default {
  name: "SelectCombo",

  props: {
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    comboList: {
      type: String,
      default: null  
    },
    ComboClass: {
      type: String,
      default: null
    }, 
    LookupKeyFieldName: {
      type: String,
      default: null
    },
    LookupResultFieldName: {
      type: String,
      default: null
    }, 
    comboObj: {  
      type: Object,
      default: null
    },
    rules: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      nameText: Object.keys(this.comboObj)[0], // отображение
      keyFieldName: Object.keys(this.comboObj)[1], //значение
    }
  },

  computed: {
    selected: {
      get() {      
        return this.comboObj 
      },
      set(newObj) {
        this.comboObj[this.keyFieldName] = newObj[this.keyFieldName]; 
        this.comboObj[this.nameText] = newObj[this.nameText]; 
      }
    },

    items() {
      let items = [];

      if(this.comboList != null) {       
        let combo_arr = []

        this.comboList.split(';').forEach((item) => { combo_arr.push(item.split('='))})

        combo_arr.forEach((item) => {
          let obj_1 = {}

          obj_1[this.nameText] = item[0]
          obj_1[this.keyFieldName] = item[1] 
          
          items.push(obj_1)
        })
        return items;
      } else {
        let dataset = service(this.ComboClass).dataset

        dataset.forEach(item => {
          let obj_arr = {}
          
          obj_arr[this.nameText] = item[this.LookupResultFieldName]
          obj_arr[this.keyFieldName] = item[this.LookupKeyFieldName]
          
          items.push(obj_arr)            
        })

        return items
      }

    }
  },

}
</script>