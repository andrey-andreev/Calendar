/// <reference path="../libs/jquery-2.1.1.js" />
/// <reference path="../libs/prototype.js" />
/// <reference path="../libs/http-requester.js" />
/// <reference path="controller.js" />

var persisters = (function ()
{
    var MainPersister = Class.create({
        initialize        : function ()
        {
            //            this.url = "http://localhost:18440/scripts/server/";
//            this.url = "http://localhost:3000/task-";
            this.url = "http://my-calndar-server-api.jit.su/task-";
        },
        /*requestTasks: function (filename, success) {
         //            var newUrl = this.url + filename + ".js";
         httpRequester.getJSON(this.url,
         function (data) {
         success(data);
         },
         function (err) {
         console.log("Error: ", err);
         //error(err);
         });
         },*/
        requestTasksByYear: function (currentDate, success)
        {
            var newUrl = this.url + 'by-year/' + currentDate.getFullYear();
            httpRequester.getJSON(newUrl,
                function (data)
                {
                    success(data);
                },
                function (err)
                {
                    console.log("Error: ", err);
                    //error(err);
                });
        },
        requestTasksByMonth: function (currentDate, success)
        {
            var newUrl = this.url + 'by-month/' + currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1);
            httpRequester.getJSON(newUrl,
                function (data)
                {
                    success(data);
                },
                function (err)
                {
                    console.log("Error: ", err);
                    //error(err);
                });
        },
        requestTasksByWeek: function (currentDate, success)
        {
            var newUrl = this.url + 'by-week/' + currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate();
            httpRequester.getJSON(newUrl,
                function (data)
                {
                    success(data);
                },
                function (err)
                {
                    console.log("Error: ", err);
                    //error(err);
                });
        },
        requestTasksByAgenda: function (currentDate, success)
        {
            var newUrl = this.url + 'by-agenda/' + currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate();
            httpRequester.getJSON(newUrl,
                function (data)
                {
                    success(data);
                },
                function (err)
                {
                    console.log("Error: ", err);
                    //error(err);
                });
        },
        requestTaskById: function (taskId, success)
        {
            var newUrl = this.url + 'single/' + taskId;
            httpRequester.getJSON(newUrl,
                function (data)
                {
                    success(data);
                },
                function (err)
                {
                    console.log("Error: ", err);
                    //error(err);
                });
        },
        addTask: function (taskObject, success)
        {
            var newUrl = this.url + 'add';
            httpRequester.postJSON(newUrl, taskObject,
                function (data)
                {
                    success(data);
                },
                function (err)
                {
                    console.log("Error: ", err);
                    //error(err);
                });
        },
        editTask: function (taskObject, id, success)
        {
            var newUrl = this.url + 'edit' + '/' + id;
            httpRequester.postJSON(newUrl, taskObject,
                function (data)
                {
                    success(data);
                },
                function (err)
                {
                    console.log("Error: ", err);
                    //error(err);
                });
        },
        deleteTask: function (id, success)
        {
            var newUrl = this.url + 'delete' + '/' + id;
            httpRequester.getJSON(newUrl,
                function (data)
                {
                    success(data);
                },
                function (err)
                {
                    console.log("Error: ", err);
                    //error(err);
                });
        }
    });

    return {
        get: function ()
        {
            return new MainPersister();
        }
    };
}());