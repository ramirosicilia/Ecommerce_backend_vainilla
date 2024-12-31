
import dotenv from "dotenv";
import { obtenerProductos } from "../model/carritoDB.js"; 
import { obtenerProductoPorId } from "../model/carritoDB.js"; 
import { logeoDB, updateCookie } from "../model/loginDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 




dotenv.config();

export async function enviarProductos(req,res){  
    
    try{   
        let data=await obtenerProductos() 

        if(!data){
            console.log('no se recibieron los productos')
        } 

        res.json({actulizado:true,data})


    } 

    catch(err){
        res.status(500).json('ocurrio un error al recibir los productos',err.message)
    }

}  




export async function obtenerProductoID(req,res){  
    let {id}=req.params 

    try{ 
        let data=await obtenerProductoPorId(id) 

        if(!data){
            console.log('no se recibieron los productos')
        } 

        res.json({actulizado:true,data})
    } 

    catch(err){
        res.status(500).json('ocurrio un error al recibir los productos',err.message)
    }

} 

export async function controladorLogeo(req,res){  

    const { userInto: usuarioIngresado,passwordInto: passWordIngresado,}=req.body
       
          
     try{ 

        if(!usuarioIngresado || !passWordIngresado){
           return res.status(400).json({err:'no se obtuvo ni el usuario ni la contraseña'})
        } 

   


        const obtenerLogeoDB= await logeoDB(usuarioIngresado)  

        const {usuarios:data}= obtenerLogeoDB

        console.log(data,'la dataaaaaa')
    
 
        const verificarContraseña= await bcrypt.compare(passWordIngresado,data[0].contrasena) 
          console.log(verificarContraseña) 
         
        if(!verificarContraseña){
          return  res.status(500).json({err:'la contraseñas no coinciden'})
        } 

        const token = jwt.sign({user:data.usuario}, process.env.JWT_SECRET, { expiresIn: "1h" });
             console.log(typeof token,'token')  

          await updateCookie(data[0].usuario,token)

          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Solo para HTTPS en producción
            sameSite: "strict", // Mejora la seguridad de las cookies
            maxAge: 60 * 60 * 1000, // 1 hora
        });
        

           res.json({respuesta:"logeado exictosamente"})

        } 
    

        catch(err){
            res.status(500).json({err:'no se pudo logear en la base de datos'})
        }

}   


export function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]  
    console.log(token)

    if (!token) {
        return res.status(401).json({ error: 'No autorizado, falta token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token no válido' });
        }
        req.user = user;
        next();
    });
} 
