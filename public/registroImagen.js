import { subirProducto } from "../controllers/Controladores";

const formulario = document.getElementById('formulario-producto');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const imagen = document.getElementById('imagen').files[0];
    const categoria = document.getElementById('categoria').value;
    const stock = document.getElementById('stock').value;

    if (!imagen) {
        alert('Por favor, selecciona una imagen.');
        return;
    }

    // Pasamos los datos al backend para ser procesados
    await subirProducto({ nombre, precio, categoria, stock, imagen }); 

    formulario.reset()
});