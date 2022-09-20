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
      ssl: {
        rejectUnauthorized: false
      }
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