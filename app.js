require("dotenv").config();
require("./config/database").connect()
const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth")

app.use(express.json());
// importing user 

const User = require ("./model/user")

// register
app.post("/register", async(req, res) => {

    try {
        
        // get the user input
        const {first_name, last_name, email, password } = req.body

        // validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All inputs are required")
        }

        // check if user already exist 
        // validate if user exist in our database

        const oldUser = await User.findOne({email})

        if (oldUser) {
            return res.status(409).send("User already exist. please login")
        }

        // encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // create user in our database

        const user = await User.create({
            first_name, last_name, email: email.toLowerCase(), password: encryptedPassword,
        })

        // create token
        const token = jwt.sign(
            {
                user_id: user._id, email,
            },
            process.env.TOKEN_KEY,{
                expiresIn: "2h",
            }
        );
        
        // save user ttoken

        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
    }
})

app.post("/login", async(req,res) => {

    try {
        
        // get user input
        const {email, password} = req.body

        // validation

        if (!(email && password)) {
            res.status(400).send("All inputs are required")
        }

        // validate if user exist in our database

        const user = await User.findOne({email})
        if (user && (await bcrypt.compare(password, user.password))) {
            
            // create token

            const  token = jwt.sign({
                user_id: user._id, email
            },
            process.env.TOKEN_KEY,{
                expiresIn: "2hr",
            }
            )

            // save user token;

            user.token = token;

            // user
            res.status(200).json(user);
        }
        res.status(400).send("invalid Credentials")
    } catch (error) {
        console.log(error);
    }
})

app.post('/welcome', auth, (req,res) => {
    res.status(200).send("welcome ")
})



module.exports = app