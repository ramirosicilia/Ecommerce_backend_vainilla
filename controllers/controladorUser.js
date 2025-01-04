import { crearUserDB } from "../model/usuarioDB.js"
import { obtenerUsuarioDB } from "../model/usuarioDB.js"
import bcrypt from "bcryptjs"; 



export async function crearUser(req, res){      
    try{
        const {nombre,apellido,dni,usuario,email,contrasena:usuarioContrasena} = req.body; 
        Number(dni);
         console.log(req.body, 'req.body') 
        const usuarios = await obtenerUsuarioDB(usuario,email); 

        if(usuarios.data.length > 0){  
            res.status(400).json({error: 'Usuario ya existe'}); 
            return; 
        }


    
          const hash= await bcrypt.hash(usuarioContrasena, 10);
          const data = {email:email,contrasena:hash,dni:dni,apellido:apellido,nombre:nombre,usuario:usuario};
          const respuesta = await crearUserDB(data); 
          console.log(data , 'data') 
         console.log(respuesta,'respuesta')

        if(respuesta){
                res.status(200).json({message: 'Usuario creado, exictosamente' , });
        }else{
                res.status(400).json({error: 'Error creando el usuario'});
        }   
    }
    catch(err){
        console.error('Error en la creación de usuarios:', err.message);
        res.status(500).json({message: 'Error creando el usuario', error: err.message});
    }   
} 


