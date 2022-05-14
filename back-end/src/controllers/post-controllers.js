const database = require("../config").promise()

const multer = require('multer')
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

module.exports.postGaram = async (req,res) =>{
    let body = req.body
    let path = ""
    if(req.file){
         path = req.file.filename
    }
    try{
        const POST_GARAM = `INSERT INTO post (username, postcontent, likecount, postpicture) VALUES (?,?,0,?)`
        const [INFO] = await database.execute(POST_GARAM, [body.username, body.postcontent, path])

        console.log(INFO)
        res.status(201).send('Garam has been created')
    }
    catch(error){
        await unlinkAsync(req.file.path)
        console.log(error)
        res.status(500).send(`Internal Service Error`)
    }
}
module.exports.getGarams = async (req,res) =>{
    try{
        const GET_GARAMS = `SELECT * FROM post`
        const [GARAMS] = await database.execute(GET_GARAMS)

        res.status(200).send(GARAMS)
    }
    catch(error){
        console.log(error)
        res.status(500).send(`Internal Service Error`)
    }
}
module.exports.deleteGaram = async (req,res) =>{
    const id = req.params.id
    try{
        const SELECT_PICTURE_TO_DELETE = `SELECT postpicture FROM post WHERE id = ?`
        const [DELETE] = await database.execute(SELECT_PICTURE_TO_DELETE, [id]);

        console.log(DELETE)

        if(DELETE[0].postpicture){
            await unlinkAsync("public\\posts\\" + DELETE[0].postpicture)
        }

        const DELETE_GARAMS = `DELETE FROM post WHERE id = ?`
        const [GARAMS] = await database.execute(DELETE_GARAMS,[id])

        res.status(200).send('DELETE SUCCESS')
    }
    catch(error){
        console.log(error)
        res.status(500).send(`Internal Service Error`)
    }
}