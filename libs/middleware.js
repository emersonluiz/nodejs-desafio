import bodyParser from 'body-parser';

module.exports = app => {
    app.set("port", 3000);
    app.set("json spaces", 4);
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        delete req.body.id;
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "Content-Type, Origin, X-Requested-With, Accept, Lang, Authorization");
        next();
    });
};