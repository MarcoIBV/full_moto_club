const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Motos',{
    useNewUrlparser:true,
    useUnifiedTopology:true
})
.then(() => console.log('conectado a mongo'))
.catch(err => console.error(err));

// Esquemas y Modelos

// Define el esquema para los usuarios
const UsuarioSchema = new mongoose.Schema({
    nombre: String,     
    email: String,      
    password: String    
});

// Crea el modelo Usuario basado en el esquema anterior
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Define el esquema para los pasteles
const clienteSchema = new mongoose.Schema({
    nombre: String,    
    direccion: String,
    telefono: String   
});
const cliente = mongoose.model('cliente', clienteSchema);

// Define el esquema para los empleados
const EntregaSchema = new mongoose.Schema({
    nombre: String,     
    hora: String,
    fecha: String
});
// Crea el modelo Empleado basado en el esquema anterior
const Entrega = mongoose.model('Entrega', EntregaSchema);

const CitaSchema = new mongoose.Schema({
    Nombre: String,    // Nombre del cliente que hace el pedido
    Fecha: String,
    Hora: String
});
// Crea el modelo Pedido basado en el esquema anterior
const Cita = mongoose.model('Cita', CitaSchema);

const MotoSchema = new mongoose.Schema({
    Modelo: String,    
    Marca: String,
    Velocidad: String,
    color: String
});
// Crea el modelo Pedido basado en el esquema anterior
const Moto = mongoose.model('Moto', MotoSchema);

const FacturaSchema = new mongoose.Schema({
    Nombre: String,   
    Fecha: String,
    Hora: String,
    Entregado: String,
    Fechaentrega: String,
    Descripcion: String,
    Calle: String,
    costototal: String
});
const Factura = mongoose.model('Factura', FacturaSchema);
// Rutas de autenticación

// Ruta para registrar un nuevo usuario
app.post('/registro', async (req, res) => {
    // Extrae nombre, email y password del cuerpo de la solicitud
    const { nombre, email, password } = req.body;
    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crea un nuevo usuario con los datos recibidos y la contraseña encriptada
    const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword });
    // Guarda el usuario en la base de datos
    await nuevoUsuario.save();
    // Responde con un mensaje de éxito y código 201 (creado)
    res.status(201).send('Usuario registrado');
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    // Extrae email y password del cuerpo de la solicitud
    const { email, password } = req.body;
    // Busca un usuario con el email proporcionado
    const usuario = await Usuario.findOne({ email });
    // Si no existe el usuario, responde con error 401 (no autorizado)
    if (!usuario) return res.status(401).send('Usuario no encontrado');
    // Compara la contraseña proporcionada con la almacenada (encriptada)
    const valid = await bcrypt.compare(password, usuario.password);
    // Si la contraseña no es válida, responde con error 401
    if (!valid) return res.status(401).send('Contraseña incorrecta');
    // Si todo es correcto, responde con mensaje de éxito
    res.send('Inicio de sesión exitoso');
});

// CRUD Pasteles

// Ruta para obtener todos los pasteles
app.get('/api/motos', async (req, res) => {
    const motos = await Moto.find();
    res.json(motos);
});

app.post('/api/motos', async (req, res) => {
    const nuevo = new Moto(req.body);
    await nuevo.save();
    res.status(201).send('Moto creada');
});

app.delete('/api/motos/:id', async (req, res) => {
    await Moto.findByIdAndDelete(req.params.id);
    res.send('Moto eliminada');
});

// CRUD Empleados

// Ruta para obtener todos los empleados
app.get('/api/clientes', async (req, res) => {
    const clientes = await cliente.find();
    res.json(clientes);
});

app.post('/api/clientes', async (req, res) => {
    const nuevo = new cliente(req.body);
    await nuevo.save();
    res.status(201).send('Cliente agregado');
});

// Ruta para eliminar un empleado por su ID
app.delete('/api/clientes/:id', async (req, res) => {
    await cliente.findByIdAndDelete(req.params.id);
    res.send('Cliente eliminado');
});

// CRUD Pedidos

// Ruta para obtener todos los pedidos
app.get('/api/entregas', async (req, res) => {
    // Busca todos los pedidos en la base de datos
    const entregas = await Entrega.find();
    // Devuelve la lista de pedidos en formato JSON
    res.json(entregas);
});

// Ruta para crear un nuevo pedido
app.post('/api/entregas', async (req, res) => {
    const nuevo = new Entrega(req.body);
    await nuevo.save();
    res.status(201).send('Entrega registrada');
});

// Ruta para eliminar un pedido por su ID
app.delete('/api/entregas/:id', async (req, res) => {
    await Entrega.findByIdAndDelete(req.params.id);
    // Responde con mensaje de éxito
    res.send('Entrega eliminada');
});

// CRUD Pedidos

app.get('/api/citas', async (req, res) => {
    // Busca todos los pedidos en la base de datos
    const citas = await Cita.find();
    // Devuelve la lista de pedidos en formato JSON
    res.json(citas);
});

// Ruta para crear un nuevo pedido
app.post('/api/citas', async (req, res) => {
    const nuevo = new Cita(req.body);
    await nuevo.save();
    res.status(201).send('Cita registrada');
});

// Ruta para eliminar un pedido por su ID
app.delete('/api/citas/:id', async (req, res) => {
    await Cita.findByIdAndDelete(req.params.id);
    res.send('Cita eliminada');
});

// CRUD Pedidos

app.get('/api/factura', async (req, res) => {
    // Busca todos los pedidos en la base de datos
    const factura = await Factura.find();
    // Devuelve la lista de pedidos en formato JSON
    res.json(factura);
});

app.post('/api/factura', async (req, res) => {
    const nuevo = new Factura(req.body);
    await nuevo.save();
    res.status(201).send('Factura registrada');
});

// Ruta para eliminar un pedido por su ID
app.delete('/api/factura/:id', async (req, res) => {
    await Factura.findByIdAndDelete(req.params.id);
    res.send('Factura eliminada');
});
// Iniciar servidor

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});