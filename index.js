'use strict'


import multer from 'multer';
import csv from 'csv-parser';
import {
  registerMediator,
  activateHeartbeat,
  fetchConfig
} from 'openhim-mediator-utils'

import mediatorConfig, { urn } from './mortalityMediatorConfig.json';
const util = require('util');
const sql = require("msnodesqlv8");
// const sql = require("mssql");
const fs = require('fs');


// const sql = require('mssql');
const port = 3002;
const connectionString = "server=127.0.0.1,1433;Database=DMI_MortalityStagging;uid=sa;pwd=Xkemricdc@123;Driver={ODBC Driver 17 for SQL Server}";

const openhimConfig = {
  username: 'root@openhim.org',
  password: 'Xkemricdc@123',
  apiURL: 'https://openhim-core:8080',
  trustSelfSigned: true,
  urn
}
const express =require('express');
const axios = require('axios');
//const sql = require('mssql');

const app = express();



//Configuration for RedCap API
const redcapApiUrl = 'https://afi.icapkenya.org/redcap/api/';
const redcapAPiKey = '651296226777ED6CB8FB4CAF4B6C656A';

//Endpoint in the mediator

app.post('/fetch-mortality-data', async(req, res) => {
   try {
    const response = await axios.post(redcapApiUrl, {
      token: redcapAPiKey,
      content: 'project',
      format: 'json',
      returnFormat: 'json'
    }).then(response => {
      res.json(response.data);
    });
  
     for (const row of response.data) {
         const queryAsync = util.promisify(sql.query);
         const result = await queryAsync(connectionString, `INSERT INTO [dbo].[HospitalMortality]
         ([record_id]
         ,[redcap_data_access_group]
         ,[mflcode]
         ,[eligible]
         ,[pid]
         ,[ineligiblereason]
         ,[ineligibleother]
         ,[screening_form_complete]
         ,[pid_2]
         ,[enrolled]
         ,[unenrolreason]
         ,[unenrolother]
         ,[enrolment_form_complete]
         ,[pid_3]
         ,[reviewdate]
         ,[dob]
         ,[age]
         ,[ageyears]
         ,[agemonths]
         ,[agedays]
         ,[sex]
         ,[marital_status]
         ,[nationality]
         ,[education_level_max]
         ,[occupation]
         ,[county]
         ,[othercounty]
         ,[sub_county]
         ,[othersubcounty]
         ,[ward]
         ,[date_admission]
         ,[illness_date]
         ,[cough]
         ,[fever]
         ,[abnormal_breath_sounds]
         ,[sore_throat]
         ,[difficulty_in_breathing]
         ,[chest_pain]
         ,[rhinorrhea]
         ,[sore_muscles]
         ,[hemoptysis_coughing_out]
         ,[chills]
         ,[headache]
         ,[diarrhea]
         ,[vomiting]
         ,[skin_rash]
         ,[lack_of_appetite]
         ,[conjunctivitis]
         ,[convulsions]
         ,[nasal_flaring]
         ,[chest_in_drawing]
         ,[lethargic]
         ,[unconscious]
         ,[symtoms_other]
         ,[congenital_respiratory]
         ,[neurological]
         ,[newly_diagnosed_tb]
         ,[prior_tb]
         ,[hiv_aids]
         ,[congenital_cardiac_heart]
         ,[malnutrition]
         ,[acquired_heart_disease]
         ,[immune_disorder]
         ,[liver_disease]
         ,[renal_disease]
         ,[diabetes]
         ,[asthma_reactive_airway]
         ,[cancer_currently_or_12]
         ,[sickle_cell_disease]
         ,[rickets]
         ,[q_pregnant]
         ,[current_smoker]
         ,[past_smoker]
         ,[drug_substance_use]
         ,[familial_hered_disease]
         ,[history_of_attending_mass]
         ,[specify_event]
         ,[respiratory_rate]
         ,[height_measurement]
         ,[weight_measurement]
         ,[temperature]
         ,[oxygen_saturation]
         ,[mid_upper_arm_circumferenc]
         ,[respiratory_specimen]
         ,[swab_type_1]
         ,[swab_type_2]
         ,[swab_type_999]
         ,[swab_type_8]
         ,[specimen_date]
         ,[hiv_test]
         ,[hiv_result]
         ,[malaria_test]
         ,[malaria_result]
         ,[malaria_treated]
         ,[tb_therapy]
         ,[oxygen_admission]
         ,[patient_admitted]
         ,[where_admitted]
         ,[days_admitted]
         ,[mechanical_ventilation]
         ,[hemoglobin_level]
         ,[white_blood_cell_count]
         ,[neutrophil_count]
         ,[lymphocytes_count]
         ,[erythrocyte_rate]
         ,[sars_cov_2]
         ,[malaria]
         ,[pneumonia]
         ,[sepsis]
         ,[meningitis]
         ,[dehydration]
         ,[malnutrition_diagnosis]
         ,[bronchitis]
         ,[respiratory_distress]
         ,[diagnosis]
         ,[gastroenteritis]
         ,[other_diagnosis]
         ,[other_diagnosis1]
         ,[date_of_death]
         ,[documented_cause_of_death]
         ,[other_death_cause]
         ,[antecedent_causes]
         ,[antecedent_death_cause]
         ,[otherconditiondeath]
         ,[otherconditiondeath1]
         ,[samplecollected]
         ,[datecollected]
         ,[barcode]
         ,[username]
         ,[hospital_mortality_data_abstraction_form_complete]) VALUES 
         (${row.record_id},
          ${row.redcap_data_access_group},
          ${row.mflcode},
          ${row.eligible},
          ${row.pid},
          ${row.ineligiblereason},
          ${row.ineligibleother},
          ${row.screening_form_complete},
          ${row.pid_2},
          ${row.enrolled},
          ${row.unenrolreason},
          ${row.unenrolother},
          ${row.enrolment_form_complete},
          ${row.pid_3},
          ${row.reviewdate},
          ${row.dob},
          ${row.age},
          ${row.ageyears},
          ${row.agemonths},
          ${row.agedays},
          ${row.sex},
          ${row.marital_status},
          ${row.nationality},
          ${row.education_level_max},
          ${row.occupation},
          ${row.county},
          ${row.othercounty},
          ${row.sub_county},
          ${row.othersubcounty},
          ${row.ward},
          ${row.date_admission},
          ${row.illness_date},
          ${row.cough},
          ${row.fever},
          ${row.abnormal_breath_sounds},
          ${row.sore_throat},
          ${row.difficulty_in_breathing},
          ${row.chest_pain},
          ${row.rhinorrhea},
          ${row.sore_muscles},
          ${row.hemoptysis_coughing_out},
          ${row.chills},
          ${row.headache},
          ${row.diarrhea},
          ${row.vomiting},
          ${row.skin_rash},
          ${row.lack_of_appetite},
          ${row.conjunctivitis},
          ${row.convulsions},
          ${row.nasal_flaring},
          ${row.chest_in_drawing},
          ${row.lethargic},
          ${row.unconscious},
          ${row.symtoms_other},
          ${row.congenital_respiratory},
          ${row.neurological},
          ${row.newly_diagnosed_tb},
          ${row.prior_tb},
          ${row.hiv_aids},
          ${row.congenital_cardiac_heart},
          ${row.malnutrition},
          ${row.acquired_heart_disease},
          ${row.immune_disorder},
          ${row.liver_disease},
          ${row.renal_disease},
          ${row.diabetes},
          ${row.asthma_reactive_airway},
          ${row.cancer_currently_or_12},
          ${row.sickle_cell_disease},
          ${row.rickets},
          ${row.q_pregnant},
          ${row.current_smoker},
          ${row.past_smoker},
          ${row.drug_substance_use},
          ${row.familial_hered_disease},
          ${row.history_of_attending_mass},
          ${row.specify_event},
          ${row.respiratory_rate},
          ${row.height_measurement},
          ${row.weight_measurement},
          ${row.temperature},
          ${row.oxygen_saturation},
          ${row.mid_upper_arm_circumferenc},
          ${row.respiratory_specimen},
          ${row.swab_type_1},
          ${row.swab_type_2},
          ${row.swab_type_999},
          ${row.swab_type_8},
          ${row.specimen_date},
          ${row.hiv_test},
          ${row.hiv_result},
          ${row.malaria_test},
          ${row.malaria_result},
          ${row.malaria_treated},
          ${row.tb_therapy},
          ${row.oxygen_admission},
          ${row.patient_admitted},
          ${row.where_admitted},
          ${row.days_admitted},
          ${row.mechanical_ventilation},
          ${row.hemoglobin_level},
          ${row.white_blood_cell_count},
          ${row.neutrophil_count},
          ${row.lymphocytes_count},
          ${row.erythrocyte_rate},
          ${row.sars_cov_2},
          ${row.malaria},
          ${row.pneumonia},
          ${row.sepsis},
          ${row.meningitis},
          ${row.dehydration},
          ${row.malnutrition_diagnosis},
          ${row.bronchitis},
          ${row.respiratory_distress},
          ${row.diagnosis},
          ${row.gastroenteritis},
          ${row.other_diagnosis},
          ${row.other_diagnosis1},
          ${row.date_of_death},
          ${row.documented_cause_of_death},
          ${row.other_death_cause},
          ${row.antecedent_causes},
          ${row.antecedent_death_cause},
          ${row.otherconditiondeath},
          ${row.otherconditiondeath1},
          ${row.samplecollected},
          ${row.datecollected},
          ${row.barcode},
          ${row.username},
          ${row.hospital_mortality_data_abstraction_form_complete}
          )`);

     } 
     res.json({ message: 'Data fetched and stored in database' });
  
      
   } catch (error) {
    console.error('Error fetching mortality data from REDCAP', error);
    res.status(500).send('Error fetching data from RedCap');
    
   }

});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  mediatorSetup()
});


