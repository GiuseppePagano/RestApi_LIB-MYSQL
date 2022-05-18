var bodyparser = require('body-parser')
var express = require('express')
const mysql = require('mysql')
const app = express();
app.use(bodyparser.json()) 
app.use(bodyparser.urlencoded({extended: true}))

const port = 3000;
const host = "localhost"

const database = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",  // qui la mia password
    database: "libreria", 
    insecureAuth: true
})

app.listen(port, host, ()=>{
    console.log(`Sono connesso all'indirizzo http://${host}:${port}`) 
})


app.get("/lib/lista", (req, res) => {

    database.query("SELECT * FROM libri", (errore, risultato, campi)=>{
        if(!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })

})

app.get("/lib/dettaglio/:isbn", (req, res) => {

    database.query(`SELECT * FROM libri WHERE isbn = '${req.params.isbn}'`, (errore, risultato, campi)=>{
        if(!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })

})
 //il controllo per isbn è gestito da DB con il campo UNIQUE quindi al tentato inserimento di un isbn uguale postman darà un errore sql
app.post("/lib/inserisci",  (req, res) => {

    database.query(`INSERT INTO libreria.libri (titolo, autore,isbn) 
        VALUES ('${req.body.titolo}', '${req.body.autore}', '${req.body.isbn}')`, (errore, risultato, campi)=>{
        if(!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })

})

app.delete("/lib/dettaglio/:isbn", (req, res) => {
    database.query(`DELETE FROM libri WHERE isbn = '${req.params.isbn}'`, (errore, risultato, campi)=>{
        if(!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })

})


app.put("/lib/dettaglio/:isbn", (req, res) => {
    database.query(`UPDATE libri SET titolo=('${req.body.titolo}'), autore=( '${req.body.autore}') WHERE isbn = '${req.params.isbn}'`, (errore, risultato, campi)=>{
        if(!errore)
            res.json(risultato);
        else
            res.json({
                status: "error", 
                data: errore.sqlMessage 
            })
    })

})
