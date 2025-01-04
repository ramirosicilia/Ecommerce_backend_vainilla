
import dotenv from "dotenv";
import { obtenerProductos } from "../model/carritoDB.js"; 
import { obtenerProductoPorId } from "../model/carritoDB.js"; 
import { logeoDB, recuperacionCuentaDB, updateCookie} from "../model/loginDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import { obtenerAdministrador } from "../model/adminDB.js";
import { token } from "morgan";
import { validarMail } from "../email/recuperacionMail.js";
import path from "path"; 
import { fileURLToPath } from "url"; 
import { updateUserDB } from "../model/adminDB.js";
import { updateUsuarioDB } from "../model/usuarioDB.js";







const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
let adjuntarMail=null


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
     
            return next()
    }
      
           
       catch(err){
           res.status(500).json({err:'no se pudo logear en la base de datos'})
       }  

       return next()
        
  } 

  export async function recuperacionCuentaController(req,res){ 

    const Email=req.body.email 



    const dataEmail=await recuperacionCuentaDB(Email) 

        if(!dataEmail){
            return res.status(404).json({error:'el email no se encuentra registrado'})
        }
    

    console.log(dataEmail,'data email') 

    const token=jwt.sign({email:dataEmail},process.env.JWT_SECRET_EMAIL,{expiresIn:'1h'}) 
       
    const {email}=dataEmail 

    console.log(email,'email')

       let validacionMail= await validarMail(email,token) 

       if(!validacionMail){
           return res.status(404).json({error:'no se pudo enviar el mail'})

         }	
           
             console.log(validacionMail,'mail enviado') 
             adjuntarMail=dataEmail
             res.status(200).json({ ok: true, token });
  } 


  export async function recuperacionMailControlador(req,res){ 

    const token=req.params.token 

    console.log(token,'token')

    try{ 

        jwt.verify(token,process.env.JWT_SECRET_EMAIL,(err,usuario)=>{ 

            if(err){
                return res.status(404).json({error:'el token no es valido'})
            } 
    

           
        })   
        
        res.sendFile(path.join(__dirname,'../../Ecommerce-js-production-Front/public/nuevoRegistro.html'))
    } 
    
    catch(err){
        res.status(500).json({err:'no se pudo verificar el token'})
    }

  } 

   let ingresoUsuario=null
   let ingresoAdmin=null


  export  async function nuevoRegistroControlador(req,res){ 


   const {usuario,password}=req.body 

        try{   

            console.log(adjuntarMail,'adjuntarMail') 

            if(adjuntarMail.verificado===true){ 
             ingresoAdmin=adjuntarMail.email 
            
                let contraseñaHasheada=await bcrypt.hash(password,10)
            
               let ingresoAdminDB=await updateUserDB(usuario,contraseñaHasheada,ingresoAdmin) 
            
               console.log(ingresoAdminDB,'ingresoAdminDB')
            
                if(ingresoAdminDB.data[0].nombre_usuario===usuario && ingresoAdminDB.data[0].email===ingresoAdmin){ 
                    console.log('se cumplio la condicion') 
                
                
                    console.log(ingresoAdminDB.data[0].nombre_usuario,'ingresoAdminDB.data[0].nombre_usuario')

                    return res.json({reedireccion:'../public/dashboard.html'})
                
                }   
            
            }
        
            if(adjuntarMail.verificado===false){ 
              ingresoUsuario=adjuntarMail.email  
            
                let contraseñaHasheada=await bcrypt.hash(password,10)
            
                let ingresoUsuarioDB=await updateUsuarioDB(usuario,contraseñaHasheada,ingresoUsuario) 
            
                console.log(ingresoUsuarioDB,'ingresoUsuarioDB ')
            
                if(ingresoUsuarioDB.data[0].usuario===usuario && ingresoUsuarioDB.data[0].email===ingresoUsuario){ 
                    console.log('usuario') 
                
                    console.log(ingresoUsuarioDB.data[0].usuario,'ingresoUsuarioDB.data[0].usuario')

                    return res.json({reedireccion:'../public/paginaProductos.html'})                
                } 

            }     
    
            return res.json({error:'no se pudo verificar el email'})

        } 

        catch(err){
            res.status(500).json({err:'no se pudo verificar el token'}) 
        
        
        }


   }  
    
   


