const mediatorSetup = () => {
  // The purpose of registering the mediator is to allow easy communication between the mediator and the OpenHIM.
  // The details received by the OpenHIM will allow quick channel setup which will allow tracking of requests from
  // the client through any number of mediators involved and all the responses along the way(if the mediators are
  // properly configured). Moreover, if the request fails for any reason all the details are recorded and it can
  // be replayed at a later date to prevent data loss.
  registerMediator(openhimConfig, mediatorConfig, err => {
    if (err) {
      throw new Error(`Failed to register mediator. Check your Config. ${err}`)
    }

    console.log('Successfully registered mediator!')

    fetchConfig(openhimConfig, (err, initialConfig) => {
      if (err) {
        throw new Error(`Failed to fetch initial config. ${err}`)
      }
      console.log('Initial Config: ', JSON.stringify(initialConfig))

      // The activateHeartbeat method returns an Event Emitter which allows the mediator to attach listeners waiting
      // for specific events triggered by OpenHIM responses to the mediator posting its heartbeat.
      const emitter = activateHeartbeat(openhimConfig)

      emitter.on('error', err => {
        console.error(`Heartbeat failed: ${err}`)
      })

      // The config events is emitted when the heartbeat request posted by the mediator returns data from the OpenHIM.
      emitter.on('config', newConfig => {
        console.log('Received updated config:', JSON.stringify(newConfig))
      })
    })
  })
}
