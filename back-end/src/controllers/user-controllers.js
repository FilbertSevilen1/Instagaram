const uuid = require('uuid')
const database = require("../config").promise()
const { patchUserSchema } = require('../helpers/schema-validation')
const multer = require('multer')
const upload = multer({dest: 'public/'})

const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

module.exports.getUsers = async(req,res) => {
    try{
        const GET_USERS = `SELECT * FROM users`;
        const [USERS] = await database.execute(GET_USERS)

        res.status(200).send(USERS)
    }
    catch(error){
        console.log('error : ',error);
        res.status(500).send('Internal service error')
    }
    
}

module.exports.getUsersByUid = async(req,res) => {
    const uid = req.params.uid
    try{
        const GET_USER = `SELECT * FROM users WHERE uid = ?`
        const [ USER ] = await database.execute(GET_USER, [uid])
        if(!USER.length){
            return res.status(404).send('404 : User not found')
        }
        delete USER[0].password

        res.status(200).send(USER)
    }
    catch(error){
        console.log('error : ',error);
        res.status(500).send('Internal service error')
    }
}

module.exports.getUsersByUsername = async(req,res) => {
    const username = req.params.username
    console.log(username)
    try{
        const GET_USER = `SELECT * FROM users WHERE username = ?`
        const [ USER ] = await database.execute(GET_USER, [username])
        if(!USER.length){
            return res.status(404).send('404 : User not found')
        }
        delete USER[0].password

        res.status(200).send(USER)
    }
    catch(error){
        console.log('error : ',error);
        res.status(500).send('Internal service error')
    }
}

module.exports.uploadProfilePicture = async(req,res) =>{
    console.log(req.file.path)
    console.log(req.body.uid)

    let path = req.file.filename
    console.log(path)
    const body = req.body

    try{
        //check if profile picture already exists
        const GET_PROFILE_PICTURE = `SELECT profilepicture FROM users WHERE uid = ?`
        const [USER] = await database.execute(GET_PROFILE_PICTURE, [body.uid])

        if(USER[0].profilepicture){
            await unlinkAsync("public\\" + USER[0].profilepicture)
        }

        const UPDATE_PROFILE_PICTURE = `UPDATE users SET profilepicture = ? WHERE uid = ?`
        const [INFO] = await database.execute(UPDATE_PROFILE_PICTURE,["profiles/" + path, body.uid])
        res.status(202).send("Success")  
    }   
    catch(error){
        await unlinkAsync(req.file.path)
        console.log('error : ',error);
        res.status(500).send('Internal service error')
    }
    
}

module.exports.patchUser = async(req,res) => {
    const uid = req.params.uid
    const body = req.body
    console.log(body)
    try{
        //check if user exists
        const CHECK_USER = `SELECT * FROM users WHERE uid = ?`
        const [ USER ] = await database.execute(CHECK_USER, [uid])
        if(!USER.length){
            return res.status(404).send("User not Found")
        }
        //check body values
        const isEmpty = !Object.values(body).length
        if(isEmpty){
            return res.status(400).send("Bad Request")
        }
        //check if username already used
        const CHECK_USERNAME = `SELECT * FROM users`
        const [ LISTUSERS ] = await database.execute(CHECK_USERNAME)
        let found = false;
        for(let i=0;i<LISTUSERS.length;i++){
            if(LISTUSERS[i].username === body.username && LISTUSERS[i].uid !== uid){
                found = true;
            }
        }
        
        if(found){
            return res.status(400).send('Username is already used')
        }
        //define query
        //change username at post
        const CHANGE_POST_USERNAME = `UPDATE post SET username = ? WHERE username = ?`
        const [CHANGE_INFO] = await database.execute(CHANGE_POST_USERNAME,[body.username, USER[0].username])

        let values = []
        for(let key in body){
            values.push(`${key} = '${body[key]}'`)
        }
        const UPDATE_USER = `UPDATE users SET ${values} WHERE uid = ?`
        const [ INFO ] = await database.execute(UPDATE_USER, [uid])
        // console.log('Info : ', INFO)

        res.status(202).send("Data Updated")
    }
    catch(error){
        console.log('error : ',error);
        res.status(500).send('Internal service error')
    }
}