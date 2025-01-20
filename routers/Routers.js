import { authenticateToken, controladorAdmin,
        controladorLogeo, controladorUser,
        enviarProductos, nuevoRegistroControlador, recuperacionCuentaController, 
        recuperacionMailControlador
    } from "../controllers/Controladores.js"; 
 import { obtenerProductoID } from "../controllers/Controladores.js";
 import {  updateCarrito } from "../controllers/controladorAdmin.js";
 import { desactivarProductosController } from "../controllers/desactivarProductController.js";
 import { administradorRegistro, deleteCarrito, respuestaInsercion } from "../controllers/controladorAdmin.js";
 import { crearUser } from "../controllers/controladorUser.js";
 import { upload } from "../controllers/controladorAdmin.js"; 
 import express from "express" 
 import { actualizarCategoriaController, agregarCategoriaControllers, desactivarCategoriasController, eliminarCategoriaController, getProductsCategorysController } from "../controllers/ControladorCategorias.js";




const router = express.Router(); 


router.get("/obtener-productos",enviarProductos) 
router.get("/obtener-productos/:id",obtenerProductoID)
router.get('/ruta-protegida', authenticateToken)
router.post("/login-logeado",controladorLogeo,controladorAdmin,controladorUser)
router.post("/login",administradorRegistro) 
router.post("/registro",crearUser) 
router.post("/recuperacion-cuenta",recuperacionCuentaController)
router.get('/verificar-email/:token', recuperacionMailControlador) 
router.post("/nuevo-registro",nuevoRegistroControlador) 
router.post("/agregar-categorias",agregarCategoriaControllers)
router.get("/obtener-categorias",getProductsCategorysController) 
router.put("/actualizar-categoria/:id",actualizarCategoriaController)
router.put("/desactivar-productos/:id",desactivarProductosController)
router.put("/desactivar-categoria",desactivarCategoriasController) 
router.delete("/eliminar-categoria",eliminarCategoriaController)

router.post("/subir-productos",upload.single('imagen'),respuestaInsercion) 
router.put("/actualizar-productos/:id", upload.single('imagen'),updateCarrito) 
router.delete("/borrar-productos/:id",deleteCarrito) 





export default router 


    
