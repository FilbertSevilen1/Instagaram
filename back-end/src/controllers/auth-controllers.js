const { registerSchema, loginSchema, forgetPasswordSchema } = require("../helpers/schema-validation")
const database = require("../config").promise()
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const JWT = require('jsonwebtoken')

module.exports.registerUser = async (req,res) =>{
    const body = req.body
    try{
        if(body.password !== body.repassword){
            return res.status(400).send('Password and Repassword are not same')
        }
        const {error} = registerSchema.validate(req.body)
        if(error){
            return res.status(400).send(error.message)
        }
        const CHECK_USER = `SELECT uid FROM users WHERE username = ? OR email = ?`
        const [USER] = await database.execute(CHECK_USER, [body.username, body.email])
        if(USER.length){
            return res.status(400).send("Username or Email already exists")
        }
        let flag = false;
        for(let i=0;i<body.password.length;i++){
            if(body.password[i]>='A'&&body.password[i]<='Z')flag=true
        }
        if(flag==false){
            return res.status(400).send("Password must contain uppercase letter")
        }

        const uid = uuid.v4()

        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(body.password,salt)

        const INSERT_USER = `
            INSERT INTO users (uid, username, email, password) VALUES (?,?,?,?)
        `
        const [INFO] = await database.execute(INSERT_USER, [uid, body.username, body.email, hashpassword])
        
        //generate JWT token
        const token = JWT.sign({uid : uid}, "ugwhre352w")
        console.log('token : ', token)

        const date = new Date();

        const CREATE_VERIFICATION_CODE = `INSERT INTO verification (uid, verificationcode, createddate) VALUES(?,?,?)`
        const [INFO2] = await database.execute(CREATE_VERIFICATION_CODE, [uid, token, date])

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : `${body.email}`,
                pass : "nyxbegqqntyfvbob"
            },
            tls : { rejectUnauthorized : false }
        })

        await transporter.sendMail({
            from : '<admin/> sevilenfilbert@gmail.com',
            to : 'sevilenfilbert@gmail.com',
            subject : 'Instagaram Verification',
            html : `
                <p>please verify your account using this link.</p>
                <p>link : <a href="http://localhost:5000/api/auth/${token}">Verification Link</a></p>
                <p>NOTE : do not share this code.</p>
            `
        })

        res.status(201).send("New User has been created")
    }
    catch(error){
        console.log('error : ', error)
        res.status(500).send(`Internal Service Error`)
    }
    
}
module.exports.loginUser = async (req,res) =>{
    const body = req.body
    console.log(body)
    try{
        const {error} = loginSchema.validate(body)
        if(error){
            return res.status(400).send(error.message)
        }
        const GET_USER_BY_USERNAME = `SELECT * FROM users WHERE username = ?`
        const [USER] = await database.execute(GET_USER_BY_USERNAME, [body.username])
        console.log(USER)  
        if(!USER.length){
            return res.status(404).send("User not found")
        }

        const hashpassword = await bcrypt.compare(body.password, USER[0].password)
        console.log(hashpassword)
        if(!hashpassword){
            return res.status(404).send("Username or Password is incorrect")
        }
        else{
            delete USER[0].password
            console.log(USER[0])  
            return res.status(200).send(USER[0])
        }
    }
    catch(error){
        console.log('error : ', error)
        res.status(500).send(`Internal Service Error`)
    }
}
module.exports.verifyUser = async (req,res) =>{
    let token = req.params.code
    console.log(token)
    try{
        //check if token is expired
        const CHECK_TOKEN = `SELECT * FROM verification WHERE verificationcode = ?`
        const [TOKEN] = await database.execute(CHECK_TOKEN, [token])
        if(!TOKEN.length){
            return res.status(400).send(`
                <div style="display:flex;align-items:center;flex-direction:column">
                    <h1>Instagaram Token Expired or Invalid</h1>
                </div>
            `)
        }
        console.log(TOKEN)
    
        const now = new Date();
        const current = now.getTime();
        const created = new Date(TOKEN[0].createddate).getTime();
        console.log(current-created)

        if(current-created >= 600000){
            return res.status(400).send(`
                <div style="display:flex;align-items:center;flex-direction:column">
                    <h1>Instagaram Token Expired</h1>
                </div>
            `)
        }

        const VERIFY_USER = `UPDATE users SET verified = 1 WHERE uid = ?`
        const [INFO] = await database.execute(VERIFY_USER,[TOKEN[0].uid])
    
        const DELETE_OLD_TOKEN = `DELETE FROM verification WHERE uid = ?`
        await database.execute(DELETE_OLD_TOKEN,[TOKEN[0].uid])

        res.status(200).send(`
            <div style="display:flex;align-items:center;flex-direction:column">
                <h1>Your Instagaram Account has been verified</h1>
                <h2><a href="http://localhost:3000">Go To Instagaram</a></h2>
            </div>
            
        `)
    }
    // let uid = req.params.code
    // console.log(uid)
    // try{
    //     const VERIFY_USER = `UPDATE users SET verified = 1 WHERE uid = ?`
    //     const [INFO] = await database.execute(VERIFY_USER,[uid])
    
    //     res.status(200).send(`
    //         <div style="display:flex;align-items:center;flex-direction:column">
    //             <h1>Your Instagaram Account has been verified</h1>
    //             <h2><a href="http://localhost:3000">Go To Instagaram</a></h2>
    //         </div>
            
    //     `)
    // }
    catch(error){
        console.log('error : ', error)
        res.status(500).send(`Internal Service Error`)
    }
}
module.exports.sendVerificationLink = async (req,res) =>{
    let body = req.body
    let uid = body.uid
    try{
        const token = JWT.sign({uid : uid}, "ugwhre352w")
        console.log('token : ', token)

        const date = new Date();

        const UPDATE_VERIFICATION_CODE = `UPDATE verification SET verificationcode = ?, createddate = ? WHERE uid = ?`
        const [INFO2] = await database.execute(UPDATE_VERIFICATION_CODE, [token, date, uid])

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : `${body.email}`,
                pass : "nyxbegqqntyfvbob"
            },
            tls : { rejectUnauthorized : false }
        })
    
        await transporter.sendMail({
            from : '<admin/> sevilenfilbert@gmail.com',
            to : 'sevilenfilbert@gmail.com',
            subject : 'Instagaram Verification',
            html : `
                <p>please verify your account using this link.</p>
                <p>link : <a href="http://localhost:5000/api/auth/${token}">Verification Link</a></p>
    
                <p>NOTE : do not share this code.</p>
            `
        })
        res.status(200).send('New Email verification has been send')
    }
    catch(error){
        console.log('error : ', error)
        res.status(500).send(`Internal Service Error`)
    }
}
module.exports.sendResetPasswordPage = async (req,res) =>{
    const email = req.body.email
    try{
        const GET_USER = `SELECT uid FROM users WHERE email = ?`
        const [USER] = await database.execute(GET_USER, [email])
        console.log(USER)

        if(!USER.length){
            return res.status(404).send(`User not found`)
        }

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : `${email}`,
                pass : "nyxbegqqntyfvbob"
            },
            tls : { rejectUnauthorized : false }
        })
    
        await transporter.sendMail({
            from : '<admin/> sevilenfilbert@gmail.com',
            to : 'sevilenfilbert@gmail.com',
            subject : 'Instagaram Password Reset',
            html : `
                <p>Reset your account's password using this link.</p>
                <p>link : <a href="http://localhost:3000/reset-password/${USER[0].uid}">Verification Link</a></p>
    
                <p>NOTE : do not share this code.</p>
            `
        })
        res.status(200).send('New Email verification has been send')
    }
    catch(error){
        console.log('error : ', error)
        res.status(500).send(`Internal Service Error`)
    }
    
}
module.exports.resetPassword = async(req,res) =>{
    const data = req.body
    console.log(data)
    try{
        //validate body
        const {error} = forgetPasswordSchema.validate(data)
        if(error){
            return res.status(400).send(error.message)
        }

        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(data.password,salt)

        const CHANGE_PASSWORD = `UPDATE users SET password = ? WHERE uid = ?`
        const [INFO] = await database.execute(CHANGE_PASSWORD, [hashpassword, data.uid])

        res.status(200).send('Reset password success')
    }
    catch(error){
        console.log('error : ', error)
        res.status(500).send(`Internal Service Error`)
    }
}