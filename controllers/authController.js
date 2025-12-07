const User = require("../models/User.js")


//Register a user

exports.register = async(req ,res) =>{
    try {
        const {email , password} = req.body ;

    const existing = User.findOne({email}
    )
    if (existing){
        return res.status(400).json({
            message : "User already exists"
        })
    }

    const user = new User ({email, password ,name})

    await user.save()

    res.status(201).json({
        user
    })
    } catch (error) {
        res.status(400).json({
            message : error
        })
    }
}

// Login a user 

