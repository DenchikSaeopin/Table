<template>
  <v-app>
    <Table :dataClass = "data_class_init" :data = "dataset.dataset"></Table>  
    
  </v-app>
</template>

<script>
import Table from "@/components/Table";
 
import data_class_init from '/data_class_init.json';  
import data_class_vacation from '/data_class_vacation.json';
import dataset from '/dataset.json';
import dataset_vacation from '/dataset_vacation.json'

export default {
  name: 'App',
  components: { Table },
  
  data() {
    return {
      data_class_init: data_class_init,
      data_class_vacation: data_class_vacation,
      dataset: dataset,
      dataset_vacation: dataset_vacation
    }
  },  
};
</script>