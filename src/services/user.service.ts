import User from "./../models/user.model";
import Role from "./../models/role.model";
import * as validador from "./../util/validator.util";
import jwt from "jsonwebtoken";
import config from "./../config/config";

const rulesRegistertUser = {
  username: "required|string|min:3|max:15",
  email: "required|email",
  password: "required|string|min:3|max:15",
};

const rulesLoginUser = {
  username: "required|string|min:3|max:15",
  password: "required|string|min:3|max:15",
};

export function register(usuario) {
  return new Promise(async function (resolve, reject) {

    if (!validador.validarObjeto(usuario, rulesRegistertUser, reject)) {
      return;
    }
    const { username, email, password, roles } = usuario;
    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
    });
    
    //Agrego los roles al usuario que se acaba de Registrar
    //para guardarlo en bbdd
    if (roles) {
      const foundRoles = await Role.find({name: {$in: roles}});
      newUser.roles = foundRoles.map(role=>role._id);
    }else{
      const roleFound = await Role.find({name : "user"});
      newUser.roles = roleFound.map(role => role._id);
    }

    try {
      const savedUser = await newUser.save();
      const token = await jwt.sign({ id: savedUser._id }, config.SECRET, {
        expiresIn: 60 * 60 * 24,
      });

      resolve({ token });
    } catch (error) {
      console.log(error);
      reject({ codigo: 500, mensaje: "Error trying to insert in ddbb!" });
    }
  });
}

export function login(datosUsuario) {
  const { username, password } = datosUsuario;
  return new Promise(async function (resolve, reject) {
    if (!validador.validarObjeto(datosUsuario, rulesLoginUser, reject)) {
      return;
    }
    const userFound = await User.findOne({ username: username });
    if (!userFound) {
      reject({ codigo: 404, mensaje: `User '${username}' not found!` });
      return;
    }
    const matchPassword = await User.comparePasswords(
      password,
      userFound.password
    );
    if (!matchPassword) {
      reject({ codigo: 401, mensaje: "Inavlid Password" });
      return;
    }
    const token = await jwt.sign({ id: userFound._id }, config.SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    resolve({ token });
  });
}

export function checkDuplicatedUsernameEmail(datos) {
  return new Promise(async function (resolve, reject) {
    const { username, email } = datos;
    const usernameFound = await User.findOne({ username: username });
    if (usernameFound) {
      reject({
        codigo: 400,
        mensaje: `Username '${username}' already exists!`,
      });
      return false;
    }
    const emailFound = await User.findOne({ email: email });
    if (emailFound) {
      reject({ codigo: 400, mensaje: `Email '${email}' already exists!` });
      return false;
    }
    resolve(true);
  });
}

export function findUserByIdentifier(id) {
  return new Promise(async function (resolve, reject) {
    const userFound = await User.findById(id, { password: 0 }); //password:0 omite password en respuesta
    if (!userFound) {
      reject({ codigo: 404, mensaje: "User not Found!" });
      return;
    }
    resolve(userFound);
  });
}

export function findRolesNames(rolesId){
  return new Promise(async function(resolve, reject){
    const roles = await Role.find({_id: {$in: rolesId} });
    const rolesNames = roles.map(rol => rol["name"]);
    if (!rolesNames) {
      reject({codigio: 404, mensaje: "Role(s) not found!"});
      return;
    }
    resolve(rolesNames);
  });
}
