import express, { json, urlencoded } from 'express';
import db from './fbconfiguration.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';


const app = express()
const port = 3000


dotenv.config(); // For using values in .env files
app.use(json()) // For json
app.use(urlencoded({extended: true})) // For forms 


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
            AuthId: result.idToken,
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

    // If they do match, call firebase with fetch
    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY}`, {
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

        // Incorrect email or password supplied
        if (response.status == 400)
        {
            res.status(400).json({ status: "failure", message: "Incorrect email or password supplied "})
        }

        const firebase_obj = {
            AuthId: result.idToken,
            Email: result.email,
            RefreshToken: result.refreshToken,
            ExpiresIn: result.expiresIn,
            LocalId: result.localId,
            Registered: result.registered
        }

        res.status(200).json({ status: "success", message: firebase_obj });
    }
    catch (error) 
    {
        res.status(500).json({ status: "failure", message: "Issue with server" });
    }
})


// Set clicks to the user 
app.post('/incounter', async (req, res) => {

    console.log(req);

    const userId = req.body.userId;
    const counter = req.body.counter; 

    // Send clicks to the specific user in the database
    await setDoc(doc(db, 'clicks', userId), {
        clicks: counter
    });

    res.status(200).json({ status: "success", message: "Successfully set clicks for the user!"})
})

app.get('/getcounter', async (req, res) => {

    const userId = req.query.userId;

    // Get the existing number of clicks, if any, from the database
    const clickRef = doc(db, 'clicks', userId)
    const clickData = await getDoc(clickRef);

    console.log(clickRef)
    console.log(clickData)

    // Check if data exists
    if(clickData.exists())
    {
        console.log("Number of existing clicks:", clickData.data())
        res.status(200).json({ status: "success", message: clickData.data()})
    }
    else {    
        console.log("No such data")
    }
})


// Listen on port 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
