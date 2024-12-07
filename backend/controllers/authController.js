const User=require('../models/User')
const {hashPassword,comparePassword}=require('../helper/authHelper')
const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')

const registerUser= asyncHandler(async (req,res)=>{
        const {name,email,password,address,phone}=req.body
    
        if(!name || !email || !password ||!address||!phone){
            res.status(400)
            throw new Error('Please add all fields')
        }
    
        //check if user exist
        const userExist=await User.findOne({email})
    
        if(userExist){
            res.status(400)
            throw new Error('User already exist')
        }

        //register new user
        const hashedPassword=await hashPassword(password)
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            address,
            phone
        })
    
        if(user){
            res.status(201).json(
            {_id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user.id),
            phone:user.phone
        })
        }else{
            res.status(400)
                throw new Error('Invalid user data')
            
        }
    
})

const loginUser=asyncHandler(async (req,res)=>{

    const {email,password,role}=req.body
    const user=await User.findOne({email})

    if(user &&(await comparePassword(password,user.password))){
        res.status(201).json(
            {_id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateToken(user.id,role),
            phone:user.phone
        })
    }else{
        res.status(400)
        throw new Error('Invalid credentials')
    }


})

//jwt token generation
const generateToken=(id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET,
        {expiresIn:'30d'})
    
}   



module.exports={
    registerUser,
    loginUser,
}