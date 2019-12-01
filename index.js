const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./registro')
const port = process.env.PORT||3000

var config = require('./config')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    let resultado
  if (config.SERVER==='201.204.169.171' 
    &&config.USUARIO==='postgres'
    &&config.CLAVE==='Rivipe19866'
    &&config.BD==='PSOREST') {
      resultado='Datos de conexión correctos'
  } else {
    resultado='Datos de conexión incorrectos'
  }
  
    response.json({resultado:resultado})
})


app.post('/jwt',db.validarUsuario)

app.post('/ping',db.validarToken)

app.get('/usuarios', db.getUsuarios)

app.get('/usuarios/:cedula', db.getUsuarioXCedula)

app.post('/usuarios', db.crearUsuario)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})