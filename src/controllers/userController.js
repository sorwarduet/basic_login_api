const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

exports.registerUser= asyncHandler(async (req, res) => {

    try {

        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            res.status(400).json({message: "Please provide a name and email address"});
        }
        const userId = await User.findOne({email: req.body.email});

        if (!userId) {
            const salt =  bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
            })
            res.status(200).json({
                status: "success",
                data:
                    {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        token: generateToken(user._id)
                    }
            });
        } else {
            return res.status(400).json({status: "Failed", message: "User already exists"})
        }
    }catch (error){
        res.status(400).json(error);
    }

})


exports.loginUser= asyncHandler(async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            res.status(400).json({message: "Please provide a name and email address"});
        }
        const user = await User.findOne({email: email});
        if(user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                status: "success", data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id)
                }
            })
        }else {
            res.status(400).json({status: "Failed", message: "Please provide a valid email or password"});
        }
    }catch (e) {
        res.status(400).json({status: "Failed", message: e.message});
    }
})


exports.getCurrentUser=asyncHandler(async (req, res) => {

    const {_id, name, email}=await User.findById(req.user.id);
    res.status(200).json({id: _id, name: name, email: email});
})
const generateToken = id => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '5h'});