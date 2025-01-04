import { supabase } from "./DB.js"


export async function logeoDB(user){ 

    try{ 
      const { data, error } = await supabase
      .from('usuarios')
      .select()
      .eq('usuario', user);

         if(error){
            throw new Error("hubo un error zzzzzzz",error.message);
            
         } 

         

         console.log(data,'33333333') 
         

         return{
            usuarios:data
         }

    } 

    catch(err){
        console.log('no se encontro el usuario')
    }
    
} 

export async function updateCookie(user,token){

   try{
      const { data ,error } = await supabase
             .from('usuarios')
             .update({ cookie: token})
             .eq('usuario', user)
             .select();
             
             if(error){
               throw new Error("mensaje de error",error.message);
               
             }

             return{
               data
             }

   } 



   catch{ 
      console.log('no se pudo actualizar la cookie')

   }
} 

export async function recuperacionCuentaDB(mail){

   try {
      const { data: usuariosData } = await supabase
        .from('usuarios')
        .select()
        .eq('email', mail);
    
      if (!usuariosData) {
        throw new Error('Error al buscar el email en usuarios: ');
      }
    
      const { data: adminData} = await supabase
        .from('administrador')
        .select()
        .eq('email', mail);
    
      if (!adminData) {
        throw new Error('Error al buscar el email en administrador: ');
      }
    
      // Combina los datos de ambas consultas
      const combinedData = [...usuariosData, ...adminData];
    
      console.log(combinedData, 'data recuperada');
    
      return combinedData[0]
        
    
    } catch (err) {
      console.log('Error:', err.message);
    
      // Retorna el error si ocurre alguna excepción
    }
    
    

}



   
   