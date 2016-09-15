(function () {

	'use strict';

	var app = angular.module('monitorApp');

	app.component('userInfoTopRight', {
		bindings: {
			userName: '<'
		},
		templateUrl: '/scripts/components/user-info-top-right/user-info-top-right.component.html',
		controller: ['$scope', 'adalAuthenticationService', function ($scope, adalAuthenticationService) {

			var self = this;

			self.logout = function () {
			    console.log('bye');
			    adalAuthenticationService.logOut();
			}

		}]
	});

})();