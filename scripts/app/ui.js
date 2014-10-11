/// <reference path="enums.js" />
/// <reference path="../libs/jquery-2.1.1.js" />

var ui = (function () {
    var today = new Date();
    var todayDate = today.getDate();
    var todayMonth = today.getMonth();
    var todayYear = today.getFullYear();

    function buildStaticHtml() {
            return '' +
            '<div id="logo-container">' +
                '<h1>Calendar</h1>' +
                '<div id="logo"></div>' +
                '<div id="logo-bg"></div>' +
            '</div>' +
            '<div id="calendar">' +
                '<div id="buttons">' +
                    '<input id="previous-button" type="button" value="<" />' +
                    '<input id="today-button" type="button" value="Today" />' +
                    '<input id="next-button" type="button" value=">" />' +
                '</div>' +
                '<div id="tabs">' +
                    '<ul>' +
                        '<li><a href="#agenda-view">Agenda</a></li>' +
                        '<li><a href="#week-view">Week</a></li>' +
                        '<li><a href="#month-view">Month</a></li>' +
                        '<li><a href="#year-view">Year</a></li>' +
                    '</ul>' +
                    '<div class="views" id="agenda-view"></div>' +
                    '<div class="views" id="week-view"></div>' +
                    '<div class="views" id="month-view"></div>' +
                    '<div class="views" id="year-view"></div>' +
                '</div>' +
                '<div id="dialog">' +
                '</div>' +
            '</div>' +
            '<input id="mobile-menu-button" type="button" value="☰" />' +
            '<div id="menu">' +
                '<input id="create-task-button" type="button" value="CREATE TASK" />' +
                '<div id="mini-month-view">' +
                '</div>' +
            '</div>';
    }

    function buildTask(task) {
        var html =
         '<div class="tasks ' + task.category + '" ' + 'id="' + task._id + '">' +
                '<p class="task-name">' + task.name + '</p>' +
                '<p class="task-note">' + task.notes + '</p>' +
                '<a class="task-close-button">X</a>' +
         '</div>';

        return html;
    }

    function getFirstWeekDay(currentDate) {
        var monday = new Date(currentDate);
        var weekDay = currentDate.getDay();
        if (weekDay === 0) {
            weekDay = 6;
        }
        monday.setDate(currentDate.getDate() - weekDay + 1);

        return monday;
    }

    // TODO: create new task pop-up
    function buildNewTaskPopup() {
        var html =
        '<form id="create-task-form">' +
        '<p>Task Name:</p><input id="form-name" type="text" name="TaskName" /><hr/>' +
        '<p>Date:</p><input type="text" id="form-datepicker"/><hr/>' +
        '<p>Category:</p>' +
        '<select id="form-select">' +
            '<option value="" disabled="disabled" selected="selected">Select a category</option>';
        var length = Object.keys(CategoryType).length;
        for(var i = 0; i < length; i++){
            html += '<option value="' + CategoryType[i].toLowerCase() + '">' + CategoryType[i] + '</option>';
        };
        html +=
        '</select><hr/>' +
        '<textarea id="form-notes" name="notes" maxlength="200" >Enter some notes here...</textarea>' +
        '<input id="form-submit-button" type="button" value="Create" />' +
        '</form>';

        return html;
    }

    // TODO: generate week view
    function buildWeekView(currentDate, tasks) {
        var monday = getFirstWeekDay(currentDate);
        var html = '<div class="table">' +
            '<div class="tr">';
        for (var col = 0; col < weekDaysNames.length; col++) {
            html += '<div class="th">' +
                weekDaysNames[col].slice(0, 3) + '  ' +
                ('0' + monday.getDate()).slice(-2) + '.' +  //add leading zero
                ('0' + (monday.getMonth() + 1)).slice(-2) + '.' + //add leading zero
                monday.getFullYear().toString().slice(-2) +
            '</div>';
            monday.setDate(monday.getDate() + 1);
        }
        html += '</div>' +
            '<div class="tr">';
        var counter = 0;
        var currentDay = getFirstWeekDay(currentDate);
        for (var i = 0; i < weekDaysNames.length; i++) {
            html += '<div class="td ' +
                currentDay.getDate() + '-' +
                (currentDay.getMonth() + 1) + '-' +
                currentDay.getFullYear() +
                '">';
            html += '<div class="tasks-wrapper">'
            while (tasks[0] && ((tasks[0].day == currentDay.getDate()))) {
                /*debugger;*/
                html += buildTask(tasks[counter]);
                /*counter++;*/
                tasks.shift();
            }
            html += '</div></div>';
            currentDay.setDate(currentDay.getDate() + 1);
        }
        html += '</div>' +
        '</div>';

        return html;
    }

    // TODO: generate month view
    function buildMonthView(currentDate, tasks) {
        return buildMiniMonthView(currentDate, tasks, 'month');
    }

    // TODO: generate year view
    function buildYearView(date, tasks) {
        var currentDate = new Date(date);
        var monthCounter = 0;
        var html = '<div class="table"><div class="caption">' + '</div>';
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 4; col++) {
                currentDate.setMonth(monthCounter);
                html +=
                '<div class="month">' +
                  buildMiniMonthView(currentDate, tasks, 'year') +
                '</div>';
                monthCounter++;
            }
        }
        html += '</div>';

        return html;
    }

    // TODO: generate agenda view
    function buildAgendaView(tasks) {
        if(!tasks){
            tasks = [];
        }
        var taskIndex = 0;
        var currentTask = tasks[0];
        var html = '<div class="table">' +
            '<div class="tr">';
        for (var col = 0; col < weekDaysNames.length; col++) {
            if (tasks[taskIndex]) {
                var newDate = new Date(currentTask.year, (currentTask.month - 1), currentTask.day);
                var weekDayIndex = newDate.getDay() - 1;
                if (weekDayIndex == -1) { weekDayIndex = 6; }
                html += '<div class="th">' +
                    weekDaysNames[weekDayIndex].slice(0, 3) + '  ' +
                    ("0" + currentTask.day).slice(-2) + '.' +    //add leading zero
                    ("0" + (currentTask.month + 1)).slice(-2) + '.' +       //add leading zero
                    currentTask.year.toString().slice(-2) +
                '</div>';

                while (tasks[taskIndex] && (currentTask.day == tasks[taskIndex].day) && (currentTask.month == tasks[taskIndex].month)) {
                    taskIndex++;
                }
                currentTask = tasks[taskIndex];
            }
            else {
                html += '<div class="th"></div>';
            }
        }
        html += '</div>' +
            '<div class="tr">';
        // add tasks to the table
        var counter = 0;
        for (var i = 0; i < weekDaysNames.length; i++) {
            if (tasks[counter]) {
                var currentDay = new Date(tasks[counter].year, tasks[counter].month, tasks[counter].day);
                html += '<div class="td ' +
                    currentDay.getDate() + '-' +
                    (currentDay.getMonth() + 1) + '-' +
                    currentDay.getFullYear() +
                    '">';
                html += '<div class="tasks-wrapper">'
                while (tasks[counter] && (tasks[counter].day == currentDay.getDate()) && (tasks[counter].month == currentDay.getMonth())) {
                    html += buildTask(tasks[counter]);
                    counter++;
                }

                html += '</div></div>';
            }
            else {
                html += '<div class="td"></div>';
            }
        }
        html += '</div>' +
        '</div>';

        return html;
    }

    // TODO: generate mini month view, add class to tasks dates
    function buildMiniMonthView(date, tasks, idView) {
        var currentDate = new Date(date);
        idView = idView || 'mini';
        var markTasks = tasks.clone();

        currentDate.setDate(1);
        var weekDay = currentDate.getDay();
        if (weekDay === 0) {
            weekDay = 6;
        }
        var firstCellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - weekDay + 1);


        var html = '<div class="table">' +
            '<div class="caption">' +
                monthsNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear() +
            '</div><div class="tr">';
        for (var i = 0; i < weekDaysNames.length; i++) {
            html += '<div class="th"><p>' + weekDaysNames[i].slice(0, 1) + '</p></div>';
        }
        html += '</div>';

        for (var row = 0; row < 6; row++) {
            html += '<div class="tr">';
            for (var col = 0; col < weekDaysNames.length; col++) {
                var isCurrentMonth = firstCellDate.getMonth() == currentDate.getMonth();
                html += '<div';
                if (isCurrentMonth) {
                    html += ' class="td mini-current-month mini-month-hover ';
                    html += firstCellDate.getDate() + '-' + (firstCellDate.getMonth()+1) + '-' + firstCellDate.getFullYear() + ' ';
                    if(firstCellDate.getDate() == todayDate && firstCellDate.getMonth() == todayMonth && firstCellDate.getFullYear() == todayYear){
                        html += 'today ';
                    }
                    if(true){
                        /*debugger;*/
                    }
                    if(markTasks.length != 0 && ((markTasks[0].month == (firstCellDate.getMonth())) && (markTasks[0].day == firstCellDate.getDate()))){
                        html += 'got-task';
                        while (markTasks.length != 0 && ((markTasks[0].month == (firstCellDate.getMonth())) && (markTasks[0].day == firstCellDate.getDate()))) {
                            markTasks.shift();
                        }
                    }
                }
                else {
                    html += ' class="td mini-other-month';
                }

                html += '"><p>' + firstCellDate.getDate() + '</p>';
                /*debugger;*/
                if (idView == 'month') {
                    html += '<div class="tasks-wrapper">';
                    while (tasks.length != 0 && ((tasks[0].month == (firstCellDate.getMonth())) && (tasks[0].day == firstCellDate.getDate()))) {
                        html += buildTask(tasks[0]);
                        tasks.shift();
                    }
                    html += '</div>';
                }

                html += '</div>';
                firstCellDate.setDate(firstCellDate.getDate() + 1);
            }

            html += '</div>';
        }
        html += '</div>';

        return html;
    }

    return {
        buildStaticHtml: buildStaticHtml,
        buildNewTaskPopup: buildNewTaskPopup,
        buildWeekView: buildWeekView,
        buildMonthView: buildMonthView,
        buildYearView: buildYearView,
        buildAgendaView: buildAgendaView,
        buildMiniMonthView: buildMiniMonthView,
        buildTask: buildTask
    }
}());