import * as userService from "./../services/user.service";
import jwt from "jsonwebtoken";
import config from "./../config/config";

export function checkDuplicatedUsernameEmail(request, response, next) {
  const datosRegistro = request.body;
  userService
    .checkDuplicatedUsernameEmail(datosRegistro)
    .then(() => {
      next();
    })
    .catch((error) => {
      response.status(error.codigo).json(error);
    });
}

export async function verifyToken(request, response, next) {
  const token = request.headers["x-access-token"];
  if (!token) {
    return response.status(403).json({ mensaje: "No token Provided!" });
  }
  const tokenDecoded = await jwt.verify(token, config.SECRET);
  /*Agrego al objeto request el id del usuario que viene en el token
   * decodificado, para que la siguiente función (isAdmin) pueda acceder a él
   * ya que se van a ejecutar una detrás de la otra en la ruta de motos*/
  request.userId = tokenDecoded.id;
  await userService
    .findUserByIdentifier(tokenDecoded.id)
    .then(() => {
      next();
    })
    .catch((error) => {
      response.status(error.codigo).json(error);
    });
}

export async function isAdmin(request, response, next) {
  const usuario: any = await userService.findUserByIdentifier(request.userId);
  const roles = await userService.findRolesNames(usuario.roles);

  const admin = Object.keys(roles).find((esAdmin) => {
    if (roles[esAdmin] === "admin") {
      return roles[esAdmin];
    }
  });

  if (!admin)
    return response.status(403).json({ mensaje: "Require admin Role!" });

  next();
}
