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

const writeToJson = async () => {
    const callbackWriteFile = (err, content) => {
        if (err) { return console.error(err); };

        console.log(`write JSON done ... \n${content}`);

    };

    const toWrite = JSON.stringify(wholeJson, null, 2);
    fs.writeFile(__dirname + '/db.json', toWrite, callbackWriteFile);
}


app.get('/api/courses', (req, res) => {
    res.send(wholeJson);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});


app.post('/api/courses', (req, res) => {
    // object restructuring
    const { error } = validationCourse(req.body); // result.error

    if (error) {
        // 400 Bad request
        // res.status(400).send(result.error);
        res.status(400).send(error.details[0].message);
        return;

    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);

    writeToJson(wholeJson);

    res.send(course);
});



function validationCourse(course) {

    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}





// PORT environment variable..
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));