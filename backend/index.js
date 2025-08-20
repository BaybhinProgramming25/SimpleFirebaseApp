const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) // For json
app.use(express.urlencoded({extended: true})) // For forms 

app.post('/count', (req, res) => {
  
    const receivedData = req.body.message;
    console.log("Received data from frontend: ", receivedData);
    res.status(200).json({ status: "success", message: "Data Received!", data: receivedData})

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
