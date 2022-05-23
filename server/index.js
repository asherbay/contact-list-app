const express = require('express')
const app = express()


var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const fs = require('node:fs')

let dataPath = './db/data.txt'

let contacts = 
        [
            {"name": "Jim", "number": "+18019447655", "email": "jim@gmail.com", "id": 0},
            {"name": "Bob", "number": "+18019547676", "email": "bob@gmail.com", "id": 1},
            {"name": "Anne", "number": "+18016527776", "email": "anne@gmail.com", "id": 2},
        ]


const createDataFile = () => {
    
    if(!fs.existsSync(dataPath)){
        fs.writeFileSync(dataPath, JSON.stringify(contacts))
    } else {
        let data = fs.readFileSync(dataPath).toString() 
        contacts = JSON.parse(data)
        console.log(contacts)
    }
}

const updateDataFile = () => {
    if(fs.existsSync(dataPath)){
        fs.writeFileSync(dataPath, JSON.stringify(contacts))
    }
}



app.get('/contacts', (req, res) => {
    updateDataFile()
    //createDataFile()
    res.json({contacts: contacts})
})

app.put('/contacts/:id', (req, res) => {
    //console.log("id: " + req.params.id)
    let filteredContacts = contacts.filter((c)=>{
        console.log(typeof c.id + " " + typeof req.params.id)
        return c.id!==parseInt(req.params.id)
    })
    console.log(filteredContacts)
    contacts = [...filteredContacts, req.body]
    updateDataFile()

    res.json({contacts: contacts})
})

app.post('/contacts', (req, res) => {
    contacts = [...contacts, req.body]
    updateDataFile()

    res.json({contacts: contacts})

})

app.delete('/contacts/:id', (req, res) => {
    contacts = contacts.filter((c)=>{
        return c.id!==parseInt(req.params.id)
    })
    updateDataFile()
    res.json({contacts: contacts})

})

app.listen(3001, () => {console.log("server running on port 3001")})