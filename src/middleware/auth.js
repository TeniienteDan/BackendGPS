const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

//autenticacion
const authentication= (res, req, next)=>{
    const secreto= process.env.SECRET;
    const head= req.headers.authorizacion;
    const token = head && head.split(' ')[1];
    if(!token){
        return res.status(401).send({message:'No se proporciono token'});
    }
    try{
        const decode= jwt.verify(token, secreto);
        req.user= decode;
        next();
    }catch(err){
        return res.status(401).send({message:'Token invalido'});
    }
}

//autorizacion
const secreto= process.env.SECRET;
const authorization=expressJwt.expressjwt({secret:secreto, algorithms:['HS256']});

module.exports={authentication, authorization};