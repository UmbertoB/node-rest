const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const routers = require('./routers');
const tokenGuard = require('./middlewares/token-guard');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'));
app.use(cors());
app.set('view engine', 'ejs');
dotenv.load();



app.use(tokenGuard());

app.use('/static', express.static(__dirname + '/public'));
routers(app);



const port = process.env.SERVER_PORT;


app.listen(process.env.PORT || port, () => {
    console.log(`Server Running ${process.env.NODE_ENV === 'production' ? '(in production)' : ''}${port ? 'on Port ' + port : ''}`);
});