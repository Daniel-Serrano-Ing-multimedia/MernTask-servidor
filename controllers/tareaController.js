const Tarea = require('../models/tarea');
const Proyecto = require('../models/projecto');
const { validationResult } = require( 'express-validator' );
//Crea un a nueva Tarea
exports.crearTarea = async ( req, res )=> {
  const errors = validationResult( req );
  if ( !errors.isEmpty() ) return  res.status( 400 ).json({ errores : errors.array() });
  try {
    //extraer el proyecto y comprobar si existe
    const { proyecto } = req.body;
    const existeProyecto = await Proyecto.findById( proyecto );
    if( !existeProyecto ) return res.status( 404 ).json({ msg : 'Proyecto no hencontrado' });
    //revisar si el proyecto actual pertenece al usuario autenticado
    if( existeProyecto.creador.toString() !== req.usuario.id )return res.status( 401 ).json({ msg: 'No Autorizado.' });
    // Creamos tarea
    const tarea = new Tarea( req.body );
    await tarea.save();
    res.status( 200 ).json({ tarea });

  } catch (error) {
    console.log(error);
    res.status( 500 ).send( 'hubo un error' );
  }
}
//Obtener Tareas por proyecto
exports.obtenerTareas = async ( req, res ) => {
   //extraer el proyecto y comprobar si existe
   try {
    const { proyecto } = req.query;
    const existeProyecto = await Proyecto.findById( proyecto );
    if( !existeProyecto ) return res.status( 404 ).json({ msg : 'Proyecto no hencontrado' });
     //revisar si el proyecto actual pertenece al usuario autenticado
     if( existeProyecto.creador.toString() !== req.usuario.id )return res.status( 401 ).json({ msg: 'No Autorizado.' });
    // obtener tarea por proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    res.status( 200 ).json({ tareas });
  } catch (error) {
    console.log( error );
    res.status( 500 ).send( 'hubo un error' );
  }
}

// Actualizar una tarea
exports.actualizarTarea = async ( req, res ) => {
  try {
    const { proyecto, nombre , estado } = req.body;
    // revisar si a tarea existe 
    const existetarea = await Tarea.findById( req.params.id );
    if( !existetarea ) return res.status( 404 ).json({ msg : 'No existe esa Tarea' });
    //revisar si el proyecto actual pertenece al usuario autenticado
    const existeProyecto = await Proyecto.findById( proyecto );
     if( existeProyecto.creador.toString() !== req.usuario.id )return res.status( 401 ).json({ msg: 'No Autorizado.' });
    // crear objeto con la nueva info
     const nuevaTarea = {};
      nuevaTarea.nombre = nombre;
      nuevaTarea.estado = estado;
     // guardar Tarea
     tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new : true });
     res.status( 200 ).json({ tarea });
  } catch (error) {
    console.log( error );
    res.status( 500 ).send( 'hubo un error' );
  }
}
// Eliminar una Tarea
exports.eliminarTarea = async ( req, res ) => {
  try {
    const { proyecto } = req.query;
    // revisar si a tarea existe 
    const existetarea = await Tarea.findById( req.params.id );
    if( !existetarea ) return res.status( 404 ).json({ msg : 'No existe esa Tarea' });
    //revisar si el proyecto actual pertenece al usuario autenticado
    const existeProyecto = await Proyecto.findById( proyecto );
     if( existeProyecto.creador.toString() !== req.usuario.id )return res.status( 401 ).json({ msg: 'No Autorizado.' });
     // eliminar Tarea
     await Tarea.findOneAndRemove({ _id: req.params.id });
     res.status( 200 ).json({ msg : 'Tarea eliminada.' });
  } catch (error) {
    console.log( error );
    res.status( 500 ).send( 'hubo un error' );
  }
}