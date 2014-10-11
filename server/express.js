var express = require('express');
var bodyParser = require('body-parser');
var tasks = require('./routes/tasks');

var app = express();

// allow server to be called from different domain
var allowCrossDomain = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(bodyParser());
app.use(allowCrossDomain);

app.get('/', function (req, res)
{
    res.send('BAD REQUEST: INVALID URL')
});

// task routes
app.get('/task-by-year/:year', tasks.getByYear);
app.get('/task-by-month/:year/:month', tasks.getByMonth);
app.get('/task-by-week/:year/:month/:day', tasks.getByWeek);
app.get('/task-by-agenda/:year/:month/:day', tasks.getByAgenda);
app.get('/task-single/:id', tasks.getById);
app.post('/task-add', tasks.add);
app.post('/task-edit/:id', tasks.update);
app.get('/task-delete/:id', tasks.delete);

app.listen(3000, function ()
{
    tasks.rebuildTaskMapping();
});
console.log('Listening...');