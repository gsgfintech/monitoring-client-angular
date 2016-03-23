'use strict';

angular.module('monitorApp')
.controller('FxEventsCtrl', ['FXEventsWeekService', function (FXEventsWeekService) {

    var self = this;

    self.events = FXEventsWeekService.query();

}]);
