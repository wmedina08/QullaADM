const sql = require("mssql");

module.exports = async function (context, req) {
    const dni = req.query.dni || req.body?.dni;

    if (!dni) {
        context.res = {
            status: 400,
            body: { error: "DNI requerido" }
        };
        return;
    }

    try {
        const connStr = process.env.SQLCONNSTR_SqlConnectionString;
        const pool = await sql.connect(connStr);

        // Buscar nombre del empleado
        const empleado = await pool.request()
            .input("dni", sql.VarChar, dni)
            .query(`
                SELECT TOP 1 nombres
                FROM tb_empleado
                WHERE dni = @dni
            `);

        const nombre = empleado.recordset.length > 0
            ? empleado.recordset[0].nombres.trim()
            : null;

        if (!nombre) {
            context.res = {
                status: 200,
                body: {
                    nombre: null,
                    beneficio: false,
                    hora_ingreso: null,
                    hora_verificacion: new Date().toISOString(),
                    verificado: true,
                    mensaje: "El DNI no está registrado en la tabla de empleados."
                }
            };
            return;
        }

        // Buscar ingreso más reciente del día (sin conversión de zona horaria)
        const ingreso = await pool.request()
            .input("dni", sql.VarChar, dni)
            .query(`
                SELECT TOP 1 fecha_hora
                FROM tb_ingresos_personal_almacen
                WHERE codigo = @dni
                  AND CAST(DATEADD(HOUR, -5, fecha_hora) AS DATE) = CAST(DATEADD(HOUR, -5, GETDATE()) AS DATE)
                ORDER BY fecha_hora DESC
            `);

        let beneficio = false;
        let hora_ingreso = null;

        if (ingreso.recordset.length > 0) {
            const fechaBruta = ingreso.recordset[0].fecha_hora;
            const isoStr = fechaBruta.toISOString(); // Ej: 2025-04-10T05:40:52.807Z

            // Formato amigable: 2025-04-10 05:40:52.807
            hora_ingreso = isoStr.replace("T", " ").replace("Z", "");

            const horas = fechaBruta.getHours();
            const minutos = fechaBruta.getMinutes();
            const totalMinutos = horas * 60 + minutos;

            beneficio = totalMinutos >= 300 && totalMinutos <= 345; // 05:00 a 05:45
        }

        context.res = {
            status: 200,
            body: {
                nombre: nombre,
                beneficio: beneficio,
                hora_ingreso: hora_ingreso,
                hora_verificacion: new Date().toISOString(),
                verificado: true
            }
        };

    } catch (error) {
        context.log.error("Error al consultar la base de datos:", error);
        context.res = {
            status: 500,
            body: { error: "Error al conectar con la base de datos." }
        };
    }
};