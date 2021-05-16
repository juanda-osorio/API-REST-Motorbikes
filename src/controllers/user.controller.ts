import * as userService from "./../services/user.service";

export function register(request, response) {
  let usuario = request.body;
  userService
    .register(usuario)
    .then((token) => {
      response.json(token);
    })
    .catch((error) => {
      response.status(error.codigo).json(error);
    });
}

export function login(request, response) {
   
  userService
    .login(request.body)
    .then((userLogged) => {
      response.json(userLogged);
    })
    .catch((error) => {
      response.status(error.codigo).json(error);
    });
}
