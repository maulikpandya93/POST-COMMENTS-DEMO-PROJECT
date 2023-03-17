require('dotenv').config();
const express = require('express');
const {sequelize} = require('./config/db_connect');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());


app.get('/', (req, res) => {
    res.send('HOME');
})

app.use("/user", require("./routes/userRoute"));
app.use("/post", require("./routes/postRoute"));

app.get('/*', (req, res) => {
    res.json({
        message : 'Bad Request',
        error : 'YOU MADE MISTAKE IN PATH OF URL'
    })
})

sequelize.authenticate().then(() => {
    console.log('DB CONNECTED!');
    app.listen(PORT, () => {
        console.log(`SERVER STARTED ON PORT ${PORT}`);
    })
})