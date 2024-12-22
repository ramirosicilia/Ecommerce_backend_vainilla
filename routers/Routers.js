import { deleteCarrito, enviarProductos } from "../controllers/Controladores.js"; 
import { insetarCarrito } from "../controllers/Controladores.js";
import { updateCarrito } from "../controllers/Controladores.js";
import express from "express" 

const router = express.Router(); 


router.get("/obtener-productos",enviarProductos) 
router.post("/insertar-productos",insetarCarrito) 
router.put("/actualizar-productos/:id",updateCarrito) 
router.delete("/borrar-productos/:id",deleteCarrito) 


export default router
    
