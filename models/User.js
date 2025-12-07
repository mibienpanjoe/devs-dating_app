const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email :{
        type:String,
        required: true ,
        trim:true,
        unique : true,
        lowercase : true ,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    } , 
    password : {
        type : String , 
        required : [true , "Password is required"] , 
        minLength : 6,
        maxLemgth : 30
    } ,
    name :{
        type:String ,
        required: [true , "Name is required"] ,
        minLength : 2 ,
        maxLength : 20,
        trim: true 
    } , 

   role : {
    enum : ['admin' , 'user'] , 
    default : 'user'
   } ,

   profileImage : {
    type : String ,
    default: 'https://via.placeholder.com/150'
   },

   isVerified : {
    type : Boolean , 
    default: false
   } , 

  isActive : {
     type: Boolean,
    default: true 
  },

} , { timestamps: true });

module.exports = mongoose.model("User", UserSchema);  
