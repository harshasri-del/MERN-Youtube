//https://www.youtube.com/watch?v=BK2wEf-efGg&list=PLKKoWAz_o0UgZYl7EmnQJ1HQ6wsJrnPKV&index=3
const express = require("express")
const app=  express()
const cors = require("cors")
const connectDB =require('./utils/db')
// const Series = require("./models/seriesModel")
const { Series, Users } = require("./models/seriesModel");

//password hashing
const bcrypt = require("bcrypt")
//verify user's Identity
const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000' })) 

const port=8000;

connectDB()
app.get("/api/youtube",(req,res)=>{
    res.send({like:"Like the vedio",subscribe:"subscribe the channel"})
})
app.get("/date",(req,res)=>{
    const date = new Date();
    res.send({date:`todays date is ${date}`});
})
//=========register=========
app.post("/register",async(request,response)=>{
    // console.log(request.body)
    try{
        const userDetails = request.body;
        const {username,password} = userDetails
        //---check user is already existed
        const existedUser = await Users.findOne({username})
        if(existedUser){
            return response.status(400).json({message: "User is already existed!!"})
        }
        //---If new User
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new Users({
            username:username,
            password:hashedPassword
        });
        console.log(newUser);
        const user = await newUser.save()
        response.status(200).json({
            success:true,
            user
        })
    }
    catch(error){
        response.status(500).json({
            message:error.message
        })
    }
})

//=========== Login ==========

app.post("/login",async(request,response)=>{
    // console.log(request.body)
    const {username,password}= request.body;
    try{
        // Check if username already exists
        const existingUser = await Users.findOne({ username });
        console.log(existingUser)
        //---existedUser===null
        if (!existingUser) {  
            return response.status(400).json({ message: "User Not existed!!!" });
        }
        else{
            const isPasswordMatched = await bcrypt.compare(password,existingUser.password)
            // console.log(isPasswordMatched)
            if(isPasswordMatched===true){
                const payload={username:username}
                const jwtToken = jwt.sign(payload,"MY_SECRET_TOKEN")
                // console.log({jwtToken})
                response.status(200).json({success:true,jwtToken})
            }
            else{
                return response.status(400).json({message:"Invalid Password"})
            }
        }

    }
    catch(error){
        response.status(500).json({
            message:error.message
        })
    }
})

// app.get("/api/series",async(req,res)=>{
//     const authToken = req.headers.authorization;
//     console.log(authToken)
//     if(authToken===undefined){
//         response.status(401).json({meassage:"No JWT token provided Invalid User!!"})
//     }
//     else{
//         jwt.verify(authToken,"MY_SECRET_TOKEN",async(error,user)=>{
//             if(error){
//                 res.status(401).json({message:"Invalid Token!!"})
//             }
//             else{
//                 // res.status(200).json({message:"Valid User"})
//                 try{
//                     const series = await Series.find()
//                     res.status(200).json({
//                         success:true,
//                         series
            
//                     })
            
//                 }
//                 catch(error){
//                     res.status(500).json({
//                         message:error.message
//                     })
//                 }
//             }
//         })
//     }
   
// })

const authenticationToken=(request,response,next)=>{
    const authToken = request.headers.authorization;
    // console.log(authToken)
    if(authToken===undefined){
        response.status(401).json({meassage:"No JWT token provided Invalid User!!"})
    }
    else{
        jwt.verify(authToken,"MY_SECRET_TOKEN",async(error,user)=>{
            if(error){
                response.status(401).json({message:"Invalid Token!!"})
            }
            else{
                request.username= user.username
                next();
                // console.log(user)
              
            }
        })
    }
           
}

app.post("/api/series",authenticationToken,async(req,res)=>{
    // console.log(req.body)
    try{
        const series = await Series.create(req.body)
        res.status(200).json({
            success:true,
            series

        })

    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})

app.get("/api/series",async(req,res)=>{
    // let {username }= req
    // console.log(username)
  
    try{
        const series = await Series.find()
        res.status(200).json({
            success:true,
            series

        })

    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})

app.get("/api/series/:id",async(req,res)=>{
    console.log(req.params)
  
    try{
        const series = await Series.findById(req.params.id)
        if(!series){
            return res.status(404).json({message:`Series with requested id : ${req.params.id} id does not exists`})
        }
        res.status(200).json({
            success:true,
            series

        })

    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})
app.patch("/api/series/:id",async(req,res)=>{

  
    try{
        const series = await Series.findByIdAndUpdate(req.params.id,req.body)
        if(!series){
            return res.status(404).json({message:`Series with requested id : ${req.params.id} id does not exists`})
        }

        const updatedSeries = await Series.findById(req.params.id)
        res.status(200).json({
            success:true,
            updatedSeries

        })

    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})

app.delete("/api/series/:id",async(req,res)=>{

  
    try{
        const series = await Series.findByIdAndDelete(req.params.id)
        if(!series){
            return res.status(404).json({message:`Series with requested id : ${req.params.id} id does not exists`})
        }

      
        res.status(200).json({
            success:true,
         

        })

    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})
//get with query params
// app.get("/api/series",async(req,res)=>{
//     const {limit,offset,search} = req.query;
//     const query = search ? {description: new RegExp(search,'i')} : {};
//     try{

       
//         const series = await Series.find(query)
//         .limit(parseInt(limit))
//         .skip(parseInt(offset));

//         res.status(200).json({
//             success:true,
//             data:series,
//             count: series.length

//         })

//     }
//     catch(error){
//         res.status(500).json({
//             message:error.message
//         })
//     }
// })




app.listen(port,()=>{console.log(`Server is running ....at port:${port}`)})


//start
// npm run dev