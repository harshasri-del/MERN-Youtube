const mongoose = require("mongoose")

const connectDB = async()=>{
   
    try{
        await mongoose.connect("mongodb+srv://Harshasri:Harshasri@seriescluster.unzdpl5.mongodb.net/?retryWrites=true&w=majority&appName=seriesCluster")
        .then(()=>{
            console.log("MongoDB Connected")
        })
    }catch(error){
        console.error(error.message)
    }
}

module.exports = connectDB;