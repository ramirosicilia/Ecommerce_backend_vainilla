import { crearUserDB } from "../model/usuarioDB.js"
import { obtenerUsuarioDB } from "../model/usuarioDB.js"
import bcrypt from "bcryptjs"; 



export async function crearUser(req, res){      

    try{
        const {nombre,apellido,dni,usuario,email,contrasena:usuarioContrasena} = req.body; 
        Number(dni);
       
        const usuarios = await obtenerUsuarioDB(usuario,email); 
        console.log(usuarios,'data recibida') 


        /*const usuarioExistente=usuarios.data[0].usuario 
        const emailExistente=usuarios.data[0].email            con objectos hay que tener un usuario ya ingresado en DB sino da Undefined la Validacion/*
        const dniExistente=usuarios.data[0].dni*/

       
        if(usuarios.length>0){  
        
            console.log('Usuario ya existe');
            throw new Error('Usuario ya existe'); 
           
        }  


          
          const hash= await bcrypt.hash(usuarioContrasena, 10);
          const data = {email:email,contrasena:hash,dni:dni,apellido:apellido,nombre:nombre,usuario:usuario}; 
          console.log(data)
          const respuesta = await crearUserDB(data); 
          
         console.log(respuesta,'respuesta') 
         

        if(respuesta){
                res.status(200).json({message: 'Usuario creado, exictosamente' , });
        }else{
                res.status(400).json({error: 'Error creando el usuario'});
        }   

      
    }
    catch(err){
      
        res.status(400).json({ error: err.message});
    }   
} 


