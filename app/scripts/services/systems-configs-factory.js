'use strict';

angular.module('monitorApp')
.factory('SystemsConfigsQueryByTypeService', ['$resource', 'systemsServiceEnpoint', function ($resource, systemsServiceEnpoint) {
    var address = systemsServiceEnpoint + 'api/systemsconfig/type/:type';

    return $resource(address, { type: '@Type' });
}])
.factory('SystemsConfigsService', ['$resource', 'systemsServiceEnpoint', function ($resource, systemsServiceEnpoint) {
    var address = systemsServiceEnpoint + 'api/systemsconfig/:id';

    return $resource(address, { id: '@_id' },
		{
		    update: {
		        method: 'PUT' // this method issues a PUT request
		    }
		});
}]);