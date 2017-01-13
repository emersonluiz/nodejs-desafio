module.exports = () => {
    const Mongoose = require('mongoose');

    var usuario = new Mongoose.Schema({
        _id: {type: String},
        nome: {type: String, trim: true, required: true},
        email: {type: String, trim: true, required: true, index: {unique: true}},
        senha: {type: String, trim: true, required: true},
        token: {type: String},
        data_criacao: {type: Date},
        data_atualizacao: {type: Date, default: Date.now},
        ultimo_login: {type: Date},
        telefones:[
            {
                _id: {type: String},
                numero: {type: String},
                ddd: {type: String}
            }
        ]
    })

    usuario.options.toJSON = {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;

            for(var i=0, len=ret.telefones.length; i<len; i++) {
                delete ret.telefones[i]._id;
            }
        }
    };

    return Mongoose.model('usuarios', usuario);
}