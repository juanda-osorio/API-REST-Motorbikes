import { Schema, model, Document } from "mongoose";

export interface IMoto extends Document {
  marca: String;
  modelo: string;
  potencia: {
    $gte: 0;
    $lte: 999999; //no funciona: Number.MAX_SAFE_INTEGER
  };
  cilindrada: {
    $gte: 0;
    $lte: 999999; //no funciona: Number.MAX_SAFE_INTEGER
  };
}

const esquemaMotos = new Schema(
  {
    marca: { required: true, lowercase: true, trim: true, type: String },
    modelo: { required: true, lowercase: true, trim: true, type: String },
    anio: { trim: true, type: Number },
    potencia: { trim: true, type: Number },
    cilindrada: { trim: true, type: Number },
    par_motor: { trim: true, type: Number },
    peso: { trim: true, type: Number },
    seguridad_comfort: {
      horquilla_invertida: { trim: true, type: Boolean },
      frenos_abs: { trim: true, type: Boolean },
      doble_disco_delanter: { trim: true, type: Boolean },
      full_led: { trim: true, type: Boolean },
      marcha_engranada: { trim: true, type: Boolean },
      luces_emergencia: { trim: true, type: Boolean },
    },
    consumo: { trim: true, type: Number },
    capacidad_deposito: { trim: true, type: Number },
    precio: { trim: true, type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
    //strictQuery: true
  }
);

export default model<IMoto>("motos", esquemaMotos);
