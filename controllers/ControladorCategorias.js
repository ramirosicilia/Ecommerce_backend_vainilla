
import { actualizarCategoriaDB, desactivarCategoryDB, eliminarCategoriaDB, obtenerCatergoriaDB, obtenerProductosYCategorias } from "../model/carritoDB.js"; 
import { ingresarCategoriaDB } from "../model/carritoDB.js";



export async function getProductsCategorysController(req,res){ 

    try{ 
  
      const categorias=await obtenerProductosYCategorias() 
  
      if(categorias.length===0){
        throw new Error('no se obtuvieron los productos y categorias')
      }
  
      res.json(categorias)
  
    } 
  
    catch(err){ 
      res.status(500).json({ error: err.message });
  
    }
  
  
  } 
  

export async function agregarCategoriaControllers(req,res) {   
       const nuevaCategoria=req.body.category 
       console.log(nuevaCategoria,'nueva categoria') 

       try{ 

       let categoryExist=await obtenerCatergoriaDB(nuevaCategoria) 

       if(categoryExist.length>0){
        throw new Error("la categoria ya existe");
        
       } 
       

        let categoryNew=await ingresarCategoriaDB({nombre_categoria:nuevaCategoria,activo:true}) 

        if(categoryNew.length===0){
          throw new Error("No se pudo insertar la categoria");
          
        }

        console.log(categoryNew, 'se insertooo')
  
      
    
        return res.json(categoryNew)
       
       }  




       catch(err){
        return res.status(500).json(err.menssage)
       }
     

       
  }  


  export async function actualizarCategoriaController(req,res){  

    const nuevoNombre=req.body.nuevoNombre 
       const {id}=req.params
      
    console.log(id,'nombre de antes')
    console.log(nuevoNombre,"nuevo nombre")

    try{ 

      const actualizarCategoria= await actualizarCategoriaDB(id,nuevoNombre) 

      console.log(actualizarCategoria)
      
      res.json(nuevoNombre)
  
    } 
  
    catch(err){ 
     return res.json(err.message)
  
    }
      
  
    }
    



  export async function eliminarCategoriaController(req,res){  

  try{ 
    const {nombre}=req.body 

    if(!nombre){
      throw new Error("no se obtubo el nombre de la categoria")
    }

    let categoryEliminada=await eliminarCategoriaDB(nombre)

   return res.json(nombre)


  } 

  catch(err){ 
   return res.json(err.message)

  }
    

  } 

  export async function desactivarCategoriasController(req,res){ 


    const{categoria, activo} =req.body 

    const desactivarCategoriaDB=await desactivarCategoryDB(categoria,activo) 
    console.log(desactivarCategoriaDB,'desactivar')

    console.log(categoria,activo , 'se obtuvieron') 
    res.json({message:'se desactivo con exicto',desactivar:desactivarCategoriaDB[0].activo})
    
  }
  