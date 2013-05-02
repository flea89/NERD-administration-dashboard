'use strict';

angular.module('publicApp')
    .directive('modal', function($compile) {
    return {
        scope: {
            idModal: '@',
            changeDataSet: '&',
            dataset: '='
        },
        template: ['<div id="{{idModal}}" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
            '<div class="modal-header">',
            '<button type="button" class="close" aria-hidden="true" ng-click="addline()" style="opacity:0.5; float:left">+</button>',
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
            '<h3 id="myModalLabel">Settings</h3>',
            '</div>',
            '<div class="modal-body">',
            '<div ng-repeat="line in lines">',
            '<h4>Line {{$index+1}}<a href="" class="modal-remove-line" ng-click="removeline($index)">x</a></h4>',
            '<p><a href="" ng-click="addFilter($index)">Add Filter</a><p>',
            '<ul class="filterList{{$index}}">',

            '<li ng-repeat="filter in line">Dimension:',
            '<select ng-model="line[$index].dimension" ng-options="filter for filter in filtersList">',
            '<option value="">-- dimension --</option>',
            '</select>',
            '<span><select ng-model="line[$index].operator" ng-options="operator for operator in operators" class="operator"><span>',
            '<option value="">-- operator --</option>',
            '</select>',
            '<input type="text" ng-model="line[$index].value"/>',
            '<a href="" class="modal-remove-line" ng-click="removeFilter($parent.$index,$index)">x</a></li>',
            '</ul></div>',
            '</div><div class="modal-footer">',
            '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>',
            '<button class="btn btn-primary" ng-click=save()>Save changes</button>',
            '</div>',
            '</div>'].join('\n'),
        restrict: 'EA',
        link: function postLink(scope, element, attrs) {
            var dataSet;

            scope.filtersList = ['country', 'language'];
            scope.selectedFilter = 'language';
            scope.operators = ['=', '>', '<'];
            scope.lines = angular.copy(scope.dataset);

            scope.save = function() {
                dataSet = angular.copy(scope.lines);
                scope.changeDataSet({
                    newDataset: dataSet
                });
                $('#' + scope.idModal).modal('hide');
            };

            scope.addline = function() {
                scope.lines.push([{
                    dimension: undefined,
                    operator: undefined,
                    value: undefined
                }]);
            };
            scope.reportLines = function() {
                console.log(scope.lines);

            };
            scope.addFilter = function(lineNumber) {
                scope.lines[lineNumber].push({
                    dimension: undefined,
                    operator: '=',
                    value: undefined
                });
            };

            scope.removeline = function(index) {
                scope.lines.splice(index, 1);
            };

            scope.removeFilter = function(line, index) {

                scope.lines[line].splice(index, 1);
            };
        }
    };
});