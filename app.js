import express from "express";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import router from "./routers/Routers.js"; 
import morgan from "morgan";



 


dotenv.config();

const app = express();
//app.use(morgan("dev"))
app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5502', // Especifica el origen permitido
  credentials: true,               // Permite el envío de cookies y encabezados de autenticación
}));


const __fieldName=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__fieldName);


app.use("/verificar-email",express.static( path.join(__dirname,  "../Ecommerce-js-production-Front/public"))) 
app.use("/nuevo-registro",express.static( path.join(__dirname,  "../Ecommerce-js-production-Front/public"))) 
app.use("/public", express.static(path.join(__dirname, "../Ecommerce-js-production-Front/public")));



app.use("/uploads", express.static(path.join(__dirname, './uploads'))); 



// Ruta para obtener los productos de la base de datos


app.use('/',router) 

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Puerto donde el servidor escucha
const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
  console.log(`Se está escuchando el puerto ${puerto} ¡Vamos rama que sale! 👏👏👏`);
});
