const Router = require("express")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const config = require("config")
const router = Router()
const { check, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")


router.post('/registration',[
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Password must be from 3 to 12 characters').isLength({min:3, max: 12})
], async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json('Registration error')
        }
        const { email, password } = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            return res.status(400).json(`The user with ${email} is already`)
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = new User({email, password: hashPassword})
        await user.save()
        return res.json({message: 'User was created'})

    } catch (e) {
        res.send({message: "Server error"})
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email)
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }
        const isPassValid = bcrypt.compareSync(password, user.password)
        if (!isPassValid) {
            return res.status(400).json({message: 'Incorrect password'})
        }
        const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }
        })
    } catch (e) {
        res.send({message: "Server error"})
    }
})

module.exports = router