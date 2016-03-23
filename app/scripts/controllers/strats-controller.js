'use strict';

angular.module('monitorApp')
  .controller('StratsCtrl', ['$rootScope', '$uibModal', 'StratService', function ($rootScope, $uibModal, StratService) {

      var self = this;

      self.strats = StratService.query();

      self.add = function () {
          console.log('Add new strat');

          var modalInstance = $uibModal.open({
              templateUrl: 'views/strats-add.html',
              controller: 'StratsAddCtrl as stratsAddCtrl',
              size: 'lg',
              resolve: {
                  stratNames: function () {
                      return self.strats.map(function (strat) {
                          return strat.Name;
                      });
                  },
                  stratDllPaths: function () {
                      return self.strats.map(function (strat) {
                          return strat.DllPath;
                      });
                  },
                  stratTypeNames: function () {
                      return self.strats.map(function (strat) {
                          return strat.StratTypeName;
                      });
                  },
              }
          });

          modalInstance.result.then(function (newStrat) {
              newStrat.$save({ name: null, version: null }, function (result) {
                  console.log(result.status);

                  var strat = new StratService();
                  strat.Name = result.strat.Name;
                  strat.Version = result.strat.Version;
                  strat.DllPath = result.strat.DllPath;
                  strat.StratTypeName = result.strat.StratTypeName;

                  self.strats.push(strat);
              });
          });
      };

      self.edit = function (name, version) {
          console.log('Edit', name, version);

          var index = getStratIndex(name, version);

          var modalInstance = $uibModal.open({
              templateUrl: 'views/strats-edit.html',
              controller: 'StratsEditCtrl as stratsEditCtrl',
              size: 'lg',
              resolve: {
                  strat: function () {
                      return angular.copy(self.strats[index]);
                  }
              }
          });

          modalInstance.result.then(function (updatedStrat) {
              updatedStrat.$update(function (result) {
                  console.log(result.status);

                  var strat = new StratService();
                  strat.Name = result.strat.Name;
                  strat.Version = result.strat.Version;
                  strat.DllPath = result.strat.DllPath;
                  strat.StratTypeName = result.strat.StratTypeName;
                  
                  self.strats[index] = strat;
              });
          });
      };

      self.delete = function (name, version) {
          console.log('Delete', name, version);

          var index = getStratIndex(name, version);

          var modalInstance = $uibModal.open({
              templateUrl: 'views/strats-delete.html',
              controller: 'StratsDeleteCtrl as stratsDeleteCtrl',
              resolve: {
                  strat: function () {
                      return self.strats[index];
                  }
              }
          });

          modalInstance.result.then(function (stratToDelete) {
              stratToDelete.$delete(function (result) {
                  console.log(result.status);

                  self.strats.splice(index, 1);
              });
          });
      };

      function getStratIndex(name, version) {
          for (var i = 0; i < self.strats.length; i++) {
              if (self.strats[i].Name === name && self.strats[i].Version === version) {
                  return i;
              }
          }

          return -1;
      }

      // Event listeners

      $rootScope.$on('stratDeletedEvent', function (event, args) {
          var index = getStratIndex(args.name, args.version);

          if (index > -1) {
              console.log('Removing strat', args.name, args.version, 'from the list');

              self.strats.splice(index, 1);
          } else {
              console.error('Received deleted notification for unknown strat', args.name, args.version);
          }
      });

      $rootScope.$on('stratInsertedEvent', function (event, strat) {
          console.log('Adding new strat', strat.Name, strat.Version);

          self.strats.push(strat);
      });

      $rootScope.$on('stratUpdatedEvent', function (event, strat) {
          var index = getStratIndex(strat.Name, strat.Version);

          if (index > -1) {
              console.log('Updating strat', strat.Name, strat.Version);

              self.strats[index] = strat;
          } else {
              console.error('Received updated notification for unknown strat', strat.Name, strat.Version);
          }
      });

  }]);
