import * as motosService from "./../services/motos.service";

export const getMotos = (request, response) => {
  console.log("getMotos (LC-controller)");

  motosService
    .getMotos()
    .then((listadoMotos) => {
      response.json(listadoMotos);
    })
    .catch((error) => {
      response.status(error.codigo).json(error);
    });
};

export const searchMotos = (request, response) => {
  console.log("searchMotos (LC-cotroller)");
  let criterio = request.body;
  motosService
    .searchMotos(criterio)
    .then((foundMotos) => {
      response.json(foundMotos);
    })
    .catch((error) => {
      response.status(error.codigo).json(error);
    });
};

export const insertMoto = (request, response) => {
  console.log("insertMoto (LC-controller)");

  let moto = request.body;
  motosService
    .insertMoto(moto)
    .then((motoInsertada) => {
      response.status(200).json(motoInsertada);
    })
    .catch((error) => {
      response.status(error.codigo).json(error);
    });
};

export const updateMoto = (request, response) => {
  console.log("updateMoto (LC-controller)");
  let idMoto = request.params.idMoto;
  let motoModificar = request.body;
  motoModificar._id = idMoto;

  motosService
    .updateMoto(motoModificar)
    .then((motoModificada) => {
      response.json(motoModificada);
    })
    .catch((error) => {
      response.status(error.codigo).json(error);
    });
};

export const deleteMoto = (request, response) => {
  let idMoto = request.params.idMoto;

  motosService
    .deleteMoto(idMoto)
    .then(() => {
      response.json({ codigo: 200, mensaje: "La moto se ha borrado!" });
    })
    .catch((error) => {
      response.status(error.codigo).json(error);
    });
};
