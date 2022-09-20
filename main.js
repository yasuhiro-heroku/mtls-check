const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/**
 * This case is try showing how to connect with mTLS
 */
app.get('/connect',(req,res) => {
    const { Client } = require('pg');
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