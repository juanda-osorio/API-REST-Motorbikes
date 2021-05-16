import mongoose from "mongoose";
import config from "./config/config";

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

export const conexion = () => {
  return new Promise<string>(function (resolve, reject) {
    console.log(`Conectando con la base de datos...`);
    console.log("CONFIG DB URI: "+config.DB.URI);
    mongoose
      .connect(config.DB.URI, dbOptions)
      .then(() => {
        resolve(`Conectado a la bbdd!`);
      })
      .catch((error) => {
        console.log(error);
        reject();
      });
  });
};
