module.exports = app => {

    app.get("/", (req, res) => {
        res.status(404).json({mensagem: "Endpoint inválido"});
    })
}