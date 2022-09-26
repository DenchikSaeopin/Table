<template>
  <v-app>
    <Table :dataClass = "data_class_init" :data = "dataset.dataset"></Table>   
  </v-app>
</template>

<script>
import Table from "@/components/Table";
 
import data_class_init from '/data_class_init.json';  
import data_class_vacation from '/data_class_vacation.json';
import data_class_schedule from '/data_class_schedule.json';
import data_class_skills from '/data_class_skills.json';

import dataset from '/dataset.json';
import dataset_vacation from '/dataset_vacation.json'
import dataset_schedule from '/dataset_schedule.json';
import dataset_skills from '/dataset_skills.json';

export default {
  name: 'App',
  components: { Table },
  
  data() {
    return {
      data_class_init: data_class_init,
      data_class_vacation: data_class_vacation,
      data_class_schedule: data_class_schedule,
      data_class_skills: data_class_skills,

      dataset: dataset,
      dataset_vacation: dataset_vacation,
      dataset_schedule: dataset_schedule,
      dataset_skills: dataset_skills
    }
  },  
};
</script>