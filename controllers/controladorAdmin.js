import dotenv from "dotenv"

dotenv.config() 

const Url_backend=process.env.UL_BACKEND

export async function adminVista(req,res) { 

    res.render('admin',{urlBackend:Url_backend})
    
}
