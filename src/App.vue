<template>
  <v-app>
      <v-container pa-0 ma-0 fluid>
        <v-row no-gutters>
          <v-col cols="4">
            <v-card outlined> 
              <FilterPanel :dataClass = "data_class_tree" :data = "dataset_tree.data"></FilterPanel>
            </v-card>
          </v-col>
          <v-col cols="8">
            <v-card outlined> 
              <Table :dataClass = "data_class_init" :data = "dataset.dataset"></Table> 
            </v-card>    
          </v-col>
        </v-row>
      </v-container>
  </v-app>
</template>

<script>
import Table from "@/components/Table";
import FilterPanel from "@/components/FilterPanel.vue";
 
import data_class_init from '/data_class_init.json';  
import data_class_vacation from '/data_class_vacation.json';
import data_class_schedule from '/data_class_schedule.json';
import data_class_skills from '/data_class_skills.json';

import dataset from '/dataset.json';
import dataset_vacation from '/dataset_vacation.json'
import dataset_schedule from '/dataset_schedule.json';
import dataset_skills from '/dataset_skills.json';

import data_class_tree from '/data_class_tree.json'
import dataset_tree from '/dataset_tree.json'

export default {
  name: 'App',
  components: { Table, FilterPanel },
  
  data() {
    return {
      data_class_init: data_class_init,
      data_class_vacation: data_class_vacation,
      data_class_schedule: data_class_schedule,
      data_class_skills: data_class_skills,

      dataset: dataset,
      dataset_vacation: dataset_vacation,
      dataset_schedule: dataset_schedule,
      dataset_skills: dataset_skills,

      data_class_tree: data_class_tree,
      dataset_tree: dataset_tree
    }
  },  
};
</script>

