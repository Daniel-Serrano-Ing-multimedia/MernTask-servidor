const express = require( 'express' );
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require( '../middleware/auth' );
const { check } = require ( 'express-validator' );
// Crea Tareas
// api/tareas
router.post( '/',
  auth,
  [
    check ( 'nombre', 'El nombre es obligatorio' ).notEmpty(),
    check ( 'proyecto', 'El proyecto es obligatorio' ).notEmpty()
  ],
  tareaController.crearTarea
);
// obtener Tareas
router.get( '/',
  auth,
  tareaController.obtenerTareas
);
// actualizar Tarea
router.put( '/:id',
  auth,
  [
    check( 'proyecto', 'el proyecto es obligatorio').notEmpty()
  ],
  tareaController.actualizarTarea
);
// eliminar Tarea
module.exports = router;
router.delete( '/:id',
  auth,
  [

  ],
  tareaController.eliminarTarea
);