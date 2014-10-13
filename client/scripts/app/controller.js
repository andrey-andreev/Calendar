/// <reference path="../libs/jquery-2.1.1.js" />
/// <reference path="../libs/prototype.js" />
/// <reference path="enums.js" />
/// <reference path="persister.js" />
/// <reference path="ui.js" />
/// <reference path="../libs/jquery-ui-1.11.1.custom/jquery-ui.js" />
/// <reference path="../libs/jquery-ui-1.11.1.custom/external/jquery/jquery.js" />

var $j = jQuery.noConflict();

var myControllers = (function () {

    var Controller = Class.create({
        initialize: function () {
            this.persister = persisters.get();
            this.todayDate = new Date();
            this.agendaCurrentDate = new Date();
            this.agendaFutureDate = new Date();

            this.agendaViewId = '#agenda-view';
            this.weekViewId = '#week-view';
            this.monthViewId = '#month-view';
            this.yearViewId = '#year-view';
            this.miniMonthViewId = '#mini-month-view';
        },
        loadUI: function (selector) {
            this.loadStaticHtml(selector);
            this.loadMiniMonthView(this.miniMonthViewId, this.todayDate);
            this.loadWeekView(this.weekViewId, this.todayDate);

            this.attachUIEventHandlers(selector);
        },
        loadStaticHtml: function (selector) {
            var staticHTML = ui.buildStaticHtml();
            $j(selector).html(staticHTML);
        },
        attachUIEventHandlers: function (selector) {
            var self = this;
            var wrapper = $j(selector);

            var currentDate = new Date(this.todayDate);
            var currentDateMini = new Date(this.todayDate);

            function getActiveTabId(){
                var activeTabIndex = $j('#tabs').tabs('option','active');
                var activeTabID = $j('#tabs > ul > li').eq(activeTabIndex).attr('aria-controls');
                return '#' + activeTabID;
            }

            wrapper.on('click', '#mini-previous-button', function () {
                $j(self.miniMonthViewId).empty();
                currentDateMini.setMonth(currentDateMini.getMonth() - 1);
                self.loadMiniMonthView(self.miniMonthViewId, currentDateMini);
            });
            wrapper.on('click', '#mini-next-button', function(){
                $j(self.miniMonthViewId).empty();
                currentDateMini.setMonth(currentDateMini.getMonth() + 1);
                self.loadMiniMonthView(self.miniMonthViewId, currentDateMini);
            });
            wrapper.on('click', '#create-task-button', function(){
                $j(function() {
                    var newTaskDialog = $j( '#dialog' );
                    newTaskDialog.html(ui.buildNewTaskPopup());
                    newTaskDialog.dialog({
                        width: 320,
                        height: 320,
                        show: { effect: "clip", duration: 300 },
                        hide: { effect: "clip", duration: 300 },
                        open: function() {
                            $j( '#form-datepicker' ).datepicker({
                                yearRange: self.todayDate.getFullYear() + ':' + (self.todayDate.getFullYear() + 10),
                                dateFormat : 'dd-mm-yy',
                                firstDay: 1,
                                showButtonPanel: true,
                                showAnim: "fade"
                            });
                        },
                        close: function() {
                            $j( '#form-datepicker' ).datepicker('destroy');
                        }
                    });
                });
            });
            wrapper.on('click', '.tasks', function(){
                var id = $j(this).attr('id');
                self.persister.requestTaskById(id, function (data) {
                    var taskHtml = $j('#' + id);
                    taskHtml.children('.task-name').html(data.name);
                    taskHtml.children('.task-notes').html(data.notes);

                    $j(function() {
                        var newTaskDialog = $j( '#dialog' );
                        newTaskDialog.html(ui.buildNewTaskPopup());
                        newTaskDialog.dialog({
                            width: 320,
                            height: 320,
                            show: { effect: "clip", duration: 300 },
                            hide: { effect: "clip", duration: 300 },
                            open: function() {
                                $j( '#form-datepicker' ).datepicker({
                                    yearRange: self.todayDate.getFullYear() + ':' + (self.todayDate.getFullYear() + 10),
                                    dateFormat : 'dd-mm-yy',
                                    firstDay: 1,
                                    showButtonPanel: true,
                                    showAnim: "fade"
                                });
                            },
                            close: function() {
                                $j( '#form-datepicker' ).datepicker('destroy');
                            }
                        });
                    });

                    //append delete button
                    $j('#create-task-form').append('<input id="form-delete-button" class="' + id + '" type="button" value="Delete">');
                    //edit create button to save
                    $j('#form-submit-button').attr({
                        'value': 'Save',
                        'id': 'form-save-button',
                        'class': id
                    });
                    //fill the form with the target task data
                    $j('#form-name').attr('value', data.name);
                    var dataDate = data.day + '-' + data.month + '-' + data.year;
                    $j('#form-datepicker').attr('value', dataDate);
                    $j('#form-select option[value="' + data.category + '"]').prop('selected', true);
                    $j('#form-notes').text(data.notes);
                });
            });
            wrapper.on('click', '#ui-id-1', function(){
                $j('.views').empty();
                self.loadAgendaView(self.agendaViewId, self.todayDate, true);
            });
            wrapper.on('click', '#ui-id-2', function(){
                $j('.views').empty();
                self.loadWeekView(self.weekViewId, self.todayDate);
            });
            wrapper.on('click', '#ui-id-3', function(){
                $j('.views').empty();
                self.loadMonthView(self.monthViewId, self.todayDate);
            });
            wrapper.on('click', '#ui-id-4', function(){
                $j('.views').empty();
                self.loadYearView(self.yearViewId, self.todayDate);
            });
            wrapper.on('click', '#previous-button', function () {
                var activeTabID = getActiveTabId();

                if(activeTabID === self.agendaViewId){
                    self.loadAgendaView(self.agendaViewId, self.agendaCurrentDate, false);
                }
                else if(activeTabID === self.weekViewId){
                    currentDate.setDate(currentDate.getDate() - 7);
                    self.loadWeekView(self.weekViewId, currentDate);
                }
                else if(activeTabID === self.monthViewId){
                    currentDate.setMonth(currentDate.getMonth() - 1);
                    self.loadMonthView(self.monthViewId, currentDate);
                }
                else if(activeTabID === self.yearViewId){
                    currentDate.setFullYear(currentDate.getFullYear() - 1);
                    self.loadYearView(self.yearViewId, currentDate);
                }
            });
            wrapper.on('click', '#next-button', function () {
                var activeTabID = getActiveTabId();
                debugger;
                if(activeTabID === self.agendaViewId){
                    self.loadAgendaView(self.agendaViewId, self.agendaFutureDate, true);
                }
                else if(activeTabID === self.weekViewId){
                    currentDate.setDate(currentDate.getDate() + 7);
                    self.loadWeekView(self.weekViewId, currentDate);
                }
                else if(activeTabID === self.monthViewId){
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    self.loadMonthView(self.monthViewId, currentDate);
                }
                else if(activeTabID === self.yearViewId){
                    currentDate.setFullYear(currentDate.getFullYear() + 1);
                    self.loadYearView(self.yearViewId, currentDate);
                }
            });
            wrapper.on('click', '#today-button', function () {
                var activeTabID = getActiveTabId();
                currentDate = new Date();

                if(activeTabID === self.agendaViewId){
                    self.loadAgendaView(self.agendaViewId, currentDate,true);
                }
                else if(activeTabID === self.weekViewId){
                    self.loadWeekView(self.weekViewId, currentDate);
                }
                else if(activeTabID === self.monthViewId){
                    self.loadMonthView(self.monthViewId, currentDate);
                }
                else if(activeTabID === self.yearViewId){
                    self.loadYearView(self.yearViewId, currentDate);
                }
            });
            wrapper.on('click', '#mobile-menu-button',function(){
                $j('#menu').toggle('blind', {direction: "up"});
                $j('.ui-tabs-nav').toggle();

            });
            $j(function () {
                $j("#tabs").tabs({ active: 1 });
            });
            //create task
            $j( '#dialog' ).on('click', '#form-submit-button', function() {
                var task = self.getFormData();
                var activeTabID = getActiveTabId();

                self.persister.addTask(task, function(data){
                    var taskClass  = data.day + '-' + data.month + '-' + data.year;
                    if(activeTabID != self.yearViewId){
                        $j('.' + taskClass).append(ui.buildTask([data]));
                    }
                    if(activeTabID == self.agendaViewId){
                        self.loadAgendaView(self.agendaViewId, self.agendaCurrentDate, true);
                    }
                    $j('.' + taskClass).addClass('got-task');
                });
                $j( '#dialog' ).dialog( 'close' );
            });
            //save (edit task)
            $j( '#dialog' ).on('click', '#form-save-button', function() {
                var activeTabID = getActiveTabId();
                var task = self.getFormData();
                var id = $j(this).attr('class');

                self.persister.editTask(task, id, function(data){
                    var taskClass  = data.day + '-' + data.month + '-' + data.year;
                    $j('#' + id).remove();
                    $j('.' + taskClass).append(ui.buildTask([data]));
                    if(activeTabID == self.agendaViewId){
                        self.loadAgendaView(self.agendaViewId, self.agendaCurrentDate, true);
                    }
                });
                $j( '#dialog' ).dialog( 'close' );
            });
            //delete
            $j( '#dialog' ).on('click', '#form-delete-button', function() {
                var activeTabID = getActiveTabId();
                var id = $j(this).attr('class');
                self.persister.deleteTask(id, function(){
                    $j('#' + id).remove();
                    self.loadMiniMonthView(self.miniMonthViewId, self.todayDate);
                    if(activeTabID == self.agendaViewId){
                        self.loadAgendaView(self.agendaViewId, self.agendaCurrentDate, true);
                    }
                });
                $j( '#dialog' ).dialog( 'close' );
            });
            wrapper.on('click', '.task-close-button', function(e) {
                var activeTabID = getActiveTabId();
                var id = $j(this).parent().attr('id');

                self.persister.deleteTask(id, function(){
                    $j('#' + id).remove();
                    self.loadMiniMonthView(self.miniMonthViewId, self.todayDate);
                    if(activeTabID == self.agendaViewId){
                        self.loadAgendaView(self.agendaViewId, self.agendaCurrentDate, true);
                    }
                });
                e.stopPropagation();
            });
        },
        getFormData: function(){
            var form = $j('#create-task-form');
            var date = $j('#form-datepicker').datepicker('getDate');
            var task = {
                "name"    : $j('#form-name').val(),
                "notes"   : $j('#form-notes').val(),
                "year"    : date.getFullYear(),
                "month"   : date.getMonth() + 1,
                "day"    : date.getDate(),
                "category": $j('select#form-select').find('option:selected').attr('value')
            };

            return task;
        },
        loadMiniMonthView: function (selector, date) {
            var self = this;
            this.persister.requestTasksByMonth(date, function (data) {
                var miniMonthViewHtml = ui.buildMonthView(date);
                $j(selector).html(miniMonthViewHtml);
                $j(self.miniMonthViewId).prepend('<input type="button" value=">" id="mini-next-button" class="mini-buttons">');
                $j(self.miniMonthViewId).prepend('<input type="button" value="<" id="mini-previous-button" class="mini-buttons">');
                self.addGotTaskClass(data);
            });
        },
        loadAgendaView: function (selector, date, futureTasksBool) {
            var self = this;
            this.persister.requestTasksByAgenda(date, futureTasksBool, function (data) {
                var dateStr =_.keys(data);
                if(dateStr.length > 0){
                    var lastDay = dateStr[dateStr.length - 1];
                    var splitedLastDay = lastDay.split('-');
                    self.agendaFutureDate = new Date(parseInt(splitedLastDay[2]), parseInt(splitedLastDay[1]) - 1, parseInt(splitedLastDay[0]));
                    self.agendaFutureDate.setDate(self.agendaFutureDate.getDate() + 1);

                    var firstDay = dateStr[0];
                    var splitedFirstDay = firstDay.split('-');
                    self.agendaCurrentDate = new Date(parseInt(splitedFirstDay[2]), parseInt(splitedFirstDay[1]) - 1, parseInt(splitedFirstDay[0]));
                }
                var agendaViewHtml = ui.buildAgendaView(dateStr);
                $j(selector).html(agendaViewHtml);
                self.appendAgendaTasks(data);
            });
        },
        appendAgendaTasks: function (groupedTasks){
            for(var day in groupedTasks){
                var dateCell = $j('.' + day);
                dateCell.append(ui.buildTask(groupedTasks[day]));
            }
        },
        loadWeekView: function (selector, date) {
            var self = this;
            this.persister.requestTasksByWeek(date, function (data) {
                var weekViewHtml = ui.buildWeekView(date);
                $j(selector).html(weekViewHtml);
                self.appendTasks(data);
            });
        },
        loadMonthView: function (selector, date) {
            var self = this;
            this.persister.requestTasksByMonth(date, function (data) {
                var monthViewHtml = ui.buildMonthView(date);
                $j(selector).html(monthViewHtml);
                self.appendTasks(data);
            });
        },
        loadYearView: function (selector, date) {
            var self = this;
            this.persister.requestTasksByYear(date, function (data) {
                var yearViewHtml = ui.buildYearView(date);
                $j(selector).html(yearViewHtml);
                self.addGotTaskClass(data);
            });
        },
        appendTasks: function (data){
            if(data.length > 0){
                var groupedTasks = _.groupBy(data, 'day');

                for(var day in groupedTasks){
                    var firstTask = groupedTasks[day][0];
                    var month = firstTask.month;
                    var year = firstTask.year;
                    var taskClass = day + '-' + month + '-' + year;
                    var dateCell = $j('.' + taskClass);
                    dateCell.append(ui.buildTask(groupedTasks[day]));
                }
            }
        },
        addGotTaskClass: function (data){
            for (var i = 0; i < data.length; i++)
            {
                var curTask = data[i];
                var taskClass = curTask.day + '-' + curTask.month + '-' + curTask.year;
                var dateCell = $j('.' + taskClass);

                dateCell.addClass('got-task');
            }
        }
    });

    return {
        get: function () {
            return new Controller();
        }
    };
}());

$j(function () {
    var controller = myControllers.get();
    controller.loadUI('#wrapper');
});