import { Schema, Model, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

/*
    Para poder utilizar métodos normales o estáticos en typescript con mongoose
    debemos hacer lo siguiente:
    * Importar 'Model' y 'Document'
    * Crear una interfaz que extienda de Document
    * Crear una interfaz que extienda de Model interfaz del tipo de la interfaz anterior
    * aqui se definen los metodos que se implementarán mas abajo
*/

export interface IUserDocument extends Document {
  username: String;
  email   : String;
  password: String;
  roles   : String[];
}

export interface IUserModel extends Model<IUserDocument> {
  comparePasswords(pw1: String, pw2: String);
  encryptPassword(password: String);
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    roles: [{
        ref: "roles",
        type: Schema.Types.ObjectId
            /*con esto accedo a los id's de la coleccion 'roles' y la relaciono con
             * el esquema de 'User'*/
    }]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.statics.comparePasswords = async (password, receivedPassword) => {
  //El password encriptado tiene que venir como segundo parametro
  return await bcrypt.compare(password, receivedPassword);
};

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSaltSync(10);
  const hashedPw = await bcrypt.hashSync(`${password}`, salt);
  return hashedPw;
};

export const User: IUserModel = model<IUserDocument, IUserModel>(
  "user",
  userSchema
);
export default User;
