const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const express = require('express');
const logger = require('./logger');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(helmet())
app.use(morgan('tiny'))
app.use(logger);

console.log(`Application name: ${config.get('name')}`)
console.log(`Mail server: ${config.get('mail.host')}`)

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'}
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given ID was not found.');
    }

    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name:  req.body.name
    };

    courses.push(course);

    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given ID was not found.');
    }

    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    course.name = req.body.name;

    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));