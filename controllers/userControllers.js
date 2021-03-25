const Usuario = require( '../models/Users' );
const bcryptjs = require( 'bcryptjs' );
const { validationResult } = require( 'express-validator' );
const jwt = require ( 'jsonwebtoken' );

exports.crearUsuario = async ( req, res ) => {
 // revisar si hay errores
 const errors = validationResult( req );
 if ( !errors.isEmpty() ) return  res.status( 400 ).json({ errores : errors.array() });
  // extarer email y password
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    // comprobar que el usuario no exista
    if ( usuario ) return res.status( 400 ).json({ msg :  'El usuario ya existe' }) ;
    // crea el nuevo usuario
    usuario = new Usuario( req.body );
    // hash al password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash( password,salt );
    // guardar ussuario
    await usuario.save();
    // crear y firmar el JWT
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
    console.log( error );
    res.status( 400 ).send( 'Hubo un error' );
  }
}