const sql = require('mssql');

module.exports = async function (context, req) {
    try {
        const codigoM = req.query.codigo;
        if (!codigoM) {
            context.res = {
                status: 400,
                body: "Falta el parámetro 'codigo'."
            };
            return;
        }

        const connStr = process.env.SQLCONNSTR_SqlConnectionString;
        const pool = await sql.connect(connStr);

        const result = await pool.request()
            .input('codigo', sql.NVarChar(50), codigoM)
            .query('SELECT TOP 1 * FROM tb_montacarga WHERE codigo = @codigo');

        if (result.recordset.length === 0) {
            context.res = {
                status: 404,
                body: "No se encontró ningún montacarga con ese código."
            };
            return;
        }

        const montacarga = result.recordset[0];

        context.res = {
            status: 200,
            body: {
                codigo_montacarga: montacarga.codigo,
                sede: montacarga.sede,
                modelo: montacarga.modelo,
                serie: montacarga.serie
            }
        };
    } catch (err) {
        context.log.error("Error al obtener datos de montacarga:", err);
        context.res = {
            status: 500,
            body: "Error interno al consultar montacarga."
        };
    }
};