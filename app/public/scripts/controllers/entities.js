'use strict';

angular.module('publicApp')
    .controller('EntitiesCtrl', function($scope, entity, $q) {
    // $scope.awesomeThings = entity.getUsersTimeLine('day');
    // $scope.dataTimeline = entity.getUsersTimeLine('day', [{
    //     dimension: 'nerdType',
    //     operator: '=',
    //     value: 'http://nerd.eurecom.fr/ontology#Location'
    // }, {
    //     dimension: 'confidence',
    //     operator: '>',
    //     value: '1'

    // }]);

    entity.getUsersGroupBy('nerdType', []).then(function(res) {
        res.splice(11, res.length - 11, (function() {
            var others = ['Others', 0];

            res.forEach(function(el, index) {
                if (index > 0) {
                    el[0] = el[0].split('#')[1]
                }
                if (index > 9) {
                    others[1] += el[1];
                }
            });
            return others;
        }()));

        $scope.UsersGroupByNerdType = res;
    });

    entity.getUsersGroupBy('nerdType', [{
        dimension: 'extractor',
        operator: '=',
        value: 'wikimeta'
    }]).then(function(res) {
        res.splice(11, res.length - 11, (function() {
            var others = ['Others', 0];

            res.forEach(function(el, index) {
                if (index > 0) {
                    el[0] = el[0].split('#')[1]
                }
                if (index > 9) {
                    others[1] += el[1];
                }
            });
            return others;
        }()));

        $scope.UsersGroupByNerdType = res;
    });


    entity.getUsersGroupBy('nerdType', [{
        dimension: 'extractor',
        operator: '=',
        value: 'yahoo'
    }]).then(function(res) {
        res.splice(11, res.length - 11, (function() {
            var others = ['Others', 0];

            res.forEach(function(el, index) {
                if (index > 0) {
                    el[0] = el[0].split('#')[1]
                }
                if (index > 9) {
                    others[1] += el[1];
                }
            });
            return others;
        }()));

        $scope.UsersGroupByNerdTypeYahoo = res;
    });


    entity.getUsersGroupBy('nerdType', [{
        dimension: 'extractor',
        operator: '=',
        value: 'alchemyapi'
    }]).then(function(res) {
        res.splice(11, res.length - 11, (function() {
            var others = ['Others', 0];

            res.forEach(function(el, index) {
                if (index > 0) {
                    el[0] = el[0].split('#')[1]
                }
                if (index > 9) {
                    others[1] += el[1];
                }
            });
            return others;
        }()));

        $scope.UsersGroupByNerdTypeAlchemy = res;
    });



    entity.getUsersGroupBy('nerdType', [{
        dimension: 'extractor',
        operator: '=',
        value: 'wikimeta'
    }]).then(function(res) {
        res.splice(11, res.length - 11, (function() {
            var others = ['Others', 0];

            res.forEach(function(el, index) {
                if (index > 0) {
                    el[0] = el[0].split('#')[1]
                }
                if (index > 9) {
                    others[1] += el[1];
                }
            });
            return others;
        }()));

        $scope.UsersGroupByNerdTypeWikimeta = res;
    });

    $scope.dataFiltered = {
        dataset: [
            []
        ],
        data: [],
        visualization: 'day',
        updateLines: function(newDataset) {
            var fail = false;
            var lines = [];
            var linesPromises = [];
            var that = this;
            var fetchLinesPromise;
            this.dataset = newDataset;

            newDataset.forEach(function(el, index) {
                linesPromises[index] = entity.getUsersTimeLine(that.visualization, el).then(function(res) {
                    lines[index] = res;
                });
            });
            fetchLinesPromise = $q.all(linesPromises);
            fetchLinesPromise.then(function() {
                that.data = mergeLinesInArrayTable(lines);
            });
        },
        changeVisualization: function(visualization) {
            this.visualization = visualization;
            this.updateLines(this.dataset);
        }
    };

    function mergeLinesInArrayTable(lines) {
        var max = lines[0].max('title'),
            min = lines[0].min('title'),
            data = [],
            inserted,
            newPoint, group, groupOfLine;
        lines.forEach(function(line) {
            var maxOfLine = line.max('title'),
                minOfLine = line.min('title');

            if (maxOfLine > max) {
                max = maxOfLine;
            }
            if (minOfLine < min) {
                min = minOfLine;
            }
        });

        var titles = [];

        lines.forEach(function(el) {
            titles = titles.concat(el.map(function(e) {
                return e.title;
            }));
        });
        titles = titles.unique();
        titles.sort();
        titles.forEach(function(title, index) {
            group = {
                title: title,
                array: []
            };
            inserted = false;
            for (var j = 0; j < lines.length; j++) {
                groupOfLine = lines[j].getByProperty('title', title);
                if (groupOfLine) {
                    groupOfLine.array.forEach(function(point) {
                        newPoint = new Array(lines.length + 1);
                        newPoint.forEach(function(el) {
                            el = undefined;
                        });
                        newPoint[0] = point[0];
                        newPoint[j + 1] = point[1];
                        group.array.push(newPoint);
                        inserted = true;
                    });
                }

            }
            if (inserted) data.push(group);
        });
        return data;
    }

    $scope.dataFiltered.updateLines($scope.dataFiltered.dataset);
});