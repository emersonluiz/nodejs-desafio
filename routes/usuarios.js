module.exports = app => {
    const secret = app.libs.config.jwtSecret;
    const usuarios = require('../models/usuarios');
    const BD = usuarios().model("usuarios")
    const jwt = require('jsonwebtoken');
    const uuidV4 = require('uuid/v4');
    var md5 = require('md5');

    app.route("/usuarios")

        .post((req, res) => {

            if (req.body.nome === undefined || req.body.nome === null || req.body.nome === "") {
                return res.status(400).json({mensagem: "Nome é obrigatório"});
            }

            if (req.body.email === undefined || req.body.email === null || req.body.email === "") {
                return res.status(400).json({mensagem: "Email é obrigatório"});
            }

            if (req.body.senha === undefined || req.body.senha === null || req.body.senha === "") {
                return res.status(400).json({mensagem: "Senha é obrigatório"});
            }

            BD.findOne({email: req.body.email}, (error, usuarios) => {

               if (error) return res.status(500).json({mensagem: error.message});

               if (usuarios !== null) {
                   return res.status(400).json({mensagem: "E-mail já existente"});
               } else {
                   var usuario = req.body;
                   usuario.senha = md5(usuario.senha);
                   usuario._id = uuidV4();
                   var token = jwt.sign(usuario, secret);
                   usuario.token = token;
                   usuario.data_criacao = new Date();
                   usuario.ultimo_login = new Date();

                   if (usuario.telefones) {
                       if (Array.isArray(usuario.telefones)) {
                            for(var i=0, len=usuario.telefones.length; i<len; i++) {
                                    usuario.telefones[i]._id = uuidV4();
                            }
                       }
                   }

                   BD.create(req.body, (error, usuario) => {
                        if (error) return res.status(500).json({mensagem: error.message});
                        return res.status(201).json(usuario);
                    });
               }

            });

        });

    app.route("/sign_in")

        .post((req, res) => {

            if (req.body.email === null || req.body.senha === null) {
                return res.status(401).json({mensagem: "Usuário e/ou senha inválidos"});
            }

            BD.findOne({email: req.body.email}, (error, usuarios) => {

               if (error) return res.status(500).json({mensagem: error.message});

               if (usuarios !== null) {

                   if (usuarios.senha === md5(req.body.senha)) {
                       var token = jwt.sign(usuarios, secret);
                       usuarios.token = token;
                       usuarios.ultimo_login = new Date();

                       BD.update({"_id": usuarios._id}, {"token": token, "ultimo_login": usuarios.ultimo_login}, {upset: true}, (error, obj) => {
                            if (error) return res.status(500).json({mensagem: error.message})
                            return res.json(usuarios);
                       });

                   } else {
                        return res.status(401).json({mensagem: "Usuário e/ou senha inválidos"});
                   }
               } else {
                   return res.status(401).json({mensagem: "Usuário e/ou senha inválidos"});
               }

            });

        });


    app.route("/usuarios/:id")

        .get((req, res) => {
            var auth = req.headers.authorization;

            if (auth !== null) {

                var token = auth.split(' ');

                BD.findOne({_id: req.params.id}, (error, usuarios) => {
                    if (error) {
                        return res.status(500).json({mensagem: error.message});
                    }

                    if (token.length > 1) {
                        if (usuarios !== null) {
                            if (usuarios.token === token[1]) {

                                var ultimo_login = new Date(usuarios.ultimo_login);
                                ultimo_login = new Date(ultimo_login.getTime() + (30*60000))

                                if (ultimo_login < (new Date())) {
                                    return res.status(401).json({mensagem: "Sessão inválida"});
                                }

                                return res.json(usuarios);
                            } else {
                                return res.status(401).json({mensagem: "Não autorizado"});
                            }
                        } else {
                            return res.status(404).json({mensagem: "Usuário não existe"});
                        }
                    } else {
                       return res.status(401).json({mensagem: "Não autorizado"});
                    }

                })

            } else {
                return res.status(401).json({mensagem: "Não autorizado"});
            }

        })

}