//importación de dependencias
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
//require("dotenv").config(); //{path: './config/config.ts'}

//importación otras cositas
import * as db from "./database";
import motosRoutes from "./routes/motos.routes";
import userRoutes from "./routes/user.routes";
import { createRoles } from "./libs/initialSetup";

db.conexion()
  .then(iniciarServidor)
  .catch((error) => console.log(error));


function iniciarServidor() {
  //definición variables/constantes
  const app = express();
  
  dotenv.config();// Usa la configuracion config/config.ts. Se puede cambiar usando path //require("dotenv").config(); //{path: './config/config.ts'}

  app.set("port", process.env.PORT || 4000);
  const port = app.get("port");

  //Uso dependencias
  createRoles();
  app.use(morgan("tiny")); //dev, tiny
  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: "5mb" })); //Tamaño máximo del body que estamos dispuestos a leer

  //Uso rutas
  app.use(motosRoutes);
  app.use("/users", userRoutes);

  app.listen(port);
  console.log("Servidor escuchando en puerto: ", port);
}
