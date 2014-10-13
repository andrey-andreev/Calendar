var express = require('express');
var mongoskin = require('mongoskin');
var ObjectID = require('mongoskin').ObjectID;
var _ = require('underscore');
var async = require('async');

var db = mongoskin.db('mongodb://CalendarAdmin:calendarpass@kahana.mongohq.com:10099/Calendar', {safe: true});
var taskCollection = db.collection('tasks');
var taskMapping = [];
var tasks = {

    //todo: fix sorting to be for right key, now is by id
    addInTaskMapping: function (day, month, year)
    {
        //check if array is empty
        if (!_.isEmpty(taskMapping))
        {
            //check if we already have saved current date
            var currentDate = _.findWhere(taskMapping, {day: day, month: month, year: year});
            if (!currentDate)
            {
                var currentMonth = _.where(taskMapping, {month: month, year: year});
                if (currentMonth.length != 0)
                {
                    var afterDay = _.find(currentMonth, function (element)
                    {
                        return element.day > day
                    });

                    if (afterDay)
                    {
                        var index = _.indexOf(taskMapping, afterDay);
                        taskMapping.splice(index, 0, {day: day, month: month, year: year});
                    }
                    else
                    {
                        taskMapping.splice(currentMonth.length, 0, {day: day, month: month, year: year});
                    }
                }
                else
                {
                    var currentYear = _.where(taskMapping, {year: year});
                    if (currentYear.length != 0)
                    {
                        var afterMonth = _.find(currentYear, function (element)
                        {
                            return element.month > month
                        });

                        if (afterMonth)
                        {
                            var index = _.indexOf(taskMapping, afterMonth);
                            taskMapping.splice(index, 0, {day: day, month: month, year: year});
                        }
                        else
                        {
                            taskMapping.splice(currentYear.length, 0, {day: day, month: month, year: year});
                        }
                    }
                    else
                    {
                        var afterYear = _.find(taskMapping, function (element)
                        {
                            return element.year > year
                        });

                        if (afterYear)
                        {
                            var index = _.indexOf(taskMapping, afterYear);
                            taskMapping.splice(index, 0, {day: day, month: month, year: year});
                        }
                        else
                        {
                            taskMapping.push({day: day, month: month, year: year});
                        }
                    }
                }
            }
        }
        else
        {
            taskMapping.push({day: day, month: month, year: year});
        }
    },

    removeFromTaskMapping: function (day, month, year)
    {
        var index;
        var deletedTask = _.find(taskMapping, function (task, currentIndex)
        {
            if (task.day == day && task.month == month && task.year == year)
            {
                index = currentIndex;
                return true;
            }
        });
        if (index)
        {
            taskMapping.splice(index, 1);
        }
    },

    rebuildTaskMapping: function ()
    {
        taskCollection.find({}, {year: 1, month: 1, day: 1, _id: 0}).sort({"year": 1, "month": 1, "day": 1}).toArray(function (err, results)
        {
            if (err)
            {
                throw new Error("Error with loading task records");
            }

            for (var i = 0; i < results.length; i++)
            {
                var currentRes = { day: results[i].day, month: results[i].month, year: results[i].year};
                var currentDate = _.findWhere(taskMapping, currentRes);
                if (!currentDate)
                {
                    taskMapping.push(currentRes);
                }
            }

            console.log(taskMapping);
            console.log("Done inserting task records into map ");
        })
    },

    //todo: fix projection
    getByYear         : function (req, res)
    {
        var year = parseInt(req.params.year);
        if (!tasks.isValidYear(year))
        {
            return res.status(500).send({ error: 'INVALID YEAR: GO BACK TO THE PRESENT' });
        }

        taskCollection.find({year: year}, {fields: {day: 1, month: 1, year: 1, _id: 0}}).toArray(function (err, results)
        {
            if (err)
            {
                return res.send(err);
            }

            return res.send(results)
        })
    },

    getByMonth: function (req, res)
    {
        var month = parseInt(req.params.month);
        if (!tasks.isValidMonth(month))
        {
            return res.status(500).send({ error: 'INVALID MONTH' });
        }

        var year = parseInt(req.params.year);
        if (!tasks.isValidYear(year))
        {
            return res.status(500).send({ error: 'INVALID YEAR: GO BACK TO THE PRESENT' });
        }

        taskCollection.find({year: year, month: month}).toArray(function (err, results)
        {
            if (err)
            {
                return res.send(err);
            }

            return res.send(results)
        })
    },

    //todo: fix projection
    getByWeek : function (req, res)
    {
        var year = parseInt(req.params.year);
        if (!tasks.isValidYear(year))
        {
            return res.status(500).send({ error: 'INVALID YEAR: GO BACK TO THE PRESENT' });
        }

        var month = parseInt(req.params.month);
        if (!tasks.isValidMonth(month))
        {
            return res.status(500).send({ error: 'INVALID MONTH' });
        }

        var day = parseInt(req.params.day);
        if (!tasks.isValidDay(day, month, year))
        {
            return res.status(500).send({ error: 'INVALID DAY' });
        }

        var currentDate = new Date(year, month - 1, day);
        var week = tasks.getWeekNumber(currentDate);

        taskCollection.find({week: week}).toArray(function (err, results)
        {
            if (err)
            {
                return res.send(err);
            }

            return res.send(results);
        })
    },

    getById: function (req, res)
    {
        var id = req.params.id;
        var objectId = new ObjectID(id);

        taskCollection.findOne({ _id: objectId }, function (err, result)
        {
            if (err)
            {
                return res.send(err);
            }

            return res.send(result);
        })
    },

    addDatesForAgenda: function (dates, startTaskIndex, futureTasks)
    {
        if (futureTasks)
        {
            var len = (taskMapping.length <= (startTaskIndex + 6)) ? taskMapping.length : (startTaskIndex + 7);
            for (var i = startTaskIndex; i < len; i++)
            {
                dates.push(taskMapping[i]);
            }
        }
        else
        {
            var len = (0 >= (startTaskIndex - 6)) ? 0 : (startTaskIndex - 7);
            for (var i = startTaskIndex; i > len; i--)
            {
                dates.push(taskMapping[i]);
            }
        }
    },

    //todo: fix projection
    getByAgenda      : function (req, res)
    {
        var year = parseInt(req.params.year);
        if (!tasks.isValidYear(year))
        {
            return res.status(500).send({ error: 'INVALID YEAR: GO BACK TO THE PRESENT' });
        }

        var month = parseInt(req.params.month);
        if (!tasks.isValidMonth(month))
        {
            return res.status(500).send({ error: 'INVALID MONTH' });
        }

        var day = parseInt(req.params.day);
        if (!tasks.isValidDay(day, month, year))
        {
            return res.status(500).send({ error: 'INVALID DAY' });
        }

        //if passed flag is equal to 'true', we set variable to be equal to true, otherwise to false
        var futureTasks = req.params.flag == 'true';
        var dates = [];
        //todo -optimization: merge addInTaskMapping and code below
        //return tasks for current date if there are any or first day that have tasks + return next 6 days that have tasks
        var firstDay = _.findWhere(taskMapping, {day: day, month: month, year: year});
        if (firstDay)
        {
            //get next six days that have task
            var index = _.indexOf(taskMapping, firstDay);
            tasks.addDatesForAgenda(dates, index, futureTasks);
        }
        else
        {
            var currentMonth = _.where(taskMapping, {month: month, year: year});
            if (currentMonth.length != 0)
            {
                var firstDay = _.find(currentMonth, function (element)
                {
                    return element.day > day
                });

                if (firstDay)
                {
                    var index = _.indexOf(taskMapping, firstDay);
                    tasks.addDatesForAgenda(dates, index, futureTasks);
                }
                else
                {
                    var index = _.indexOf(taskMapping, currentMonth[currentMonth.length - 1]) + 1;
                    tasks.addDatesForAgenda(dates, index, futureTasks);
                }
            }
            else
            {
                var currentYear = _.where(taskMapping, {year: year});
                if (currentYear.length != 0)
                {
                    var firstMonth = _.find(currentYear, function (element)
                    {
                        return element.month > month
                    });

                    if (firstMonth)
                    {
                        var index = _.indexOf(taskMapping, firstMonth);
                        tasks.addDatesForAgenda(dates, index, futureTasks);
                    }
                    else
                    {
                        var index = _.indexOf(taskMapping, currentYear[currentYear.length - 1]) + 1;
                        tasks.addDatesForAgenda(dates, index, futureTasks);
                    }
                }
                else
                {
                    var firstYear = _.find(taskMapping, function (element)
                    {
                        return element.year > year
                    });

                    if (firstYear)
                    {
                        var index = _.indexOf(taskMapping, firstYear);
                        tasks.addDatesForAgenda(dates, index, futureTasks);
                    }
                }
            }
        }

        var allTasks = {};
        if (dates.length > 0)
        {
            if (!futureTasks)
            {
                dates = dates.reverse();
            }

            async.eachSeries(dates, function (date, callback)
            {
                tasks.getByDay(date.day, date.month, date.year, function (err, results)
                {
                    if (err)
                    {
                        return callback(err);
                    }
                    var dateStr = date.day + '-' + date.month + '-' + date.year;
                    allTasks[dateStr] = results;
                    callback();
                })
            }, function (err)
            {
                if (err)
                {
                    res.send(err);
                }

                //todo: check if results are ordered in the right way
                res.send(allTasks);
            })
        }
        else
        {
            res.send(allTasks);
        }
    },

    getByDay: function (day, month, year, callback)
    {
        taskCollection.find({year: year, month: month, day: day}).toArray(function (err, results)
        {
            if (err)
            {
                return callback(err);
            }

            return callback(null, results);
        })
    },

    add: function (req, res)
    {
        var year = parseInt(req.body.year);
        if (!tasks.isValidYear(year))
        {
            return res.status(500).send({ error: 'INVALID YEAR: GO BACK TO THE PRESENT' });
        }

        var month = parseInt(req.body.month);
        if (!tasks.isValidMonth(month))
        {
            return res.status(500).send({ error: 'INVALID MONTH' });
        }

        var day = parseInt(req.body.day);
        if (!tasks.isValidDay(day, month, year))
        {
            return res.status(500).send({ error: 'INVALID DAY' });
        }

        if (!req.body.name)
        {
            return res.status(500).send({ error: 'INVALID TASK NAME' });
        }

        var week = tasks.getWeekNumber(new Date(year, month - 1, day));
        var task = {
            year    : year,
            month   : month,
            week    : week,
            day     : day,
            name    : req.body.name,
            notes   : req.body.notes,
            category: req.body.category
        }
        taskCollection.insert(task, {}, function (err, results)
        {
            if (err)
            {
                return res.send(err);
            }

            tasks.addInTaskMapping(parseInt(req.body.day), parseInt(req.body.month), parseInt(req.body.year));
            return res.send(results[0]);
        })
    },

    update: function (req, res)
    {
        var id = req.params.id;
        var objectId = new ObjectID(id);

        taskCollection.findAndModify({_id: objectId}, [
            ['_id', 1]
        ], {$set: req.body}, {new: true}, function (err, result)
        {
            if (err)
            {
                return res.send(err);
            }

            return res.send(result);
        })
    },

    delete: function (req, res)
    {
        var id = req.params.id;
        var objectId = new ObjectID(id);
        taskCollection.findAndRemove({_id: objectId}, [
            ['_id', 1]
        ], function (err, result)
        {
            if (err)
            {
                return res.send(err);
            }

            //remove deleted task from taskMapping
            tasks.removeFromTaskMapping(result.day, result.month, result.year);
            return res.send({msg: 'success'});
        })
    },

    isValidYear: function (year)
    {
        var today = new Date();
        if ((year > today.getFullYear() + 5) || (year < today.getFullYear() - 5))
        {
            return false;
        }

        return true;
    },

    isValidMonth: function (month)
    {
        if (month > 12 || month < 1)
        {
            return false;
        }

        return true;
    },

    isValidDay: function (day, month, year)
    {
        //todo: can be done with new Date() and check if it's a valid date
        var maxDay;

        if (month == 2)
        {
            maxDay = (year % 4 == 0 && year % 100) || year % 400 == 0 ? 29 : 28;
        }
        else if (month == 4 || month == 6 || month == 9 || month == 11)
        {
            maxDay = 30;
        }
        else
        {
            maxDay = 31;
        }

        if (day < 1 || day > maxDay)
        {
            return false;
        }
        return true;
    },

    getWeekNumber: function (date)
    {
        var d = new Date(date);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    }
}

module.exports = tasks;