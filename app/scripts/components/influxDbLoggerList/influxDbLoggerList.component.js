(function () {
	'use strict';
	var app = angular.module('monitorApp');

	app.component('influxDbLoggerList', {
		bindings: {

		},
		templateUrl: '/scripts/components/influxDbLoggerList/influxDbLoggerList.component.html',
		controller: ['PopupService', 'SystemsConfigsQueryByTypeService', 'SystemsService', function (PopupService, SystemsConfigsQueryByTypeService, SystemsService) {

			this.loggers = SystemsConfigsQueryByTypeService.query({ type: 'InfluxDBLogger' });

			this.start = function (loggerName) {
				console.log('Requesting to start', loggerName);

				SystemsService.get({
					systemName: loggerName,
					action: 'start'
				}, function (result) {
					if (result.Success) {
						var successMsg = 'Successfully started' + loggerName;
						console.log(successMsg);
						PopupService.showSuccess('Start', successMsg);
					} else {
						var errMsg = 'Failed to start' + loggerName + ':' + result.Message;
						console.error(errMsg);
						PopupService.showError('Start', errMsg);
					}
				});
			};

			this.stop = function (loggerName) {
				console.log('Requesting to stop', loggerName);

				SystemsService.get({
					systemName: loggerName,
					action: 'stop'
				}, function (result) {
					if (result.Success) {
						var successMsg = 'Successfully stopped' + loggerName;
						console.log(successMsg);
						PopupService.showSuccess('Stop', successMsg);
					} else {
						var errMsg = 'Failed to stop' + loggerName + ':' + result.Message;
						console.error(errMsg);
						PopupService.showError('Stop', errMsg);
					}
				});
			};

			this.restart = function (loggerName) {
				console.log('Requesting to restart', loggerName);

				SystemsService.get({
					systemName: loggerName,
					action: 'restart'
				}, function (result) {
					if (result.Success) {
						var successMsg = 'Successfully restarted' + loggerName;
						console.log(successMsg);
						PopupService.showSuccess('Restart', successMsg);
					} else {
						var errMsg = 'Failed to restart' + loggerName + ':' + result.Message;
						console.error(errMsg);
						PopupService.showError('Restart', errMsg);
					}
				});
			};
		}]
	});
})();