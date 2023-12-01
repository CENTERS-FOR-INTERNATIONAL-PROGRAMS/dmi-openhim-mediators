'use strict'

import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import {
  registerMediator,
  activateHeartbeat,
  fetchConfig
} from 'openhim-mediator-utils'

import mediatorConfig, { urn } from './myMediatorConfig.json';
const util = require('util');
const sql = require("msnodesqlv8");
// const sql = require("mssql");
const fs = require('fs');


// const sql = require('mssql');
const port = 3001;
const connectionString = "server=4VHM2T3-KEN,1433;Database=DMI_Cholera_Stagging;uid=sa;pwd=S3tpassw0rd;Driver={ODBC Driver 17 for SQL Server}";

const openhimConfig = {
  username: 'root@openhim.org',
  password: 'Xkemricdc@123',
  apiURL: 'https://openhim-core:8080',
  trustSelfSigned: true,
  urn
}

const app = express();
const query = "SELECT name FROM person";

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
      console.log({"name": row.Name, "age": row.Age});

    const insertQuery = "INSERT INTO CholeraData (PatientID, Name, Age) VALUES (@Name, @Age)";



      const parameters = [
        { name: 'Name', type: sql.NVarChar, value: "Try" },
        { name: 'Age', type: sql.Int, value: 20 },
      ];


      const queryAsync = util.promisify(sql.query);
      const result = await queryAsync(connectionString, `INSERT INTO CholeraData (PatientID, Name, Age) VALUES ('${row.PatientID}', '${row.Name}',${row.Age})`);
    
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
