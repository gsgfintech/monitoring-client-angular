'use strict';

angular.module('monitorApp')
.controller('SystemStatusDetailsPopupCtrl', ['$rootScope', '$uibModalInstance', 'SystemsStatusAckService', 'SystemsStatusUnackService', 'system', function ($rootScope, $uibModalInstance, SystemsStatusAckService, SystemsStatusUnackService, system) {

    var self = this;

    self.system = system;

    self.detailsLink = '#/systems/' + system.Name;

    self.ackedUntilStr = null;

    self.ackAttribute = function (attributeName) {
        SystemsStatusAckService.get({
            systemName: self.system.Name,
            attributeName: attributeName,
            ackUntil: self.ackedUntilStr
        });

        self.ackedUntil = null;
    };

    self.unackAttribute = function (attributeName) {
        SystemsStatusUnackService.get({
            systemName: self.system.Name,
            attributeName: attributeName
        });
    };

    self.close = function () {
        $uibModalInstance.dismiss('cancel');
    };


    // Event listeners
    
    $rootScope.$on('systemStatusUpdateReceived', function (event, status) {
        self.system = status;
    });

    $rootScope.$on('systemStatusAttributeAckedEvent', function (event, args) {
        ackOrUnackAttribute(args.systemName, args.attributeName, true, args.ackedUntil);
    });

    $rootScope.$on('systemStatusAttributeUnackedEvent', function (event, args) {
        ackOrUnackAttribute(args.systemName, args.attributeName, false, null);
    });

    function ackOrUnackAttribute(systemName, attributeName, isAcked, ackedUntil) {
        if (self.system.Name === systemName) { // Only interested in one system here
            var attributeIndex = findAttributeByName(self.system, attributeName);

            if (attributeIndex > -1) {
                self.system.Attributes[attributeIndex].Acked = isAcked;
                self.system.Attributes[attributeIndex].AckedUntil = ackedUntil;
            } else {
                console.error('Received acked notification for unknown attribute', attributeName, 'of system', systemName);
            }
        }
    }

    function findAttributeByName(system, attributeName) {
        for (var i = 0; i < system.Attributes.length; i++) {
            if (system.Attributes[i].Name === attributeName) {
                return i;
            }
        }

        return -1;
    }

}])
.controller('SystemStatusDetailsCtrl', ['$rootScope', '$stateParams', 'MonitoringAppService', 'SystemsStatusService', function ($rootScope, $stateParams, MonitoringAppService, SystemsStatusService) {

    var self = this;

    self.system = null;

    var systemName = $stateParams.name;

    if (systemName) {
        self.system = SystemsStatusService.get({ systemName: systemName });
    }

    $rootScope.$on('systemStatusUpdateReceivedEvent', function (event, status) {
        if (self.system && self.system.Name === status.Name) {
            self.system = status;
        }
    });

    MonitoringAppService.setupHub();

}]);
