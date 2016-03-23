'use strict';

angular.module('monitorApp')
.factory('MonitoringAppService', ['$rootScope', '$timeout', '$filter', 'Hub', 'PopupService', 'MenuService', 'serverEnpoint', function ($rootScope, $timeout, $filter, Hub, PopupService, MenuService, serverEnpoint) {

    // Alerts
    var allOpenAlerts = [];
    var alertsClosedToday = [];

    // IB Broker Client Configs
    var ibBrokerClientConfigs = [];

    // Positions
    var latestPositions = [];

    var hub = new Hub('monitoringAppHub', {
        rootPath: serverEnpoint + '/signalr',
        listeners: {

            // Accounts
            'accountReceived': function (account) {
                console.log('Received account update');

                $rootScope.$broadcast('accounts.accountReceived', { account: account });
            },

            // Alerts
            'allOpenAlertsReceived': function (openAlerts) {
                console.log('Received list of open alerts');

                allOpenAlerts.splice(0, allOpenAlerts.length);

                openAlerts.forEach(function (openAlert) {

                    // Set alert type for proper display by AngularUI
                    if (openAlert.Level === 'INFO') {
                        openAlert.type = 'info';
                    } else if (openAlert.Level === 'WARNING') {
                        openAlert.type = 'warning';
                    } else {
                        openAlert.type = 'danger';
                    }

                    allOpenAlerts.push(openAlert);
                });

                MenuService.getTabsCounts().alertsCount = allOpenAlerts.length;

                $rootScope.$apply();
            },
            'alertsClosedTodayReceived': function (alerts) {
                console.log('Received list of alerts closed today');

                alertsClosedToday.splice(0, alertsClosedToday.length);

                alerts.forEach(function (alert) {

                    // Set alert type for proper display by AngularUI
                    if (alert.Level === 'INFO') {
                        alert.type = 'info';
                    } else if (alert.Level === 'WARNING') {
                        alert.type = 'warning';
                    } else {
                        alert.type = 'danger';
                    }

                    alertsClosedToday.push(alert);
                });

                $rootScope.$apply();
            },
            'alertClosedNotificationReceived': function (alertId) {
                console.log('Alert ' + alertId + ' was closed');

                proceedToCloseAlert(alertId);

                MenuService.getTabsCounts().alertsCount = allOpenAlerts.length;

                $rootScope.$apply();
            },
            'alertClosedFailureNotificationReceived': function (alertId) {
                console.error('Failed to close alert ' + alertId);
            },
            'alertMultiClosedNotificationReceived': function (alertIds) {
                console.log('Several alerts were closed');

                alertIds.forEach(function (alertId) {
                    proceedToCloseAlert(alertId);
                });

                MenuService.getTabsCounts().alertsCount = allOpenAlerts.length;

                $rootScope.$apply();
            },
            'alertMultiClosedFailureNotificationReceived': function (alertIds) {
                console.error('Failed to close multiple alerts', alertIds);
            },
            'noOpenAlertToCloseNotificationReceived': function () {
                console.error('This client requested to close all open alerts. However no open alert was found on the server. This suggests that the client is out of sync. Will request an updated list of open alerts and alerts closed today');

                requestAllOpenAlerts();
                requestAlertsClosedToday();
            },
            'alertDetailsReceived': function (alert) {
                console.log('Received details of alert ' + alert.Id);

                if (alert && alert.Status) {
                    if (alert.Status === 'OPEN') {
                        if (findOpenAlertIndex(alert.Id) < 0) {
                            // Add the alert to the list of open alerts
                            allOpenAlerts.push(alert);
                        }

                        var closedIndex = findClosedAlertIndex(alert.Id);
                        if (closedIndex > -1) {
                            // Remove the alert from the list of closed alerts
                            alertsClosedToday.splice(closedIndex, 1);
                        }
                    } else if (alert.Status === 'CLOSED') {
                        var openIndex = findOpenAlertIndex(alert.Id);
                        if (openIndex > -1) {
                            // Remove the alert from the list of open alerts
                            alertsClosedToday.splice(openIndex, 1);
                        }

                        if (findClosedAlertIndex(alert.Id) < 0) {
                            // Add the alert to the list of closed alerts
                            alertsClosedToday.push(alert);
                        }
                    }
                }
            },
            'newAlertReceived': function (alert) {
                // Show popup
                if (alert.Level === 'INFO') {
                    PopupService.showNote('[INFO] ' + alert.Source, alert.Subject);
                } else if (alert.Level === 'WARNING') {
                    PopupService.showWarning('[WARNING] ' + alert.Source, alert.Subject);
                } else {
                    PopupService.showError('[ERROR] ' + alert.Source, alert.Subject);
                }
            },

            // AlgoDataPoints
            'newAlgoDataPointReceived': function (dataPoint) {
                console.log('Received new algoDataPoint', dataPoint);

                $rootScope.$broadcast('newAlgoDataPointReceivedEvent', { dataPoint: dataPoint });
            },

            // Contracts
            'contractDeleted': function (id) {
                console.log('Received delete notification for contract', id);

                $rootScope.$broadcast('contractDeletedEvent', { id: id });
            },
            'contractInserted': function (contract) {
                console.log('Received insert notification for contract', contract.ContractID);

                $rootScope.$broadcast('contractInsertedEvent', contract);
            },
            'contractUpdated': function (contract) {
                console.log('Received update notification for contract', contract.ContractID);

                $rootScope.$broadcast('contractUpdatedEvent', contract);
            },

            // Executions
            'newExecutionReceived': function (execution) {
                var message = execution.Side + ' ' + execution.Quantity + ' ' + execution.Cross + ' @ ' + execution.Price;

                console.log('Received new execution:', message);

                $rootScope.$broadcast('newExecutionReceivedEvent', execution);

                // Show popup
                PopupService.showSuccess('[TRADE]', message);
            },

            // IB Broker Client Configs
            'allIBBrokerClientConfigsReceived': function (configs) {
                console.log('Received IB broker client configs');

                ibBrokerClientConfigs.splice(0, ibBrokerClientConfigs.length);

                configs.forEach(function (config) {
                    ibBrokerClientConfigs.push(config);
                });
            },
            'iBBrokerClientConfigReceived': function (config) {
                console.log('Received IB broker client config');

                var existingIndex = findIbBrokerClientConfigIndex(config.Id);

                if (existingIndex > -1) { // update
                    ibBrokerClientConfigs[existingIndex].ClientNumber = config.ClientNumber;
                    ibBrokerClientConfigs[existingIndex].Host = config.Host;
                    ibBrokerClientConfigs[existingIndex].Port = config.Port;
                    ibBrokerClientConfigs[existingIndex].TradingAccount = config.TradingAccount;
                } else { // add new
                    ibBrokerClientConfigs.push(config);
                }

                $rootScope.$apply();
            },
            'iBBrokerClientConfigInsertOrUpdateFailed': function (id) {
                var errMsg = 'Update or insert operation failed for IB broker client config ' + id.Name + ' - v' + id.Version;

                console.log(errMsg);

                PopupService.showError('IB Broker Client Config', errMsg);
            },
            'iBBrokerClientConfigDeleted': function (id) {
                console.log('Received delete notification of IB broker client config ' + id.Name + ' - v' + id.Version);

                var existingIndex = findIbBrokerClientConfigIndex(id);

                if (existingIndex > -1) { // remove from list
                    ibBrokerClientConfigs.splice(existingIndex, 1);
                }

                $rootScope.$apply();
            },
            'iBBrokerClientConfigDeleteFailed': function (id) {
                var errMsg = 'Delete operation failed for IB broker client config ' + id.Name + ' - v' + id.Version;

                console.log(errMsg);

                PopupService.showError('IB Broker Client Config', errMsg);
            },

            // NewsBulletins
            'newBulletinReceived': function (bulletin) {
                // Show popup
                if (bulletin.BulletinType === 'REGULAR') {
                    PopupService.showNote('[REGULAR] ' + bulletin.OrigExchange, bulletin.Message);
                } else if (bulletin.BulletinType === 'EXCHANGE_AVAILABLE') {
                    PopupService.showSuccess('[EXCHANGE_AVAILABLE] ' + bulletin.OrigExchange, bulletin.Message);
                } else if (bulletin.BulletinType === 'EXCHANGE_NOT_AVAILABLE') {
                    PopupService.showError('[EXCHANGE_NOT_AVAILABLE] ' + bulletin.OrigExchange, bulletin.Message);
                } else {
                    PopupService.showWarning('[OTHER] ' + bulletin.OrigExchange, bulletin.Message);
                }

                $rootScope.$broadcast('newBulletinReceivedEvent', { bulletin: bulletin });
            },

            // Order
            'orderUpdateReceived': function (order) {
                console.log('Received order update for ', order.OrderID);

                $rootScope.$broadcast('orderUpdatedEvent', { placedTime: order.PlacedTime });
            },

            // Positions
            'newPositionReceived': function (position) {
                console.log('Received position update');

                if (position) {
                    var existingPositionIndex = findPositionIndex(position.Broker, position.AccountName);

                    if (existingPositionIndex > -1) { // replace
                        position.PositionSecurities.forEach(function (positionSecurity) {
                            var existingPositionSecurityIndex = findPositionSecurityIndex(latestPositions[existingPositionIndex], positionSecurity.Cross);

                            if (existingPositionSecurityIndex > -1) { // replace
                                latestPositions[existingPositionIndex].PositionSecurities[existingPositionSecurityIndex].PositionQuantity = positionSecurity.PositionQuantity;
                                latestPositions[existingPositionIndex].PositionSecurities[existingPositionSecurityIndex].AverageCost = positionSecurity.AverageCost;
                                latestPositions[existingPositionIndex].PositionSecurities[existingPositionSecurityIndex].MarketPrice = positionSecurity.MarketPrice;
                                latestPositions[existingPositionIndex].PositionSecurities[existingPositionSecurityIndex].MarketValue = positionSecurity.MarketValue;
                                latestPositions[existingPositionIndex].PositionSecurities[existingPositionSecurityIndex].RealizedPnL = positionSecurity.RealizedPnL;
                                latestPositions[existingPositionIndex].PositionSecurities[existingPositionSecurityIndex].RealizedPnlUsd = positionSecurity.RealizedPnlUsd;
                                latestPositions[existingPositionIndex].PositionSecurities[existingPositionSecurityIndex].UnrealizedPnL = positionSecurity.UnrealizedPnL;
                                latestPositions[existingPositionIndex].PositionSecurities[existingPositionSecurityIndex].UnrealizedPnlUsd = positionSecurity.UnrealizedPnlUsd;
                            } else { // add new
                                latestPositions[existingPositionIndex].PositionSecurities.push(positionSecurity);
                            }
                        });
                    } else { // add new
                        latestPositions.push(position);
                    }

                    $rootScope.$broadcast('positionUpdateReceivedEvent', position);

                    $rootScope.$apply();
                }
            },
            'latestPositionsReceived': function (positions) {
                console.log('Received list of latest positions');

                latestPositions.splice(0, latestPositions.length);

                positions.forEach(function (position) {
                    latestPositions.push(position);
                });

                $rootScope.$apply();
            },

            // Strategies
            'stratDeleted': function (name, version) {
                console.log('Received delete notification for strat', name, version);

                $rootScope.$broadcast('stratDeletedEvent', { name: name, version: version });
            },
            'stratInserted': function (strat) {
                console.log('Received insert notification for strat', strat.Name, strat.Version);

                $rootScope.$broadcast('stratInsertedEvent', strat);
            },
            'stratUpdated': function (strat) {
                console.log('Received update notification for strat', strat.Name, strat.Version);

                $rootScope.$broadcast('stratUpdatedEvent', strat);
            },

            // Systems
            'systemStatusUpdateReceived': function (status) {
                $rootScope.$broadcast('systemStatusUpdateReceivedEvent', status);
            },
            'systemStatusAttributeAcked': function (systemName, attributeName, ackedUntil) {
                console.log('Received acked notification for attribute', attributeName, 'of system', systemName, 'until', ackedUntil);

                $rootScope.$broadcast('systemStatusAttributeAckedEvent', {
                    systemName: systemName,
                    attributeName: attributeName,
                    ackedUntil: ackedUntil
                });
            },
            'systemStatusAttributeUnacked': function (systemName, attributeName) {
                console.log('Received unacked notification for attribute', attributeName, 'of system', systemName);

                $rootScope.$broadcast('systemStatusAttributeUnackedEvent', {
                    systemName: systemName,
                    attributeName: attributeName
                });
            },

            // Trade Engines
            'tradeEngineControlMessageReceived': function (message) {
                console.log('Received trade engine control message: ' + message);

                PopupService.showNote('Trade Engine Control', message);
            },
            'tradeEngineStatusReceived': function (status) {
                if (status) {
                    $rootScope.$broadcast('status.tradeEngineStatusReceived', { status: status });
                }
            }
        },

        methods: [
            // Accounts
            'requestAccount',

            // Alerts
            'requestAllOpenAlerts', 'requestAlertsClosedToday', 'requestCloseAlert', 'requestCloseAllOpenAlerts', 'requestAlertById',

            // Crosses
            'requestSaveContract',

            // IB Broker Client Configs
            'requestIBBrokerClientConfigs', 'requestInsertIBBrokerClientConfig', 'requestSaveIBBrokerClientConfig', 'requestDeleteIBBrokerClientConfig',

            // Loggers
            'requestSaveConfig',

            // Orders
            'requestTodaysOrders',

            // Positions
            'requestLatestPositions'
        ],

        errorHandler: function (error) {
            console.error(error);
        },

        logging: false,
        useSharedConnection: false
    });

    // Accounts
    var requestAccount = function (accountName) {
        console.log('Requesting account details for ' + accountName);

        hub.requestAccount(accountName);
    };

    // Alerts
    var findOpenAlertIndex = function (alertId) {
        for (var i = 0; i < allOpenAlerts.length; i++) {
            if (allOpenAlerts[i].AlertId === alertId) {
                return i;
            }
        }

        return -1;
    };

    var findClosedAlertIndex = function (alertId) {
        for (var i = 0; i < alertsClosedToday.length; i++) {
            if (alertsClosedToday[i].AlertId === alertId) {
                return i;
            }
        }

        return -1;
    };

    var requestAllOpenAlerts = function () {
        console.log('Requesting all open alerts');

        hub.requestAllOpenAlerts();
    };

    var requestAlertsClosedToday = function () {
        console.log('Requesting alerts closed today');

        hub.requestAlertsClosedToday();
    };

    var closeAlert = function (index) {
        console.log('Requesting to close alert ' + index);

        hub.requestCloseAlert(allOpenAlerts[index].AlertId);
    };

    var proceedToCloseAlert = function (alertId) {
        var index = findOpenAlertIndex(alertId);

        if (index > -1) {
            if (!allOpenAlerts[index].ClosedTimestamp) {
                // Need to manually fill in the closed timestamp (this might be slightly out of sync with the value in the DB but not a big deal. Best to save a DB query and network call)
                allOpenAlerts[index].ClosedTimestamp = Date.now();
            }

            // use unshift to push at the front of the index
            alertsClosedToday.unshift(angular.copy(allOpenAlerts[index]));

            // Remove the alert from the list of open alerts
            allOpenAlerts.splice(index, 1);

            $rootScope.$apply();
        }
    };

    var closeAllOpenAlerts = function () {
        console.log('Requesting to close all open alerts');

        hub.requestCloseAllOpenAlerts();
    };

    // Crosses
    var requestSaveContract = function (crossObject) {
        console.log('Requesting save cross ' + crossObject.Cross);

        hub.requestSaveContract(crossObject.Cross, crossObject.DBLoggerName);
    };

    var validateLoggerForCross = function (crossObject, newLoggerName) {
        if (newLoggerName === 'Unassigned') {
            crossObject.DBLoggerName = null;
        }
    };

    var saveCrossEdits = function (cross) {
        console.log('Saving edits for cross ' + cross.Cross);

        if (cross.DBLoggerName !== cross.originalDBLoggerName) {
            requestSaveContract(cross);
        }
    };

    // IB Broker Client Configs
    var requestIBBrokerClientConfigs = function () {
        hub.requestIBBrokerClientConfigs();
    };

    var requestInsertIBBrokerClientConfig = function (config) {
        hub.requestInsertIBBrokerClientConfig(config);
    };

    var requestSaveIBBrokerClientConfig = function (config) {
        hub.requestSaveIBBrokerClientConfig(config);
    };

    var requestDeleteIBBrokerClientConfig = function (id) {
        hub.requestDeleteIBBrokerClientConfig(id);
    };

    var findIbBrokerClientConfigIndex = function (id) {
        for (var i = 0; i < ibBrokerClientConfigs.length; i++) {
            if (ibBrokerClientConfigs[i].Id.Name === id.Name && ibBrokerClientConfigs[i].Id.Version === id.Version) {
                return i;
            }
        }

        return -1;
    };

    // Positions
    var requestLatestPositions = function () {
        console.log('Requesting latest positions');

        hub.requestLatestPositions();
    };

    var findPositionIndex = function (broker, accountName) {
        for (var i = 0; i < latestPositions.length; i++) {
            if (latestPositions[i].Broker === broker && latestPositions[i].AccountName === accountName) {
                return i;
            }
        }

        return -1;
    };

    var findPositionSecurityIndex = function (position, cross) {
        for (var i = 0; i < position.PositionSecurities.length; i++) {
            if (position.PositionSecurities[i].Cross === cross) {
                return i;
            }
        }

        return -1;
    };

    hub.promise.done(function () {
        console.log('monitoringAppHub is now ready');

        // Alerts
        requestAllOpenAlerts();
        requestAlertsClosedToday();

        // Broker Client Configs
        requestIBBrokerClientConfigs();

        // Positions
        requestLatestPositions();
    });

    return {

        // Accounts
        requestAccount: requestAccount,

        // Alerts
        getAllOpenAlerts: function () {
            return allOpenAlerts;
        },
        getAlertsClosedToday: function () {
            return alertsClosedToday;
        },
        closeAlert: closeAlert,
        closeAllOpenAlerts: closeAllOpenAlerts,

        // Crosses
        validateLoggerForCross: validateLoggerForCross,
        saveCrossEdits: saveCrossEdits,

        // IB Broker Client Configs
        findIbBrokerClientConfigIndex: findIbBrokerClientConfigIndex,
        getIBBrokerClientConfigs: function () {
            return ibBrokerClientConfigs;
        },
        requestIBBrokerClientConfigs: requestIBBrokerClientConfigs,
        requestInsertIBBrokerClientConfig: requestInsertIBBrokerClientConfig,
        requestSaveIBBrokerClientConfig: requestSaveIBBrokerClientConfig,
        requestDeleteIBBrokerClientConfig: requestDeleteIBBrokerClientConfig,

        // Positions
        getLatestPositions: function () {
            return latestPositions;
        }

    };
}]);