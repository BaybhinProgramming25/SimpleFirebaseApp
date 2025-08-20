const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) // For json
app.use(express.urlencoded({extended: true})) // For forms 

// Helps use .env file 
require('dotenv').config()

// Call the Sign Up Backend
app.post('/signup', async (req, res) => {
    
    const { email, password, confirmPassword } = req.body.message;

    // Check if the password and confirm password match
    if(password != confirmPassword) 
    {
        res.status(400).json({ status: "failure", message: "Passwords DO NOT match" });
    }

    // If they do match, call firebase with fetch
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })

        const result = await response.json()

        // Most likely a duplicate user is made 
        if (response.status == 400)
        {
            res.status(400).json({ status: "failure", message: "User already exists! "})
        }

        const firebase_obj = {
            UserId: result.idToken,
            Email: result.email,
            RefreshToken: result.refreshToken,
            ExpiresIn: result.expiresIn,
            LocalId: result.localId
        }

        res.status(200).json({ status: "success", message: firebase_obj });
    }
    catch (error) 
    {
        res.status(500).json({ status: "failure", message: "Issue with server" });
    }
})


// Call the Sign in backend
app.post('/signin', async (req, res) => {
    const { email, password } = req.body.message;

    // Check if the password and confirm password match
    if(password != confirmPassword) 
    {
        res.status(400).json({ status: "failure", message: "Passwords DO NOT match" });
    }

    // If they do match, call firebase with fetch
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })

        const result = await response.json()

        // Most likely a duplicate user is made 
        if (response.status == 400)
        {
            res.status(400).json({ status: "failure", message: "User already exists! "})
        }

        const firebase_obj = {
            UserId: result.idToken,
            Email: result.email,
            RefreshToken: result.refreshToken,
            ExpiresIn: result.expiresIn,
            LocalId: result.localId
        }

        res.status(200).json({ status: "success", message: firebase_obj });
    }
    catch (error) 
    {
        res.status(500).json({ status: "failure", message: "Issue with server" });
    }
})


// 
app.post('/count', (req, res) => {

    // Call firebase to post url to that specific user 

  
    const receivedData = req.body.message;
    console.log("Received data from frontend: ", receivedData);
    res.status(200).json({ status: "success", message: "Data Received!", data: receivedData})

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
