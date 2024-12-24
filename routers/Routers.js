import { deleteCarrito, enviarProductos, subirProducto} from "../controllers/Controladores.js"; 
import { updateCarrito } from "../controllers/Controladores.js";
import { obtenerProductoID } from "../controllers/Controladores.js";
import { administradorRegistro } from "../controllers/controladorAdmin.js";
import { obtenerAdminitradorController } from "../controllers/controladorAdmin.js";
import { crearUser } from "../controllers/controladorUser.js";
import { obtenerUsuario } from "../controllers/controladorUser.js";

import express from "express" 

const router = express.Router(); 


router.get("/obtener-productos",enviarProductos) 
router.get("/obtener-productos/:id",obtenerProductoID)
router.get("/obtener-usuarios",obtenerUsuario)
router.get("/obtener-administrador",obtenerAdminitradorController)
router.post("/login",administradorRegistro) 
router.post("/admin", subirProducto)
router.post("/registro",crearUser)
router.put("/actualizar-productos/:id",updateCarrito) 
router.delete("/borrar-productos/:id",deleteCarrito) 




export default router
    
