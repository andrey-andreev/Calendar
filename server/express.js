var express = require('express');
var bodyParser = require('body-parser');
var tasks = require('./routes/tasks');

var app = express();

// allow server to be called from different domain
var allowCrossDomain = function (req, res, next)
{
    if (req.method.toUpperCase() === "OPTIONS")
    {
        // Echo back the Origin (calling domain) so that the
        // client is granted access to make subsequent requests
        // to the API.
        res.writeHead(
            "204",
            "No Content",
            {
                "access-control-allow-origin" : '*',
                "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                "access-control-allow-headers": "content-type, accept",
                "access-control-max-age"      : 10, // Seconds.
                "content-length"              : 0
            }
        );

        // End the response - we're not sending back any content.
        return( res.end() );

    }
    else
    {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    }
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
app.get('/task-by-agenda/:year/:month/:day/:flag', tasks.getByAgenda);
app.get('/task-single/:id', tasks.getById);
app.post('/task-add', tasks.add);
app.post('/task-edit/:id', tasks.update);
app.get('/task-delete/:id', tasks.delete);

app.listen(3000, function ()
{
    tasks.rebuildTaskMapping();
});
console.log('Listening...');