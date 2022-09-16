const fs = require('fs');
const express = require('express')
const path = require("path");
var getIP = require('ipware')().get_ip;

const app = express()

const port = 3000
let dirs = [['/main', '/']]

app.use(express.static('static'))
app.set('view engine', 'ejs');

fs.readdir('./routers', (err, files) => {
    let routers = []
    files.forEach(file => {
        var obj = new Object()
        obj.func = require('./routers/' + file)
        obj.name = "/" + path.parse(file).name
        routers.push(obj)
    });
    for (const key in routers) {
        for (const dirsKey in dirs) {
            if (routers[key].name === dirs[dirsKey][0]) {
                routers[key].name = dirs[dirsKey][1]
            }
        }
        console.log("Router for page:", routers[key].name, "loaded successfully")
        app.use(routers[key].name, routers[key].func)
    }
});

const logRequestStart = (req, res, next) => {
    var ipInfo = getIP(req);
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + "@" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    console.info(`${datetime} ${ipInfo.clientIp} ${req.method} ${req.originalUrl}`)
    next()
}
app.use(logRequestStart)

app.listen(port, () => {
    console.log(`App is ready to use on port: ${port}`)
})