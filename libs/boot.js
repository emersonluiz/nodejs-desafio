module.exports = app => {

    app.listen(app.get("port"), () => {
        console.log(`Node runing on port: ${app.get("port")}`);
    });
}