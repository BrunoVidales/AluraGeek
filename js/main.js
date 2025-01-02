// Seleccionar el contenedor donde se mostrarán los productos
const productGrid = document.querySelector('.main__grid');

// Seleccionar el formulario y sus campos
const form = document.querySelector('.main__form');
const inputNombre = document.querySelector('.main__input:nth-of-type(1)');
const inputPrecio = document.querySelector('.main__input:nth-of-type(2)');
const inputImagen = document.querySelector('.main__input:nth-of-type(3)');

// Función para obtener productos desde JSON Server
async function fetchProductos() {
    try {
        const response = await fetch('http://localhost:3000/productos');
        const productos = await response.json();
        renderProductos(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

// Función para renderizar los productos en el DOM
function renderProductos(productos) {
    productGrid.innerHTML = ''; // Limpiar contenido previo

    if (productos.length === 0) {
        // Si no hay productos, mostrar el mensaje
        productGrid.innerHTML = '<p class="no-products">No hay productos disponibles.</p>';
        return;
    }

    productos.forEach(producto => {
        const productoHTML = `
            <div class="main__card">
                <img src="${producto.imagen}" alt="imagen producto">
                <div class="main__info">
                    <h3 class="main__title">${producto.nombre}</h3>
                    <div class="main__price-button">
                        <p class="main__price">$ ${producto.precio.toFixed(2)}</p>
                        <button class="main__delete" data-id="${producto.id}">
                            <img src="img/delete.png" alt="icono eliminar">
                        </button>
                    </div>
                </div>
            </div>
        `;
        productGrid.innerHTML += productoHTML;
    });

    // Agregar el evento de eliminación después de renderizar los productos
    agregarEventosEliminar();
}

// Llamar a la función al cargar la página
fetchProductos();

// Evento para manejar el envío del formulario
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío por defecto del formulario

    const nuevoProducto = {
        nombre: inputNombre.value.trim(),
        precio: parseFloat(inputPrecio.value),
        imagen: `img/${inputImagen.value.trim()}`, // Añadir la ruta correcta para la imagen
    };

    // Validar que los campos no estén vacíos
    if (!nuevoProducto.nombre || isNaN(nuevoProducto.precio) || !nuevoProducto.imagen) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    await agregarProducto(nuevoProducto);

    // Limpiar los campos del formulario después de enviar
    inputNombre.value = '';
    inputPrecio.value = '';
    inputImagen.value = '';
});

// Función para agregar un nuevo producto
async function agregarProducto(producto) {
    try {
        const response = await fetch('http://localhost:3000/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producto),
        });

        if (!response.ok) {
            throw new Error('No se pudo agregar el producto');
        }

        // Obtener la lista actualizada de productos y renderizarla
        fetchProductos();
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
}

// Función para agregar el evento de eliminación a los botones de eliminar
function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll('.main__delete');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', async (event) => {
            const idProducto = event.target.closest('button').dataset.id;
            await eliminarProducto(idProducto);
        });
    });
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('No se pudo eliminar el producto');
        }

        // Obtener la lista actualizada de productos y renderizarla
        fetchProductos();
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}
