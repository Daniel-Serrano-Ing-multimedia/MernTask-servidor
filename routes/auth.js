// Rutas para autenticar usuarios
const express = require( 'express' );
const router = express.Router();
const authController = require ( '../controllers/authController' );
const { check } = require( 'express-validator' );
const auth = require( '../middleware/auth' );

// autenticar usuarios
// api/auth
router.post( '/', 
  [
    check( 'email', 'Agrega un email valido' ).isEmail(),
    check( 'password', 'El password es obligatorio' ).notEmpty()
  ],
  authController.autenticarUsuario
);
// 
router.get( '/',
  auth,
  authController.usuarioAutenticado
);
module.exports = router;