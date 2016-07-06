'use strict';

angular.module('monitorApp')
.directive('executionsPnlChart', [function () {
    return {
        template: '<div></div>',
        restrict: 'A',
        scope: {
            height: '@',
            width: '@'
        },
        link: function postLink(scope, element) {

            function createChart(elemId, data) {
                AmCharts.makeChart(elemId, {
                    type: 'serial',
                    addClassNames: true,
                    balloonDateFormat: 'JJ:NN',
                    theme: 'light',
                    autoMargins: false,
                    marginLeft: 30,
                    marginRight: 8,
                    marginTop: 10,
                    marginBottom: 26,
                    balloon: {
                        adjustBorderColor: false,
                        horizontalPadding: 10,
                        verticalPadding: 8,
                        color: '#ffffff'
                    },
                    dataProvider: data,
                    valueAxes: [{
                        id: 'pnlAxis',
                        axisAlpha: 0,
                        title: 'PnL (USD)',
                        inside: true
                    }],
                    graphs: [{
                        id: 'graph1',
                        balloonText: '<span style=\'font-size:12px;\'>[[title]] at [[category]]:<br><span style=\'font-size:20px;\'>[[value]] USD</span></span>',
                        bullet: 'round',
                        lineThickness: 3,
                        bulletSize: 7,
                        bulletBorderAlpha: 1,
                        bulletColor: '#FFFFFF',
                        useLineColorForBulletBorder: true,
                        bulletBorderThickness: 3,
                        fillAlphas: 0,
                        lineAlpha: 1,
                        title: 'PnL',
                        valueAxis: 'pnlAxis',
                        valueField: 'netPnl',
                        lineColor: '#00B200',
                        negativeLineColor: '#FF0000',
                    }],
                    categoryField: 'time',
                    categoryAxis: {
                        gridPosition: 'start',
                        axisAlpha: 0,
                        tickLength: 0,
                        parseDates: true,
                        minPeriod: 'mm',
                    },
                    precision: 0,
                    usePrefixes: true
                });
            }

            var id = 'pnl-chart-div';

            element.attr('id', id);

            // set height and width
            var height = scope.height || '100%';
            var width = scope.width || '100%';

            element.css({
                'height': height,
                'width': width
            });

            // Event Handlers
            scope.$on('executionsPnlChart.refresh', function (event, data) {
                if (data.netPnlByTime) {
                    console.log('Received event', event.name);
                    createChart(id, data.netPnlByTime);
                }
            });
        }
    };
}]);
