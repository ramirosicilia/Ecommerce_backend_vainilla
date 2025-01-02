
import dotenv from "dotenv";
import { obtenerProductos } from "../model/carritoDB.js"; 
import { obtenerProductoPorId } from "../model/carritoDB.js"; 
import { logeoDB, updateCookie } from "../model/loginDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import { obtenerAdministrador } from "../model/adminDB.js";
import { token } from "morgan";





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



export async function controladorLogeo(req, res, next) {
    const { userInto: usuarioIngresado, passwordInto: passWordIngresado } = req.body;

    try {
        // Validación de entrada
        if (!usuarioIngresado) {
            return res.status(400).json({ err: 'El usuario no fue proporcionado' });
        }
        if (!passWordIngresado) {
            return res.status(400).json({ err: 'La contraseña no fue proporcionada' });
        }

        // Obtener el usuario y el administrador de la base de datos
        const obtenerLogeoDB = await logeoDB(usuarioIngresado);
        const obtenerAdminDB = await obtenerAdministrador(usuarioIngresado);

        const data = obtenerLogeoDB?.usuarios || [];
        const dataAdmin = obtenerAdminDB?.[0] || null;

        // Verificar si no se encontró ni el usuario ni el administrador
        if (!data.length && !dataAdmin) {
            return res.status(404).json({ err:'no ay registros con ese usuario!!' });
        }

        // Lógica para administrar el login del administrador
        if (dataAdmin && dataAdmin.contrasena) {
            const verificarContraseñaAdmin = await bcrypt.compare(passWordIngresado, dataAdmin.contrasena);
            if (!verificarContraseñaAdmin) {
                return res.status(401).json({ err: 'Contraseña incorrecta para el administrador' });
            }
            console.log('Administrador autenticado:', dataAdmin);

            req.isAdmin = true; // Marca como administrador verificado
            req.dataAdmin = dataAdmin; // Almacena los datos del administrador
            return next(); // Pasa al siguiente controlador
        }

        // Lógica para el login del usuario
        if (data.length > 0) {
            const verificarContraseña = await bcrypt.compare(passWordIngresado, data[0].contrasena);
            if (!verificarContraseña) {
                return res.status(401).json({ err: 'Contraseña incorrecta para el usuario' });
            }
            console.log('Usuario autenticado:', data[0]);

            // Generar token y configurar cookies solo para usuarios
            const token = jwt.sign({ user: data[0].usuario }, process.env.JWT_SECRET, { expiresIn: "1h" });
            await updateCookie(data[0].usuario, token);

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 3600000 // 1 hora
            });

           

            req.token = token; // Almacena el token en la solicitud
            req.isUser = true; // Marca como usuario verificado 
            req.dataUser = data[0].dni; // Almacena los datos del usuario
     

            return next(); // Pasa al siguiente controlador
        }
    } catch (err) {
        console.error('Error en el controladorLogeo:', err);
        res.status(500).json({ err: 'No se pudo logear en la base de datos' });
    }
}




export function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token ; 
  
    if (!token) {
        return res.status(401).json({ error: 'No autorizado, falta token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token no válido' }); 
        }
        req.user = user; 
        res.json({respuesta:"token valido",token}) 
      
        
    }); 
    next();

    
} 

export async function controladorAdmin(req,res,next){  



     try{  

       const {isAdmin,dataAdmin}=req  

     

         if(isAdmin){
            return  res.json({respuesta:' administrador exictosamente',dataAdmin,reedireccionar:'../public/dashboard.html'})
         } 

        return next()

     }
       
            
      catch(err){
            res.status(500).json({err:'no se pudo logear en la base de datos'})
        } 
         
   } 



  export async function controladorUser(req,res,next){  



    try{  

        const {isUser,dataUser,token}=req 
          if( isUser){
              return res.json({respuesta:' usuario exictosamente',token,usuario:dataUser,reedireccionar:'../public/paginaProductos.html'})
          } 
     
            else{
               return  res.json({respuesta:'incorrectamente'})
            }
    
    }
      
           
       catch(err){
           res.status(500).json({err:'no se pudo logear en la base de datos'})
       }  

       return next()
        
  } 

















