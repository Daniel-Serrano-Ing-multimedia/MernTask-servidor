const Usuario = require( '../models/Users' );
const bcryptjs = require( 'bcryptjs' );
const { validationResult } = require( 'express-validator' );
const jwt = require ( 'jsonwebtoken' );

exports.autenticarUsuario = async ( req, res )=> {
  // revisar si hay errores
 const errors = validationResult( req );
 if ( !errors.isEmpty() ) return  res.status( 400 ).json({ errores : errors.array() });
 //extraer user y password
 const { email, password } = req.body;
 try {
   // comprobar q sea usuario registrado
   let usuario = await Usuario.findOne({ email });
   if( !usuario ) return res.status( 400 ).json({ msg: 'El susuario no existe' });
   // Revisar password
   const passCorrecto = await bcryptjs.compare( password, usuario.password );
   if( !passCorrecto ) return res.status( 400 ).json({ msg: 'Password Incorrecto' });
   // Si todo es correcto crear y firmar el jwt
   const payload = {
    usuario : {
      id : usuario.id
    }
  };
  // firmar el token ( jwt )
  jwt.sign( payload, process.env.SECRETA, {
    expiresIn : 3600 // 1hora
  }, ( error, token )=> {
    if ( error ) throw error ;  
      // mensaje de confirmacion
      res.status( 200 ).json({ token }) ;
  } );
 } catch (error) {
   console.log(error);
 }
}

// obtener usuario autenticado
exports.usuarioAutenticado = async ( req, res ) => {
  try {
    const usuario = await Usuario.findById( req.usuario.id ).select( '-password' );
    res.status( 200 ).json({ usuario });
  } catch (error) {
    console.log ( error );
    res.status( 500 ).json({ msg: 'hubo un error' });
  }
}
