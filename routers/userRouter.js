const router = require("express").Router()
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
router.post('/', async(req,res) => {
    try{
    const { email, password, passwordVerify } = req.body;

    // validation
    if (!email || !password || !passwordVerify) 
    return res.status(400).json({errorMessage: "please enter all required fields."});
    
    // validation for the length of password
    if(password.length < 6) return
    res.status(400)
    .json({
        errorMessage: "Please enter a password of atleast 6 characters"
    })

    // validation for confirmation of password
    if(password !== passwordVerify)
    return res.status(400).json({
        errorMessage: "please enter thesame password"
     })

     const existingUser =await User.findOne({email})
     if(existingUser)
     return res.status(400).json({
         errorMessage: "An account with this email already exists"
     })

    //  hash the password

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt)

    // save a new user account to the db

    const newUser = new User({
        email,
        passwordHash,
    });
    const savedUSer = await newUser.save();

    // sign the token

    const token = jwt.sign(
        {
            user: savedUSer._id,
        },
        process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie

    res.cookie("token", token, {
        httpOnly: true,
    })
    .send()
} catch(err){
    console.error(err);
    res.status(500).send()
}
    
})

// login 

router.post("/login", async(req,res) => {
    try{
        const {email, password} =req.body;

        // validate

        if(!email || !password)
        return res.status(400)
        .json({errorMessage: "please enter all required fields"})
        
        const existingUser = await User.findOne({email})
        if(!email || !password)
        return res
        .status(400)
        .json({errorMessage: "wrong password or email"});

        const passwordCorrect = await bcrypt.compare()

     } catch(err){ 
        console.error(err)
        res.status(500).send()
    
}
})

module.exports = router