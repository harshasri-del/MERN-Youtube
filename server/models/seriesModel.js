const { timeStamp } = require("console")
const mongoose =require("mongoose")
const { type } = require("os")

const seriesSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String
    },
    rating:{
        type:Number
    },
    yearOfRelease:{
        type:Number
    }
},
    {timeStamp:true})
const Series = mongoose.model("series",seriesSchema)

const UsersSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    }
},{timeStamp:true})
const Users = mongoose.model("users",UsersSchema)


module.exports={
    Series:Series,
    Users:Users
}