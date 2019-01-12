var myApp = angular.module('myApp',['diff-match-patch']);
myApp.controller('myController', function ($scope, $http, $q, $filter) {   

    $scope.options = {
        editCost: 4,
        interLineDiff: true,
        ignoreTrailingNewLines: true,
        attrs: {
          insert: {
            'data-attr': 'insert',
            'class': 'insertion'
          },
          delete: {
            'data-attr': 'delete'
          },
          equal: {
            'data-attr': 'equal'
          }
        }
      };
    
    $scope.files = ['7.1.8280', '8.0.2298', '8.1.5811.0', '8.5.3025.0'];
    $scope.selectedFileLHS = '';
    $scope.selectedFileRHS = '';

    $scope.selectedWebServiceLHS = {};
    $scope.selectedWebServiceRHS = {};
    $scope.chosenWebService = {};
    $scope.chosenWebServiceMethod = {};

    $scope.original = {};
    $scope.changed = {};

    $scope.data = {};
    $scope.allData = {};
    $scope.webservices = [];
    $scope.methods = [];
    $scope.methodParams = [];

    $scope.init = function () {
        getData();
    }

    $scope.loadFile = (side) => {
        var file = '';
        if (side === 'LHS') {
            file = `data/${$scope.selectedFileLHS}.json`;
        } else {
            file = `data/${$scope.selectedFileRHS}.json`;
        }
        
        $http.get(file)
        .then(function(response) {
            if (side === 'LHS') {
                $scope.webservicesLHS = response.data.webservices;
            } else {
                $scope.webservicesRHS = response.data.webservices;
            }
        });

    };

    $scope.loadMethods = (side) => {
        if (side === 'LHS') {
            if ($scope.selectedWebServiceLHS) {
                $scope.original = $scope.selectedWebServiceLHS.methods.map(m => m.name).join('\n');
            }
        } else {
            if ($scope.selectedWebServiceRHS) {
                $scope.changed = $scope.selectedWebServiceRHS.methods.map(m => m.name).join('\n');
            }
        }
        //createPivot();
    };

    $scope.loadChosenMethods = () => {
        var methods = [];
        angular.forEach($scope.allData, function(value, key) {
            if (value.webservice == $scope.chosenWebService) {
                methods.push(value);
            }
        });

        //$scope.methods = methods.filter((v, i, a) => a.indexOf(v) === i);
        $scope.methods = [...new Set(methods.map(s => s.method))];
    };

    $scope.loadChosenParams = () => {
        var methodParams = [];
        angular.forEach($scope.allData, function(value, key) {
            if (value.method == $scope.chosenWebServiceMethod && value.webservice == $scope.chosenWebService) {
                methodParams.push(value);
            }
        });
        $scope.methodParams = methodParams;
    };

    createPivot = () => {
        if ($scope.webservicesLHS && $scope.webservicesRHS) {
            var methodsLHS = $scope.selectedWebServiceLHS.methods.map(m => m.name);
            var dataLHS = methodsLHS.map(m => ({method: m, version: $scope.selectedFileLHS}));
            var methodsRHS = $scope.selectedWebServiceRHS.methods.map(m => m.name);
            var dataRHS = methodsRHS.map(m => ({method: m, version: $scope.selectedFileRHS}));
            var data = dataLHS.concat(dataRHS);
            
            $("#output").pivot(
                data,
                {
                    rows: ["method"],
                    cols: ["version"]
                }
            );
        }
    };

    getData = () => {
        var files = [];
        angular.forEach($scope.files, function(value, key) {
            var file = `data/${value}.json`;
            files.push(file);
        });
        
        var promises = [];
        angular.forEach(files, function(value, key) {
            var promise = $http.get(value);
             promises.push(promise);
        });

        var data = {};
        var x = [];
        $q.all(promises).then(function(response) {
            var result = response.map(r => r.data);
            angular.forEach(result, function(version, key) {
                angular.forEach(version.webservices, function(value, key) {
                    //var methods = value.methods.map(m => m.name);
                    var methods = value.methods.map(m => ({name: m.name, params: m.parameters }));
                    var wsData = methods.map(m => ({webservice:value.name, version: version.version, method: m.name, params: m.params}));
                    x.push(wsData);
                });
                const values = Object.keys(data).map(it => data[it]);
                angular.extend(data, values);
            });

            var merged = [].concat.apply([], x);
            $scope.webservices = [...new Set(merged.map(a => a.webservice))].sort();
            $scope.allData = merged;
        });
    }

    $scope.createPivotAll = () => {
        // var filteredData = $scope.allData;
        var filteredData = $filter('filter')($scope.allData, { webservice: $scope.selectedWebService });
        var mapped = filteredData.map(m => ({webservice:m.webservice, version: m.version, method: m.method}));
        
        if ($scope.ui) {
            $("#output").pivotUI(
                mapped,
                {
                    rows: ["method"],
                    cols: ["version"]
                }
            );
        } else {
            $("#output").pivot(
                mapped,
                {
                    rows: ["method"],
                    cols: ["version"]
                }
            );
        }
    }
    $scope.init();
});