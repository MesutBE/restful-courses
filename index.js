const Joi = require('joi');
const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

const readJson = () => {
    // const callbackReadfile = (err, content) => {
    //     if (err) { return console.error(err); };

    //     console.log(content);
    // };

    const objToBeParsed = fs.readFileSync(__dirname + '/db.json');
    console.log(objToBeParsed);

    const dataParsed = JSON.parse(objToBeParsed);
    console.log(dataParsed);

    return dataParsed;
}


const wholeJson = readJson();
const courses = wholeJson.courses;


app.get('/api/courses', (req, res) => {
    res.send(wholeJson);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});


// PORT environment variable..
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));