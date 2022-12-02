const sequelize = require('./db');
const models = require('./models/User');
const express = require('express');
const router = require('./routes/index');
const fileUpload = require('express-fileupload')
const path = require('path')
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()