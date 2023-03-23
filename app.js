require('dotenv').config();
const express = require('express');
const app = express();
const {sequelize} = require('./config/db_connect');
const JwtStrategy = require("passport-jwt").Strategy;
const { cookieExtractor } = require('./middlewares/isAuth');
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');
const passport = require('passport');
const userModel = require('./models/userModel');


const opts = {
    jwtFromRequest:cookieExtractor,
    secretOrKey:process.env.SECRET_KEY
}
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
   const user = await userModel.findOne({where : {id : jwt_payload.id}})
   if(!user) return done(null,false)
   return done(null,user)
}))

    

app.get('/', (req, res) => {
    res.send('HOME');
})
app.use(express.json())
app.use(cookieParser());
app.use("/user", require("./routes/userRoute"));
app.use("/post", require("./routes/postRoute"));
app.use("/comment", require("./routes/commentRoute"));

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