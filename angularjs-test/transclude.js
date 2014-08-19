/**
 * Created by gc on 2014/8/19.
 */
var appModule = angular.module('app', []);

appModule.directive('hello', function() {
    return {
        restrict: 'EA',
        template: '<div>Hi there <span ng-transclude></span></div>',
        transclude: true,
        replace:true,
        scope:{
            options:'@'
        },
        link: function (scope, element, attrs) {
            alert(scope.options);
        }
    };
});