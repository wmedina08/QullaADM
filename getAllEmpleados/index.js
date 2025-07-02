const sql = require('mssql');

module.exports = async function (context, req) {
    try {
        const pool = await sql.connect(process.env.SQLCONNSTR_SqlConnectionString);

        const result = await pool.request()
            .query(`SELECT * FROM tb_empleado`);

        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        context.log.error("Error al obtener empleados:", err);
        context.res = {
            status: 500,
            body: "Error interno del servidor."
        };
    }
};