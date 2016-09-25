'use strict';

angular.module('monitorApp')
.factory('CommonsService', [function () {

    function formatRate(cross, rate) {
        if (!rate) {
            return null;
        } else if (cross.indexOf('JPY') > -1) {
            return rate.toFixed(3);
        } else {
            return rate.toFixed(5);
        }
    }

    function shortenCross(cross) {
        return cross.replace('USD', '').replace('/', '');
    }

    function shortenOrigin(origin) {
        if (origin === 'PositionOpen') {
            return 'PO';
        } else if (origin === 'PositionClose') {
            return 'PC';
        } else if (origin === 'PositionClose_ContStop') {
            return 'PCS';
        } else if (origin === 'PositionClose_ContLimit') {
            return 'PCL';
        } else if (origin === 'PositionClose_TE') {
            return 'PCT';
        } else if (origin === 'PositionClose_CircuitBreaker') {
            return 'PCB';
        } else if (origin === 'PositionReverse_Close') {
            return 'PRC';
        } else if (origin === 'PositionReverse_Open') {
            return 'PRO';
        } else if (origin === 'PositionDouble') {
            return 'PD';
        } else {
            return origin;
        }
    }

    function shortenSide(side) {
        return side.substring(0, 1);
    }

    return {
        formatRate: formatRate,
        shortenCross: shortenCross,
        shortenOrigin: shortenOrigin,
        shortenSide: shortenSide
    };

}]);
