import { authenticateToken, controladorLogeo, enviarProductos} from "../controllers/Controladores.js"; 
 import { updateCarrito } from "../controllers/controladorAdmin.js";
import { obtenerProductoID } from "../controllers/Controladores.js";
import { administradorRegistro, deleteCarrito, respuestaInsercion } from "../controllers/controladorAdmin.js";
import { obtenerAdminitradorController } from "../controllers/controladorAdmin.js";
import { crearUser } from "../controllers/controladorUser.js";
import { upload } from "../controllers/controladorAdmin.js";


import express from "express" 



const router = express.Router(); 


router.get("/obtener-productos",enviarProductos) 
router.get("/obtener-productos/:id",obtenerProductoID)
router.get("/obtener-administrador",obtenerAdminitradorController)
router.post("/login-logeado",controladorLogeo)
router.post("/login",administradorRegistro) 
router.post("/registro",crearUser) 
router.get('/ruta-protegida', authenticateToken) 
router.post("/subir-productos",upload.single('imagen'),respuestaInsercion)
router.put("/actualizar-productos/:id",updateCarrito) 
router.delete("/borrar-productos/:id",deleteCarrito) 




export default router
    
