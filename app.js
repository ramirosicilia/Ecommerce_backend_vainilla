import express from "express";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
 import router from "./routers/Routers.js"; 


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const __fieldName=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__fieldName);


app.use("/", express.static(path.join(__dirname, './public')));



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
