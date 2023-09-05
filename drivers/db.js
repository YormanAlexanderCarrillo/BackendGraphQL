import mongoose from "mongoose";

const MONGODB_URI = 'mongodb+srv://yormancarrillo:k0nVR0RtnCW8eXLq@cluster0.9iy4zea.mongodb.net/dbCountries?retryWrites=true&w=majority'

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(MONGODB_URI, options)
    .then(() => {
        console.log('conectado a mongodb');
    }).catch(error => {
        console.log('Error al conectar a mongodb: ', error.message);
    })