'use strict'

import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import {
  registerMediator,
  activateHeartbeat,
  fetchConfig
} from 'openhim-mediator-utils'

import mediatorConfig, { urn } from './choleraMediatorConfig.json';
const util = require('util');
const sql = require("msnodesqlv8");
// const sql = require("mssql");
const fs = require('fs');


// const sql = require('mssql');
const port = 3001;
const connectionString = "server=172.18.0.1;Database=DMI_Cholera_Stagging;uid=sa;pwd=Xkemrcdc@123;Driver={ODBC Driver 17 for SQL Server}";

const openhimConfig = {
  username: 'root@openhim.org',
  password: 'Xkemricdc@123',
  apiURL: 'https://openhim-core:8080',
  trustSelfSigned: true,
  urn
}

const app = express();
//const query = "SELECT name FROM person";

// app.all('*', (_req, res) => {
//   res.send('Hello World')
// })


const upload = multer({ dest: 'uploads/' });

app.post('/saveToSql', upload.single('csvFile'), async (req, res) => {
  try {


    // sql.connect(connectionString);
    const query = "SELECT * FROM Cholera";
    sql.query(connectionString, query, (err,rows)=>{
      console.log(rows);
      console.log(err);
     })

    // Process the CSV file
    const csvFilePath = req.file.path;
    const results = [];

    // Use csv-parser to parse the CSV file
    await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });

    // Perform database operation (e.g., insert data)
    for (const row of results) {
    
      const queryAsync = util.promisify(sql.query);
      const result = await queryAsync(connectionString, `INSERT INTO [dbo].[Cholera] (
        [ID_NO],
        [PATIENT_NAME],
        [OUT_PATIENT],
        [IN_PATIENT],
        [COUNTY],
        [SUB_COUNTY],
        [VILLAGE_TOWN_AND_NEIGHBORHOOD],
        [WARD],
        [NAME_OF_HEALTH_FACILITY],
        [CONTACTTELNUMBER],
        [SEX],
        [AGE],
        [DATE_SEEN_AT_HEALTH_FACILITY],
        [DATE_OF_ONSET_OF_DISEASES],
        [EPI_WEEK],
        [NUMBER_OF_DOSES_OF_VACCINES],
        [Sample_Collected_Yes_no],
        [Date_Sample_collected],
        [RDT_Yes_No],
        [RDT_Results_Positive_Negative],
        [Positive_by_RDT],
        [CULTURE_Yes_No],
        [Culture_Results_Positive_Negative],
        [Positive_by_Culture2],
        [Sero_Type],
        [A_Alive],
        [D_Dead],
        [Date_of_Death],
        [Patients_status_Admiited_Discharged_Out_Patient_Abscoded],
        [Date_of_Discharge],
        [More_Infor],
        [Age_analysis],
        [Lab_of_Diagnosis],
        [column34],
        [Place_of_Death_Facility_Community]
      ) VALUES (
       ${row.ID_NO},
      ${row.PATIENT_NAME},
      ${row.OUT_PATIENT},
      ${row.IN_PATIENT},
      ${row.COUNTY},
      ${row.SUB_COUNTY},
      ${row.VILLAGE_TOWN_AND_NEIGHBORHOOD},
      ${row.WARD},
      ${row.NAME_OF_HEALTH_FACILITY},
      ${row.CONTACTTELNUMBER},
      ${row.SEX},
      ${row.AGE},
      ${row.DATE_SEEN_AT_HEALTH_FACILITY},
      ${row.DATE_OF_ONSET_OF_DISEASES},
      ${row.EPI_WEEK},
      ${row.NUMBER_OF_DOSES_OF_VACCINES},
      ${row.Sample_Collected_Yes_no},
      ${row.Date_Sample_collected},
      ${row.RDT_Yes_No},
      ${row.RDT_Results_Positive_Negative},
      ${row.Positive_by_RDT},
      ${row.CULTURE_Yes_No},
      ${row.Culture_Results_Positive_Negative},
      ${row.Positive_by_Culture2},
      ${row.Sero_Type},
      ${row.A_Alive},
      ${row.D_Dead},
      ${row.Date_of_Death},
      ${row.Patients_status_Admiited_Discharged_Out_Patient_Abscoded},
      ${row.Date_of_Discharge},
      ${row.More_Infor},
      ${row.Age_analysis},
      ${row.Lab_of_Diagnosis},
      ${row.column34},
      ${row.Place_of_Death_Facility_Community}
      )`);
    
    }

    // Respond with success
    res.status(200).json({ success: true, message: 'Data saved to SQL Server' });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ success: false, message: `Internal Server Error:${err}` });
  } finally {
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
