var config = require('./config')

const Pool = require('pg').Pool
const pool = new Pool({
  user: config.USUARIO,
  host: config.SERVER,
  database: config.BD,
  password: config.CLAVE,
  port: 5432,
})

const getUsuarios = (request, response) => {
    pool.query('SELECT * FROM registro', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const getUsuarioXCedula = (request, response) => {
    pool.query('SELECT * FROM registro where "cedula"=$1', [request.params.cedula], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }


  const crearUsuario = (request, response) => {
    const { cedula, nombre,correo,
    telefono,provincia,canton,distrito,barrio,otrasSenas,sexo,fechaNacimiento,clave,confirmacion } = request.body
  
    pool.query('INSERT INTO public.registro ( "cedula","nombre", "correo", "telefono", "provincia", "canton", "distrito", "barrio","otrasSenas", "sexo", "fechaNacimiento", "clave", "confirmacion") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)', [cedula, nombre,correo,telefono,provincia,canton,distrito,barrio,otrasSenas,sexo,fechaNacimiento,clave,confirmacion], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Usuario agregado correctamente : ${cedula}`)
    })
  }


  module.exports = {
    getUsuarios,
    getUsuarioXCedula,
    crearUsuario,
}