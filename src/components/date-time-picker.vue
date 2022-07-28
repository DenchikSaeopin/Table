<template>
  <div>
    <v-dialog v-model="DateTimeDialog" width="290px" :persistent="persistent">
      <template v-slot:activator="{on ,attrs}">
        <v-text-field 
          :rules="rules" 
          :value="DateTimeValue" 
          :label="label" 
          :disabled="disabled" 
          readonly 
          v-bind="{ ...attrs, ...$attrs}" v-on="on" >
        </v-text-field>
      </template>     

      <v-card class="white">
        <v-toolbar height="36" color="primary" dark flat>
          <v-tabs v-model="tab" grow height="36">
            <v-tabs-slider color="white"></v-tabs-slider>
              <v-tab href="#date">
                <v-icon>mdi-calendar</v-icon>  
              </v-tab>

              <v-tab href="#time" :disabled="PropType == 'DATE' || date == null">
                <v-icon>mdi-clock</v-icon>  
              </v-tab>

              <v-btn depressed text class="rounded-0" @click="closeDialog">
                <v-icon>mdi-check</v-icon>
              </v-btn>  
          </v-tabs>     
        </v-toolbar>
        
        <v-tabs-items v-model="tab">          
          <v-tab-item value="date">
            <v-date-picker v-model="date" class="rounded-0" @input="PropType == 'DATETIME' ? tab = 'time' : tab = 'date'" full-width locale="ru"></v-date-picker>
          </v-tab-item>        
          <v-tab-item value="time">
            <v-time-picker
              :disabled="PropType != 'DATETIME'"
              :key="tab"
              v-model="time"
              format="24hr"
              use-seconds
              class="rounded-0"
              full-width
              @click:second = "closeDialog"
            >
            </v-time-picker>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'DateTimePicker',
  
  inheritAttrs: false, // корневой элемент компонента не наследует атрибуты; можно вручную определять к какому элементу должны применяться атрибуты

  props: {
    value: {
      type: String,
      default: null
    },
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    PropType: {
      type: String,
      required: true
    },
    rules: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      date: this.value.split(" ")[0],
      time: this.value.split(" ")[1],
      tab: false,
      DateTimeDialog: false,
      persistent: true,
      DateTimeValue: this.value
    }
  },
  
  methods: {
    closeDialog() {
      this.DateTimeDialog = false;
      this.DateTimeValue = this.date ? `${this.date} ${this.time ? this.time : ""}` : ""
      this.$emit("input", this.DateTimeValue)
    }
  },

}
</script>

