import e from "express";
import { administradorLogeoDB } from "../model/adminDB.js";
import { obtenerAdminitrador } from "../model/adminDB.js";

export async function administradorRegistro(req, res) { 
    let { nombre_usuario, email, contrasena } = req.body;
    let data = { nombre_usuario, email, contrasena };

    try {
        let response = await administradorLogeoDB(data);

        if (!response.success) {
            return res.status(500).json({
                message: 'ocurrio un error al insertar los productos',
                error: response.message
            });
        }

        res.json({ actualizado: true, data: response.data });

    } catch (err) {
        res.status(500).json({
            message: 'ocurrio un error al insertar los productos',
            error: err.message
        });
    }
} 

export async function obtenerAdminitradorController(req, res) {
    try {
        let response = await obtenerAdminitrador();

        if (!response.success) {
            return res.status(500).json({
                message: 'ocurrio un error al obtener los productos',
                error: response.message
            });
        }

        res.json({ actualizado: true, data: response.data });

    } catch (err) {
        res.status(500).json({
            message: 'ocurrio un error al obtener los productos',
            error: err.message
        });
    }
}
