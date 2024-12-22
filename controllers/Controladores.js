


import { obtenerProductos } from "../model/carritoDB.js"; 
import { insetarCarritoDB } from "../model/carritoDB.js";
import { updateCarritoDB } from "../model/carritoDB.js"; 
import { borrarCarritoDB } from "../model/carritoDB.js";


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


export async function insetarCarrito(req,res){ 
    const {nombre_producto,precio,categoria,imagenes}=req.body 
    let data={nombre_producto,precio,categoria,imagenes} 

    try{
        let response=await insetarCarritoDB(data) 

        if(!response.success){
         return res.status(500).json('ocurrio un error al insetar los productos',response.message)
        } 

        res.json({actualizado:true,data:response.data}) 
    } 

    catch(err){
        res.status(500).json('ocurrio un error al insetar los productos',err.message)
    }

} 



export async function updateCarrito(req,res){  
    let {id}=req.params 
    let {nombre_producto,precio,categoria,imagenes}=req.body 
    let updata={nombre_producto,precio,categoria,imagenes}

    try{ 
      
    
        let data=await updateCarritoDB(id,updata) 
        let obtenerObjecto=data.find((element)=>element.producto_id==id)

        if(!obtenerObjecto){
            console.log('no se recibieron los productos')
        } 

        res.json({actulizado:true,obtenerObjecto}) 
    } 

    catch(err){
        res.status(500).json('ocurrio un error al actualizar los productos los productos',err.message)
    }

} 

export async function deleteCarrito(req, res) {
    let { id } = req.params; // Extraer el ID de los parámetros de la URL

    try {
        let data = await borrarCarritoDB(id); 
        console.log(data)

        if (!data) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        res.json({ eliminado: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error eliminando el producto', error: err.message });
    }
}
