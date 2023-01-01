import User from "../model/User.js"
import bcrypt from "bcryptjs"

const getAllUsers = async (req, res, next)=>{
    let users;
    try {
        users = await User.find();
    }catch (err){
        console.log(err)
    }
    if(!users){
        return res.status(404).json({message:"No User Found"})
    }
    return res.status(200).json({users})
}

const signup = async (req,res,next)=>{
    const {name, email, password} = req.body;
    let exsitingUser;
    try {
        exsitingUser = User.findOne({email})
    } catch (error) {
        return console.log(error)
    }
    if(!exsitingUser){
        return res.status(400).json({message: "User Allready Exist! Login Instead"})
    }
    const hashedPassword = bcrypt.hashSync(password)
    const user = new User({
        name,
        email,
        password:hashedPassword,
        blogs:[]
    })
    try {
        await user.save()
    } catch (error) {
        return console.log(error)
    }
    res.status(200).json({user})
}

const login = async (req,res,next)=>{
    const {email, password} = req.body;
    let exsitingUser;
    try {
        exsitingUser = await User.findOne({email})
    } catch (error) {
        return console.log(error) 
    }
    if(!exsitingUser){
        return res.status(404).json({message: "Could Not Find User with this Email! SignUp Instead"})
    }
    const isPasswordSame = bcrypt.compareSync(password, exsitingUser.password)
    if(!isPasswordSame){
        return res.status(400).json({message: "Password is incorrect"})
    }
    return res.status(200).json({message:"Logged In Successfully", user:exsitingUser})
}


export { getAllUsers,signup,login }