import { crearUserDB } from "../model/usuarioDB.js"
import { obtenerUsuarioDB } from "../model/usuarioDB.js"


export async function crearUser(req, res){      
    try{
        const {nombre_usuario,email,contrasena,verificado} = req.body; 
        const data = {nombre_usuario,email,contrasena,verificado};
        const respuesta = await crearUserDB(data);
        if(respuesta.success){
            res.status(200).json({message: 'Usuario creado', data: respuesta.data});
        }else{
            res.status(400).json({message: 'Error creando el usuario', error: respuesta.error});
        }   
    }
    catch(err){
        console.error('Error en la creación de usuarios:', err.message);
        res.status(500).json({message: 'Error creando el usuario', error: err.message});
    }   
} 

export async function obtenerUsuario(req, res){
    try{
        const respuesta = await obtenerUsuarioDB();
        if(respuesta.success){
            res.status(200).json({message: 'Usuarios obtenidos', data: respuesta.data});
        }else{
            res.status(400).json({message: 'Error obteniendo los usuarios', error: respuesta.error});
        }
    }
    catch(err){
        console.error('Error al obtener los usuarios:', err.message);
        res.status(500).json({message: 'Error al obtener los usuarios', error: err.message});
    }
}
