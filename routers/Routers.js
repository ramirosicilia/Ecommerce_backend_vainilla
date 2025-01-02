import { authenticateToken, controladorAdmin, controladorLogeo, controladorUser, enviarProductos} from "../controllers/Controladores.js"; 
 import { updateCarrito } from "../controllers/controladorAdmin.js";
import { obtenerProductoID } from "../controllers/Controladores.js";
import { administradorRegistro, deleteCarrito, respuestaInsercion } from "../controllers/controladorAdmin.js";
import { crearUser } from "../controllers/controladorUser.js";
import { upload } from "../controllers/controladorAdmin.js";


import express from "express" 



const router = express.Router(); 


router.get("/obtener-productos",enviarProductos) 
router.get("/obtener-productos/:id",obtenerProductoID)
router.get('/ruta-protegida', authenticateToken)
router.post("/login-logeado",controladorLogeo,controladorAdmin,controladorUser)
router.post("/login",administradorRegistro) 
router.post("/registro",crearUser) 
router.post("/subir-productos",upload.single('imagen'),respuestaInsercion)
router.put("/actualizar-productos/:id",updateCarrito) 
router.delete("/borrar-productos/:id",deleteCarrito) 




export default router
    
