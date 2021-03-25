const Proyecto = require( '../models/projecto' );
const { validationResult } = require( 'express-validator' );

exports.crearProyecto = async ( req, res ) => {
  // revisar si hay errores
 const errors = validationResult( req );
 if ( !errors.isEmpty() ) return  res.status( 400 ).json({ errores : errors.array() });

  try {
    // crear un nuevo proyecto
    const proyecto = new Proyecto( req.body );
    //guardar el creador
    proyecto.creador = req.usuario.id;
    // guardar proyecto
    proyecto.save();
    res.json( proyecto );
  } catch (error) {
    console.log(error);
    res.status( 500 ).send ( 'Hubo un error' );
  }
}

// obtiene todos los proyectos del usuario autenticado
exports.obtenerProyectos = async ( req, res )=> {
  try {
    const proyectos = await Proyecto.find({ creador : req.usuario.id }).sort({ creado : -1 });
    res.status( 200 ).json({ proyectos });
  } catch (error) {
    console.log (error);
    res.satus ( 500 ).send( 'Hubo un error' );
  }
}
// actualizar un proyecto
exports.actualizarProyecto = async ( req, res ) => {
  // revisar si hay errores
  const errors = validationResult( req );
  if ( !errors.isEmpty() ) return  res.status( 400 ).json({ errores : errors.array() });
  // extraer info del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if ( nombre ) { nuevoProyecto.nombre = nombre; }
  try {
    // revisar ID
    let proyecto = await Proyecto.findById( req.params.id  );
    // revisar si existe el poyecto
    if( !proyecto )return res.status( 404 ).json({ msg: 'Proyecto no hencontrado.' });
    //verificar el creador del proyecto
    if( proyecto.creador.toString() !== req.usuario.id )return res.status( 401 ).json({ msg: 'No Autorizado.' });
    //actualizar
    proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, 
      { $set : nuevoProyecto }, { new: true });
      res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.satuts( 500 ).send( 'Error en el servidor' );
  }
}
// eliminar un proyecto po id
exports.eliminarProyecto = async ( req, res ) => {
  try {
    // revisar ID
    let proyecto = await Proyecto.findById( req.params.id  );
    // revisar si existe el poyecto
    if( !proyecto )return res.status( 404 ).json({ msg: 'Proyecto no hencontrado.' });
    //verificar el creador del proyecto
    if( proyecto.creador.toString() !== req.usuario.id )return res.status( 401 ).json({ msg: 'No Autorizado.' });
    //eliminar
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.status( 200 ).json({ msg : 'Poyecto eliminado' });
  } catch (error) {
    console.log(error);
    res.satuts( 500 ).send( 'Error en el servidor' );
  }
}