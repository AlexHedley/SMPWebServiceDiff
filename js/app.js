var myApp = angular.module('myApp',['diff-match-patch']);
myApp.controller('myController', function ($scope, $http) {   

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

    $scope.files = ['7.0', '7.1', '7.5', '7.6', '8.0', '8.1', '8.5'];
    $scope.selectedFileLHS = '';
    $scope.selectedFileRHS = '';

    $scope.selectedWebServiceLHS = {};
    $scope.selectedWebServiceRHS = {};

    $scope.original = {};
    $scope.changed = {};

    $scope.loadFile = (side) => {
        console.log('loadFile');
        console.log($scope.selectedFileLHS);

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
            $scope.original = $scope.selectedWebServiceLHS.methods.map(m => m.name).join('\n');
        } else {
            $scope.changed = $scope.selectedWebServiceRHS.methods.map(m => m.name).join('\n');
        }
    };
});

// $(".diff-wrapper").prettyTextDiff({
//     originalContent: $('#original').val(),
//     changedContent: $('#changed').val(),
//     diffContainer: ".diff1"
// });