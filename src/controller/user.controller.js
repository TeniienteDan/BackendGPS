var User = require('../model/user.js');
//llamar a los 2 instalados
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');



//get
const getUser = (req, res)=>{
    User.find({},(err,user)=>{
        if(err){
            return res.status(500).send({message:'Error al listar usuario'});
        }
        res.status(200).send({user});
    })
}
//post
const insertUser = async (req, res) =>{
    //encriptacion
    //recordar la promesa, async debe esperar a recibir la contraseña para encriptarla
    const passwordBody = req.body.password;
    const passwordHash = await bcrypt.hash(passwordBody,10);
    
    try{ 
        let user = new User();
        user.name= req.body.name;
        user.password=passwordHash;
        user.save((err,userStore)=>{
            if(err){
                return res.status(500).send({message:'No fue posible ingresar el usuario'});
            }
            res.status(200).send({userStore});
        });
    }catch(err){
        return res.status(500).send({message:'Error interno'});
    }
}
//put
const updateUser = async(req, res) =>{
    const passwordBody= req.body.password;
    const passwordHash= await bcrypt.hash(passwordBody, 10);

    let id = req.params._id;
    let name = req.body.name;
    let password = passwordHash;
    User.findByIdAndUpdate(id, {name:name,password:password},(err,user)=>{
        if(err){
            return res.status(500).send({message:'No fue posible actualizar el usuario'});
        }
        if(!user){
            return res.status(404).send({message:'No se encuentra el usuario'});
        }
        res.status(200).send({user});
    })
}
//delete
const deleteUser = (req, res) => {
    let id = req.params._id;
    User.findById(id, (err,user)=>{
        if(err){
            return res.status(500).send({message:'Error interno'});
        }
        user.remove((err)=>{
            if(err){
                return res.status(500).send({mesage:'No fue posible eliminar'});
            }
            res.status(200).send({message:'Usuario eliminado'});
        })
    })
}
//searchById
const searchUserById = (req, res) =>{
    let id = req.params._id;
    User.findById(id,(err, use)=>{
        if(err){
            return res.status(500).send({message:'Error interno'});
        }
        if(!use){
            return res.status(404).send({message:'No se encontro el usuario'});
        }
        res.status(200).send({use});
    })
}

const login= async(req, res, next)=>{
    try{
        const name = req.body.name;
        const password = req.body.password;
        //objeto completo
        const user = await User.findOne({name});
        if(!user){
            return res.status(401).send({message:'Usuario invalido'});
        }
        const passwordMatch= await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).send({message:'Contraseña invalida'});
        }
        //creacion token 
        const secreto= process.env.SECRET;
        const token = jwt.sign({userId:user._id},secreto,{expiresIn:'7h'});
        res.json({token});
    }catch(err){
        next(err);
    }
}
module.exports = {getUser, insertUser, updateUser, deleteUser, searchUserById, login};
