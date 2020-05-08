const Joi = require('joi');
const express = require('express');

const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },

]

// 1
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// 1


// // 2
// app.get('/api/courses', (req, res) => {
//     res.send([1,2,3]);
// });
// // 2

// app.get('/api/courses/:id', (req, res) => {
//     res.send(req.params.id);
// });

// // try http://localhost:5000/api/posts/2018/1
// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.params);
// }); 

// // try http://localhost:5000/api/posts/2018/1?sortBy=name
// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.query);
// }); 

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('The course with the given Id was not found.');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    // validation for user input with joi 
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema);
    // console.log(result);

    if (result.error) {
        // 400 Bad request
        // res.status(400).send(result.error);
        res.status(400).send(result.error.details[0].message);
        return;

    }

    // // validation for user input Manually
    // if (!req.body.name || req.body.name.length < 3){
    //     // 400 Bad request
    //     res.status(400).send('Name is required and should me minimum 3 characters');
    //     return;

    // }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        res.status(404).send('The course with the given Id was not found.');
        return;
    }

    // Validate
    // If invalid, return 400 - Bad request
    // const schema = {
    //     name: Joi.string().min(3).required()
    // }

    // const result = validationCourse(req.body);

    // if (result.error) {
    //     // 400 Bad request
    //     // res.status(400).send(result.error);
    //     res.status(400).send(result.error.details[0].message);
    //     return;

    // }

    // object restructuring
    const { error } = validationCourse(req.body); // result.error

    if (error) {
        // 400 Bad request
        // res.status(400).send(result.error);
        res.status(400).send(error.details[0].message);
        return;

    }
    // Update course
    course.name = req.body.name;
    // Return the updated course
    res.send(course);

});

function validationCourse (course) {

    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}



app.delete('/api/courses/:id', (req, res) => {
    // LOok up the course
    //  Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('The course with the given Id was not found.');

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);

});



// PORT environment variable..
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`1listening on port ${port}...`));