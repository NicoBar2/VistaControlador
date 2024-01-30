const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/vistaControlador', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const productSchema = new mongoose.Schema({
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    existencia: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/productos', async (req, res) => {
    try {
        // Se espera un cuerpo de solicitud similar a: { "descripcion": "...", "categoria": "...", "precio": 123, "existencia": 456 }
        const nuevoProducto = new Product(req.body);
        await nuevoProducto.save();
        res.json(nuevoProducto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

app.get('/productos', async (req, res) => {
    try {
        // No se espera un cuerpo de solicitud en las solicitudes GET
        const productos = await Product.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

app.get('/productos/:id', async (req, res) => {
    try {
        // No se espera un cuerpo de solicitud en las solicitudes GET
        const producto = await Product.findById(req.params.id);
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

app.put('/productos/:id', async (req, res) => {
    try {
        // Se espera un cuerpo de solicitud similar a: { "descripcion": "...", "categoria": "...", "precio": 123, "existencia": 456 }
        const producto = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

app.delete('/productos/:id', async (req, res) => {
    try {
        // No se espera un cuerpo de solicitud en las solicitudes DELETE
        const producto = await Product.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
