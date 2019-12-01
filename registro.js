var config = require('./config')
const Pool = require('pg').Pool
const pool = new Pool({
  user: config.USUARIO,
  host: config.SERVER,
  database: config.BD,
  password: config.CLAVE,
  port: 5432,
})

//json.sign y json.verify son métodos de la librería jsonwebtoken

const jwt = require('jsonwebtoken')

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



  const validarUsuario= (request,response)=>{
    const {correo,clave}=request.body
   const select=
    pool.query('SELECT correo,clave FROM registro where "correo"=$1  and "clave"=$2', [correo,clave],(error,results)=>{
      if (error) {
        throw error
      }

      if (results.rows!=null) {

        const payload = {
          
          check:  true
         
        }
         const token = jwt.sign(payload, config.llave, {

          expiresIn: 60

         })
         response.status(200).json({

          acces_token: token,

          expires_in:60

         })
   

      } else {
        response.status(400).json('Usuario o contraseña inválida')
      }
      
    })

  
    
  }

 
  const  validarToken=(request,response)=>{

    const bearer=request.headers["authorization"]

    if (typeof bearer!=='undefined') {
      const bearerToken=bearer.split(' ')
     
      const token=bearerToken[1]

       jwt.verify(token, config.llave,(err,decoded)=>{
         if (err) {
           
           response.status(401).json(err)
         } 
         if (decoded) {
        
           response.status(200).json(decoded)
         }
       })

    } else {
      response.sendStatus(401)
    }

  }


  module.exports = {
    getUsuarios,
    getUsuarioXCedula,
    crearUsuario,
    validarUsuario,
    validarToken,
}