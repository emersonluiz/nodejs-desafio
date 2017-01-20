describe("Routes: Usuarios", () => {
    const usuarios = app.db.model("usuarios")

    beforeEach(done => {

        usuarios.remove({}, (error, us) => {
           request.post("/usuarios")
                .send({
                    nome: "Emerson Castro",
                    email: "contato@emersonluiz.com.br",
                    senha: "1234"
                })
                .end((err, res) => {
                    done();
                })
        });
    });

    describe("Cadastro Usuario", () => {
        it("cadastra e autentica um usuario", done => {
            request.post("/usuarios")
                .send({
                    nome: "Mickey Mouse",
                    email: "test@test.com",
                    senha: "1234"
                })
                .end((err, res) => {
                    expect(res.status).to.eql(201);
                    done();
                })
        });

        it("erro ao autenticar um usuario - email existente", done => {
            request.post("/usuarios")
                .send({
                    nome: "Emerson Castro",
                    email: "contato@emersonluiz.com.br",
                    senha: "1234"
                })
                .end((err, res) => {
                    const expected = {mensagem: "E-mail já existente"};
                    expect(res.status).to.eql(400);
                    expect(res.body).to.eql(expected);
                    done();
                })
        });

        it("erro ao autenticar um usuario - Nome obrigatório", done => {
            request.post("/usuarios")
                .send({
                    email: "node@node.com",
                    senha: "1234"
                })
                .end((err, res) => {
                    const expected = {mensagem: "Nome é obrigatório"};
                    expect(res.status).to.eql(400);
                    expect(res.body).to.eql(expected);
                    done();
                })
        });

        it("erro ao autenticar um usuario - Email obrigatório", done => {
            request.post("/usuarios")
                .send({
                    nome: "Chico",
                    senha: "1234"
                })
                .end((err, res) => {
                    const expected = {mensagem: "Email é obrigatório"};
                    expect(res.status).to.eql(400);
                    expect(res.body).to.eql(expected);
                    done();
                })
        });

        it("erro ao autenticar um usuario - Senha obrigatório", done => {
            request.post("/usuarios")
                .send({
                    nome: "Node",
                    email: "node@node.com"
                })
                .end((err, res) => {
                    const expected = {mensagem: "Senha é obrigatório"};
                    expect(res.status).to.eql(400);
                    expect(res.body).to.eql(expected);
                    done();
                })
        });
    });

    describe("Sign in", () => {
        it("retorna o usuario autenticado", done => {
            request.post("/sign_in")
                .send({
                    email: "contato@emersonluiz.com.br",
                    senha: "1234"
                })
                .end((err, res) => {
                    expect(res.status).to.eql(200);
                    expect(res.body).to.include.keys("token");
                    done();
                })
        });

        it("erro ao autenticar", done => {
            request.post("/sign_in")
                .send({
                    email: "coontato@emersonluiz.com.br",
                    senha: "1234"
                })
                .end((err, res) => {
                    const expected = {mensagem: "Usuário e/ou senha inválidos"};
                    expect(res.status).to.eql(401);
                    expect(res.body).to.eql(expected);
                    done();
                })
        });
    });

    describe("Buscar Usuario", () => {
        it("retorna o usuario", done => {
            request.post("/sign_in")
                .send({
                    email: "contato@emersonluiz.com.br",
                    senha: "1234"
                })
                .end((err, res) => {

                    request.get("/usuarios/" + res.body.id)
                        .set("Authorization", "Bearer " + res.body.token)
                        .end((err, resp) => {
                            expect(res.status).to.eql(200);
                            expect(resp.body).to.include.keys("email");
                            expect(resp.body.id).to.eql(res.body.id)
                            expect(resp.body.email).to.eql(res.body.email)
                            done();
                        })
                })
        });

        it("erro ao retornar o usuario - Não autorizado", done => {
            request.post("/sign_in")
                .send({
                    email: "contato@emersonluiz.com.br",
                    senha: "1234"
                })
                .end((err, res) => {

                    request.get("/usuarios/" + res.body.id)
                        .set("Authorization", "Bearer ")
                        .end((err, resp) => {
                            const expected = {mensagem: "Não autorizado"};
                            expect(resp.status).to.eql(401);
                            expect(resp.body).to.eql(expected);
                            done();
                        })
                })
        });

        it("erro ao retornar o usuario - Usuário não existe", done => {
            request.post("/sign_in")
                .send({
                    email: "contato@emersonluiz.com.br",
                    senha: "1234"
                })
                .end((err, res) => {

                    request.get("/usuarios/1")
                        .set("Authorization", "Bearer " + res.body.token)
                        .end((err, resp) => {
                            const expected = {mensagem: "Usuário não existe"};
                            expect(resp.status).to.eql(404);
                            expect(resp.body).to.eql(expected);
                            done();
                        })
                })
        });
    });
});