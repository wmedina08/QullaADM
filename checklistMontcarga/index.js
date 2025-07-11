const sql = require('mssql');

module.exports = async function (context, req) {
    try {
        const body = req.body;
        context.log("Body recibido:", JSON.stringify(body));

        const {
            codigo_montacarga,
            horometro,
            gestion,
            fecha_registro,
            observaciones,
            nombre_ope,
            apellido_ope,
            fluidos,
            componentes,
            seguridad
        } = body;

        const {
            nv_aceite_motor,
            nv_aceite_caja,
            nv_aceite_hidraulico,
            nv_liquido_freno,
            nv_liquido_refrigerante,
            nv_glp
        } = fluidos?.[0] || {};

        const {
            mangueras,
            chasis,
            lubricacion,
            llantas_delanteras,
            llantas_posteriores,
            luces_direc_derecha,
            luces_direc_izquierda,
            luces_freno,
            luces_retro,
            luces_alter_delanteras,
            luces_alter_retroceso,
            freno
        } = componentes?.[0] || {};

        const {
            extintor,
            claxon,
            alarma: alarma_retroceso,
            asiento
        } = seguridad?.[0] || {};

        const connStr = process.env.SQLCONNSTR_SqlConnectionString;
        context.log("Conectando a la base de datos con:", connStr);
        const pool = await sql.connect(connStr);

        const query = `
            INSERT INTO tb_checklist_montacarga (
                codigo_montacarga, horometro, gestion,
                nv_aceite_motor, nv_aceite_caja, nv_aceite_hidraulico,
                nv_liquido_freno, nv_liquido_refrigerante, nv_glp,
                mangueras, chasis, lubricacion,
                llantas_delanteras, llantas_posteriores,
                luces_direc_derecha, luces_direc_izquierda, luces_freno,
                luces_retro, luces_alter_delanteras, luces_alter_retroceso,
                freno,
                extintor, claxon, alarma_retroceso, asiento,
                fecha_registro, observaciones, nombre_ope, apellido_ope
            )
            VALUES (
                @codigo_montacarga, @horometro, @gestion,
                @nv_aceite_motor, @nv_aceite_caja, @nv_aceite_hidraulico,
                @nv_liquido_freno, @nv_liquido_refrigerante, @nv_glp,
                @mangueras, @chasis, @lubricacion,
                @llantas_delanteras, @llantas_posteriores,
                @luces_direc_derecha, @luces_direc_izquierda, @luces_freno,
                @luces_retro, @luces_alter_delanteras, @luces_alter_retroceso,
                @freno,
                @extintor, @claxon, @alarma_retroceso, @asiento,
                @fecha_registro, @observaciones, @nombre_ope, @apellido_ope
            )
        `;

        const fechaParseada = new Date(Date.parse(fecha_registro));

        context.log("Ejecutando query de INSERT con los siguientes valores:");
        context.log({
            codigo_montacarga, horometro, gestion,
            nv_aceite_motor, nv_aceite_caja, nv_aceite_hidraulico,
            nv_liquido_freno, nv_liquido_refrigerante, nv_glp,
            mangueras, chasis, lubricacion,
            llantas_delanteras, llantas_posteriores,
            luces_direc_derecha, luces_direc_izquierda, luces_freno,
            luces_retro, luces_alter_delanteras, luces_alter_retroceso,
            freno,
            extintor, claxon, alarma_retroceso, asiento,
            fecha_registro: fechaParseada, observaciones,
            nombre_ope, apellido_ope
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
            .input('chasis', sql.NVarChar(10), chasis)
            .input('lubricacion', sql.NVarChar(10), lubricacion)
            .input('llantas_delanteras', sql.NVarChar(20), llantas_delanteras)
            .input('llantas_posteriores', sql.NVarChar(20), llantas_posteriores)
            .input('luces_direc_derecha', sql.NVarChar(10), luces_direc_derecha)
            .input('luces_direc_izquierda', sql.NVarChar(10), luces_direc_izquierda)
            .input('luces_freno', sql.NVarChar(10), luces_freno)
            .input('luces_retro', sql.NVarChar(10), luces_retro)
            .input('luces_alter_delanteras', sql.NVarChar(10), luces_alter_delanteras)
            .input('luces_alter_retroceso', sql.NVarChar(10), luces_alter_retroceso)
            .input('freno', sql.NVarChar(10), freno)
            .input('extintor', sql.NVarChar(10), extintor)
            .input('claxon', sql.NVarChar(10), claxon)
            .input('alarma_retroceso', sql.NVarChar(10), alarma_retroceso)
            .input('asiento', sql.NVarChar(10), asiento)
            .input('fecha_registro', sql.DateTime, fechaParseada)
            .input('observaciones', sql.NVarChar(sql.MAX), observaciones)
            .input('nombre_ope', sql.NVarChar(100), nombre_ope)
            .input('apellido_ope', sql.NVarChar(100), apellido_ope)
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