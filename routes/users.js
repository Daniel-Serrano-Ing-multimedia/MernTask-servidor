// Rutas para crear usuarios
const express = require( 'express' );
const router = express.Router();
const userController = require( '../controllers/userControllers' );
const { check } = require( 'express-validator' );

// crea un usuario
// api/usuarios
router.post( '/', 
  [
    check( 'nombre', 'El nombre es obligatorio' ).notEmpty(),
    check( 'email', 'Agrega un email valido' ).isEmail(),
    check( 'password', 'El password debe ser de minimo 6 caracteres' ).isLength({ min : 6 }),
  ],
  userController.crearUsuario
);

module.exports = router;