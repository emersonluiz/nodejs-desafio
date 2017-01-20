module.exports = app => {

    if (process.env.NODE_ENV !== "test") {
        app.listen(app.get("port"), () => {
            console.log(`Node runing on port: ${app.get("port")}`);
        });
    }
}