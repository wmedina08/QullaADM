const sql = require('mssql');

module.exports = async function (context, req) {
  const body = req.body;

  // Validación de campos obligatorios
  const requiredFields = ['codigo', 'nombres', 'dni', 'empresa', 'UID'];
  for (const field of requiredFields) {
    if (!body[field]) {
      context.res = {
        status: 400,
        body: `Campo requerido faltante: ${field}`
      };
      return;
    }
  }

  try {
    const pool = await sql.connect(process.env.SqlConnectionString);

    await pool.request()
      .input('codigo', sql.VarChar, body.codigo)
      .input('nombres', sql.VarChar, body.nombres)
      .input('dni', sql.VarChar, body.dni)
      .input('unidad_servicio', sql.VarChar, body.unidad_servicio || null)
      .input('area_seccion', sql.VarChar, body.area_seccion || null)
      .input('cargo', sql.VarChar, body.cargo || null)
      .input('fecha_ingreso', sql.Date, body.fecha_ingreso || null)
      .input('fecha_cese', sql.Date, body.fecha_cese || null)
      .input('empresa', sql.VarChar, body.empresa)
      .input('correo', sql.VarChar, body.correo || null)
      .input('fecha_nacimiento', sql.Date, body.fecha_nacimiento || null)
      .input('UID', sql.VarChar, body.UID)
      .query(`
        INSERT INTO tb_empleado (
          codigo, nombres, dni, unidad_servicio, area_seccion, cargo,
          fecha_ingreso, fecha_cese, empresa, correo, fecha_nacimiento, UID
        )
        VALUES (
          @codigo, @nombres, @dni, @unidad_servicio, @area_seccion, @cargo,
          @fecha_ingreso, @fecha_cese, @empresa, @correo, @fecha_nacimiento, @UID
        )
      `);

    context.res = {
      status: 200,
      body: 'Empleado registrado correctamente'
    };
  } catch (err) {
    context.log('Error:', err);
    context.res = {
      status: 500,
      body: 'Error al registrar empleado'
    };
  } finally {
    sql.close();
  }
};