import { obtenerProductosYCategorias } from "../model/carritoDB.js"; 


export async function obtenerProductosVentaControlador(req, res) {
    try {
        const productos = await obtenerProductosYCategorias();  

        if(productos.length===0){
            throw new Error('No se obtuvieron los productos')
        }
        console.log(productos,'data recibida')
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    }