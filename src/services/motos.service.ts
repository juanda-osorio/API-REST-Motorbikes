import Motos from "./../models/motos.model";
import * as validador from "./../util/validator.util";

const reglasMoto = {
  //las reglas deben tener este formato: required|tipoDato
  //No se puede dejar espacoi: required | tipoDato
  marca: "required|string|min: 1|max: 20",
  modelo: "required|string|min: 1|max: 20",
  anio: "required|integer",
  potencia: "numeric",
  cilindrada: "numeric",
  par_motor: "numeric",
  peso: "numeric",
  seguridad_comfort: {
    horquilla_invertida: "boolean",
    frenos_abs: "boolean",
    doble_disco_delanter: "boolean",
    full_led: "boolean",
    marcha_engranada: "boolean",
    luces_emergencia: "boolean",
  },
  consumo: "numeric",
  capacidad_deposito: "numeric",
  precio: "numeric",
};

export function getMotos() {
  return new Promise(async function (resolve, reject) {
    console.log("getMotos (LN-service)");
    const motos = await Motos.find();
    if (motos.length == 0) {
      reject({ codigo: 404, mensaje: "No Motorbikes Found!" });
      return;
    }
    resolve(motos);
  });
}

export function searchMotos(busqueda) {
  return new Promise(async function (resolve, reject) {
    console.log("searchMotos (LN-Service)");
    
    try {
      let potencia = {
        $gte : 0,
        $lte : Number.MAX_SAFE_INTEGER
      }
      let cilindrada = {
        $gte : 0,
        $lte : Number.MAX_SAFE_INTEGER
      }

      //BUSQUEDA POR POTENCIA
      if (busqueda.potenciaMin) {
        potencia.$gte = busqueda.potenciaMin
      }
      delete busqueda.potenciaMin
      busqueda.potencia = potencia

      if (busqueda.potenciaMax) {
        potencia.$lte = busqueda.potenciaMax
      }
      delete busqueda.potenciaMax
      busqueda.potencia = potencia

      
      //BUSQUEDA POR CILINDRADA
      if (busqueda.cilindradaMin) {
        cilindrada.$gte = busqueda.cilindradaMin
      }
      delete busqueda.cilindradaMin
      busqueda.cilindrada = cilindrada

      if (busqueda.cilindradaMax) {
        cilindrada.$lte = busqueda.cilindradaMax
      }
      delete busqueda.cilindradaMax
      busqueda.cilindrada = cilindrada

      console.log("BUSQUEDA: ", busqueda);

      const foundMotos = await Motos.find(busqueda);

      if (foundMotos.length == 0) {
        reject({
          codigo: 404,
          mensaje: "No found Motorbikes with that criteria!",
        });
        return;
      }

      resolve(foundMotos);
    } catch (error) {
      console.log(error);
      reject({
        codigo: 500,
        mensaje: "ERROR AL INTENTAR BUSCAR EN LA BBDD!",
      });
    }
  });
}

export function insertMoto(moto) {
  console.log("insertMoto (LN-service)");

  return new Promise(async function (resolve, reject) {
    let criterio = {
      marca: moto.marca,
      modelo: moto.modelo,
      anio: moto.anio,
    };
    let motoDuplicada = await Motos.find(criterio);
    if (motoDuplicada.length > 0) {
      console.log(motoDuplicada);
      reject({ codigo: 400, mensaje: "Moto duplicada!" });
      return;
    }

    if (!validador.validarObjeto(moto, reglasMoto, reject)) {
      return;
    }

    //Retiramos cualquier id que venga, para que mongo ponga el suyo
    delete moto._id;

    let newMoto = new Motos(moto);
    try {
      resolve(await newMoto.save());
    } catch (error) {
      console.log(error);
      reject({ codigo: 500, mensaje: "Error en la bbdd al insertar!" });
    }
  });
}

export function updateMoto(moto) {
  console.log("updateMoto (LN-service)");

  return new Promise(async function (resolve, reject) {
    if (!validador.validarObjeto(moto, reglasMoto, reject)) {
      return;
    }

    try {
      //new: true ==> devuelve el dato nuevo.
      let motoModificada = await Motos.findByIdAndUpdate(moto._id, moto, {
        new: true,
      });

      if (!motoModificada) {
        reject({
          codigo: 404,
          mensaje: "No existe una moto con el id " + moto._id,
        });
        return;
      }

      resolve(moto);
    } catch (error) {
      console.log(error);
      reject({
        codigo: 500,
        mensaje: "Error en la bbdd al actualizar una moto!",
      });
    }
  });
}

export function deleteMoto(idMoto) {
  console.info("deleteMoto (LN-service)");
  return new Promise<void>(async function (resolve, reject) {
    let motoBorrada = await Motos.findByIdAndDelete(idMoto);
    if (!motoBorrada) {
      reject({
        codigo: 404,
        mensaje: "No se ha encontrado ninguna moto con ese id ",
      });
      return;
    }
    resolve();
  });
}
