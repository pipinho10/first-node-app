const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.static('public'));
app.use(helmet());
app.use(logger);
app.use('/api/courses', courses);
app.use('/', home);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

dbDebugger('Connected to the database...');

console.log(`Application name: ${config.get('name')}`);
console.log(`Mail server: ${config.get('mail.host')}`)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));