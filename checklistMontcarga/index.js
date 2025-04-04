const sql = require('mssql');

module.exports = async function (context, req) {
    try {
        const body = req.body;
        context.log("Body recibido:", JSON.stringify(body));

        const {
            codigo_montacarga,
            horometro,
            gestion,
            nv_aceite_motor,
            nv_aceite_caja,
            nv_aceite_hidraulico,
            nv_liquido_freno,
            nv_liquido_refrigerante,
            nv_glp,
            mangueras,
            llantas,
            chasis,
            lubricacion,
            luces,
            extintor,
            claxon,
            alarma_retroceso,
            asiento,
            fecha_registro
        } = body;

        const connStr = process.env.SQLCONNSTR_SqlConnectionString;
        context.log("Conectando a la base de datos con:", connStr);
        const pool = await sql.connect(connStr);

        const query = `
            INSERT INTO tb_checklist_montagarga (
                codigo_montacarga, horometro, gestion,
                nv_aceite_motor, nv_aceite_caja, nv_aceite_hidraulico,
                nv_liquido_freno, nv_liquido_refrigerante, nv_glp,
                mangueras, llantas, chasis, lubricacion, luces,
                extintor, claxon, alarma_retroceso, asiento,
                fecha_registro
            )
            VALUES (
                @codigo_montacarga, @horometro, @gestion,
                @nv_aceite_motor, @nv_aceite_caja, @nv_aceite_hidraulico,
                @nv_liquido_freno, @nv_liquido_refrigerante, @nv_glp,
                @mangueras, @llantas, @chasis, @lubricacion, @luces,
                @extintor, @claxon, @alarma_retroceso, @asiento,
                @fecha_registro
            )
        `;

        context.log("Ejecutando query de INSERT con los siguientes valores:");
        context.log({
            codigo_montacarga, horometro, gestion,
            nv_aceite_motor, nv_aceite_caja, nv_aceite_hidraulico,
            nv_liquido_freno, nv_liquido_refrigerante, nv_glp,
            mangueras, llantas, chasis, lubricacion, luces,
            extintor, claxon, alarma_retroceso, asiento,
            fecha_registro
        });

        await pool.request()
            .input('codigo_montacarga', sql.NVarChar(50), codigo_montacarga)
            .input('horometro', sql.Int, horometro)
            .input('gestion', sql.NVarChar(20), gestion)
            .input('nv_aceite_motor', sql.NVarChar(10), nv_aceite_motor)
            .input('nv_aceite_caja', sql.NVarChar(10), nv_aceite_caja)
            .input('nv_aceite_hidraulico', sql.NVarChar(10), nv_aceite_hidraulico)
            .input('nv_liquido_freno', sql.NVarChar(10), nv_liquido_freno)
            .input('nv_liquido_refrigerante', sql.NVarChar(10), nv_liquido_refrigerante)
            .input('nv_glp', sql.NVarChar(10), nv_glp)
            .input('mangueras', sql.NVarChar(10), mangueras)
            .input('llantas', sql.NVarChar(10), llantas)
            .input('chasis', sql.NVarChar(10), chasis)
            .input('lubricacion', sql.NVarChar(10), lubricacion)
            .input('luces', sql.NVarChar(10), luces)
            .input('extintor', sql.NVarChar(10), extintor)
            .input('claxon', sql.NVarChar(10), claxon)
            .input('alarma_retroceso', sql.NVarChar(10), alarma_retroceso)
            .input('asiento', sql.NVarChar(10), asiento)
            .input('fecha_registro', sql.DateTime, new Date(fecha_registro))
            .query(query);

        context.res = {
            status: 200,
            body: "Insert exitoso"
        };
    } catch (err) {
        context.log.error("Error al insertar:", err);
        context.res = {
            status: 500,
            body: "Error al insertar datos"
        };
    }
};