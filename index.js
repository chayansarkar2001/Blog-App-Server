import mongoose from "mongoose"
import express from "express"
import router from "./routes/user-routes.js"
import blogRouter from "./routes/blog-routes.js"
import cors from "cors"

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/',(req,res)=>{
    res.status(200).json({message:"welcome to nodejs server side. Go to /api/user/"})
})

app.use("/api/user",router)
app.use("/api/blog",blogRouter) 

app.get("*",(req,res)=>{
    res.status(200).json({message:"page can't find"})
})

mongoose.connect("mongodb+srv://chayan:6AykfxV7TOVOtWak@cluster0.ox32scw.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    app.listen(PORT,()=>{
        console.log(`database is connected and server listening to port ${PORT}`)
    })
}).catch(err=>console.error(err))

