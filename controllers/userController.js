const User = require('../models/User.js')

exports.getAllUsers = async(req ,res) =>{
    try {
        const users = await User.find()
        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({
           error:"Could not fetch users"
        })
    }
};

// Get a single user

exports.getSingleUser = async(req , res) =>{
    try {
        
        const user = await User.findById(req.params.id)
        if (!user){
            return res.status(404).json({
                error :"User not found"
            })
        }

        res.status(200).json({user})

    } catch (error) {
        res.status(500).json({message :"Internal server error" , error})
    }
}

// Update a single user 

exports.updateSingleUser = async(req , res) =>{
    try {
    const user = await User.findByIdAndUpdate(req.params.id)

    } catch (error) {
        
    }
}

//Delete a single user

exports.deleteSingleUser = async(req , res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user) return res.status(404).json({
            error:"User not found"
        })

        res.status(200).json({
            message:"User deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error" , error
        })
    }
}