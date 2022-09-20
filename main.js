const express = require('express')
const app = express()
//Heroku way
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/**
 * This case is try showing how to connect with mTLS
 */
app.get('/connect',(req,res) => {
    const { Client } = require('pg');
    //Heroku way, too.
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      // this part is very important for mTLS connection
      // these files are downloaded from Heroku by following this step: https://devcenter.heroku.com/ja/articles/heroku-postgres-via-mtls
      // Because, mTLS on Heroku requires mainly 2 steps
      // Adding whitelist on Heroku database
      // Generating necessary certificate files for clients
      // Therefore, before coding this part you should generate your certificate
      ssl: {
        rejectUnauthorized: false,
        ca: process.env.ROOTCA,
        key: process.env.POSTGRESKEY,
        cert: process.env.POSTGRESCA,
      },
    });
    client.connect();
    let result = "";
    client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
     if (err) throw err;
     for (let row of res.rows) {
       result += JSON.stringify(row);
     }
     client.end();
    });
    res.send(result);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})