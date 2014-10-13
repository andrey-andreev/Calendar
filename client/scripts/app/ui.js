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

    function buildTask(tasks) {
        var html = '';
        for(var i = 0; i < tasks.length; i++){
            var curTask = tasks[i];
            html +=
             '<div class="tasks ' + curTask.category + '" ' + 'id="' + curTask._id + '">' +
                    '<p class="task-name">' + curTask.name + '</p>' +
                    '<p class="task-note">' + curTask.notes + '</p>' +
                    '<a class="task-close-button">X</a>' +
             '</div>';
        }

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
        }
        html +=
        '</select><hr/>' +
        '<textarea id="form-notes" name="notes" maxlength="200" >Enter some notes here...</textarea>' +
        '<input id="form-submit-button" type="button" value="Create" />' +
        '</form>';

        return html;
    }

    function buildWeekView(currentDate) {
        var monday = getFirstWeekDay(currentDate);
        var html = '<div class="table">' +
            '<div class="tr">';
        for (var col = 0; col < weekDaysNames.length; col++) {
            html += '<div class="th">' +
                weekDaysNamesFirstThreeLetters[col] + '  ' +
                ('0' + monday.getDate()).slice(-2) + '.' +  //add leading zero
                ('0' + (monday.getMonth() + 1)).slice(-2) + '.' + //add leading zero
                monday.getFullYear().toString().slice(-2) +
            '</div>';
            monday.setDate(monday.getDate() + 1);
        }
        html += '</div>' +
            '<div class="tr">';

        var currentDay = getFirstWeekDay(currentDate);
        for (var i = 0; i < weekDaysNames.length; i++) {
            html += '<div class="td ' +
                currentDay.getDate() + '-' +
                (currentDay.getMonth() + 1) + '-' +
                currentDay.getFullYear() +
                '">';
            html += '</div>';
            currentDay.setDate(currentDay.getDate() + 1);
        }
        html += '</div>' +
        '</div>';

        return html;
    }

    function buildYearView(date) {
        var currentDate = new Date(date);
        var monthCounter = 0;
        var html = '<div class="table"><div class="caption">' + '</div>';
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 4; col++) {
                currentDate.setMonth(monthCounter);
                html +=
                '<div class="month">' +
                  buildMonthView(currentDate) +
                '</div>';
                monthCounter++;
            }
        }
        html += '</div>';

        return html;
    }

    function buildAgendaView(tasks) {

        var html = '<div class="table">' +
            '<div class="tr">';
        for (var col = 0; col < weekDaysNames.length; col++) {
            html += '<div class="th">';
            if(tasks[col]){
                var className = tasks[col];
                className = className.replace(/-/g , ".");
                className = className.substring(0, className.length - 4) + className.slice(-2);
                html += weekDaysNamesFirstThreeLetters[col] + '  ' + className;
            }
            html += '</div>';
        }
        html += '</div>' +
            '<div class="tr">';

        for (var i = 0; i < weekDaysNames.length; i++) {
            html += '<div class="td ';
            if(tasks[i]){
                html += tasks[i];
            }
            html += '"></div>';
        }
        html += '</div>' +
        '</div>';

        return html;
    }

    function buildMonthView(date) {
        var currentDate = new Date(date);
        currentDate.setDate(1);
        var curDateDay = currentDate.getDate();
        var curDateMonth = currentDate.getMonth();
        var curDateYear = currentDate.getFullYear();
        var weekDay = currentDate.getDay();
        if (weekDay === 0) {
            weekDay = 6;
        }
        var firstCellDate = new Date(curDateYear, curDateMonth, curDateDay - weekDay + 1);


        var html = '<div class="table">' +
            '<div class="caption">' +
                monthsNames[curDateMonth] + ' ' + curDateYear +
            '</div><div class="tr">';
        for (var i = 0; i < weekDaysNames.length; i++) {
            html += '<div class="th"><p>' + weekDaysNamesFirstLetter[i] + '</p></div>';
        }
        html += '</div>';

        for (var row = 0; row < 6; row++) {
            html += '<div class="tr">';
            for (var col = 0; col < weekDaysNames.length; col++) {
                var isCurrentMonth = firstCellDate.getMonth() == curDateMonth;
                var firstCellDateDay = firstCellDate.getDate();
                var firstCellDateMonth = firstCellDate.getMonth();
                var firstCellDateYear = firstCellDate.getFullYear();

                html += '<div  ';
                if (isCurrentMonth) {
                    html += ' class="td mini-current-month mini-month-hover ';
                    html += firstCellDateDay + '-' + (firstCellDateMonth+1) + '-' + firstCellDateYear + ' ';
                    if(firstCellDateDay == todayDate && firstCellDateMonth == todayMonth && firstCellDateYear == todayYear){
                        html += 'today ';
                    }
                }
                else {
                    html += ' class="td mini-other-month';
                }

                html += '"><p>' + firstCellDate.getDate() + '</p>';

                html += '</div>';
                firstCellDate.setDate(firstCellDateDay + 1);
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
        buildTask: buildTask
    }
}());