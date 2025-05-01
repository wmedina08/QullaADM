const sql = require('mssql');

module.exports = async function (context, req) {
    const body = req.body;

    const { turno, estado, refrigerio, hora, dni, ubicacion_asistencia, latitud, longitud } = body;

    if (!turno || !estado || !hora || !dni) {
        context.res = {
            status: 400,
            body: "Faltan campos obligatorios"
        };
        return;
    }

    try {
        const connStr = process.env.SQLCONNSTR_SqlConnectionString;
        const pool = await sql.connect(connStr);

        const query = `
            INSERT INTO dbo.tb_marcacion_asistencia 
            (turno, estado, refrigerio, hora, dni, ubicacion_asistencia, latitud, longitud)
            VALUES (@turno, @estado, @refrigerio, @hora, @dni, @ubicacion_asistencia, @latitud, @longitud)
        `;

        const request = pool.request();
        request.input('turno', sql.VarChar(50), turno);
        request.input('estado', sql.VarChar(50), estado);
        request.input('refrigerio', sql.VarChar(50), refrigerio || null);
        request.input('hora', sql.DateTime, new Date(hora));
        request.input('dni', sql.VarChar(20), dni);
        request.input('ubicacion_asistencia', sql.VarChar(255), ubicacion_asistencia || null);
        request.input('latitud', sql.NVarChar(50), latitud || null);
        request.input('longitud', sql.NVarChar(50), longitud || null);

        await request.query(query);

        context.res = {
            status: 200,
            body: "Asistencia registrada correctamente"
        };
    } catch (err) {
        context.log.error('Error al registrar asistencia:', err);
        context.res = {
            status: 500,
            body: "Error interno al registrar asistencia"
        };
    }
};