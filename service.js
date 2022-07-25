import data_class_init from '/data_class_init.json';  
import data_class_vacation from '/data_class_vacation.json';
import data_class_skills from '/data_class_skills.json'; 
import dataset_skills from '/dataset_skills.json';
import dataset from '/dataset.json';
import dataset_vacation from '/dataset_vacation.json';


export default function data_class_srv(class_name) {
  if(class_name == "data_class_init") {
    return {data_class: data_class_init, dataset: dataset.dataset} 
  }
  if(class_name == "data_class_vacation") {
    return {data_class: data_class_vacation, dataset: dataset_vacation.dataset}
  }
  if(class_name == "data_class_skills") {
    return {data_class: data_class_skills, dataset: dataset_skills.dataset}
  }
}