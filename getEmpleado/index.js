const sql = require('mssql');

module.exports = async function (context, req) {
    const uid = req.body?.uid;

    if (!uid) {
        context.res = {
            status: 400,
            body: "El parámetro UID es requerido."
        };
        return;
    }

    try {
        const connStr = process.env.SQLCONNSTR_SqlConnectionString;
        const pool = await sql.connect(connStr);

        const result = await pool.request()
            .input('UID', sql.VarChar, uid)
            .query(`SELECT nombres, dni, empresa FROM tb_empleado WHERE UID = @UID`);

        if (result.recordset.length === 0) {
            context.res = {
                status: 404,
                body: `No se encontró ningún empleado con UID ${uid}`
            };
        } else {
            context.res = {
                status: 200,
                body: result.recordset[0]
            };
        }
    } catch (err) {
        context.log.error("Error al consultar la base de datos:", err);
        context.res = {
            status: 500,
            body: "Error interno del servidor."
        };
    }
};