const express = require( 'express' );
const router = express.Router();
const proyectoController = require('../controllers/proyectoController')
const auth = require( '../middleware/auth' );
const { check } = require ( 'express-validator' );
// Crea Proyectos
// api/proyectos
router.post('/',
  auth,
  [
    check( 'nombre', 'El nombre del proyecto es obligatorio' ).notEmpty()
  ],
  proyectoController.crearProyecto
);
// obtener todos los proyectos
router.get('/',
  auth,
  proyectoController.obtenerProyectos
);
// actualizar un proyecto via ID
router.put('/:id',
  auth,
  [
    check( 'nombre', 'El nombre del proyecto es obligatorio' ).notEmpty()
  ],
  proyectoController.actualizarProyecto
);
// Eliminar un proyecto via ID
router.delete('/:id',
  auth,
  proyectoController.eliminarProyecto
);
module.exports = router;