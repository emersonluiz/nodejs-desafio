describe('Routes: Base Path', () => {
    it('deve retornar status 404 ao fazer GET /', done => {
        request.get('/')
        .end((err, res) => {
            const expected = {mensagem: "Endpoint inválido"};
            expect(res.status).to.eql(404);
            expect(res.body).to.eql(expected);
            done(err);
        });
    });
});