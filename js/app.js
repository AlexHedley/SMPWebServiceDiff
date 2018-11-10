var myApp = angular.module('myApp',['diff-match-patch']);
myApp.controller('myController', function ($scope, $http) {   

    createPivot = () => {
        if ($scope.webservicesLHS && $scope.webservicesRHS) {
            var methodsLHS = $scope.selectedWebServiceLHS.methods.map(m => m.name); //$scope.original
            var dataLHS = methodsLHS.map(m => ({method: m, version: $scope.selectedFileLHS}));
            var methodsRHS = $scope.selectedWebServiceRHS.methods.map(m => m.name); //$scope.changed
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

    //$scope.files = ['7.0', '7.1', '7.5', '7.6', '8.0', '8.1', '8.5'];
    $scope.files = ['7.0', '7.1', '8.1.5811.0', '8.5.3025.0'];
    $scope.selectedFileLHS = '';
    $scope.selectedFileRHS = '';

    $scope.selectedWebServiceLHS = {};
    $scope.selectedWebServiceRHS = {};

    $scope.original = {};
    $scope.changed = {};

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
            $scope.original = $scope.selectedWebServiceLHS.methods.map(m => m.name).join('\n');
        } else {
            $scope.changed = $scope.selectedWebServiceRHS.methods.map(m => m.name).join('\n');
        }

        createPivot();
    };
});

// $(".diff-wrapper").prettyTextDiff({
//     originalContent: $('#original').val(),
//     changedContent: $('#changed').val(),
//     diffContainer: ".diff1"
// });

// $(function(){
//     $("#output").pivot(
//         [
//             {method: "EnableBulletin", version: "7.0"},
//             {method: "DisableBulletins", version: "7.1"},
//             {method: "EnableBulletin", version: "7.1"}
//         ],
//         {
//             rows: ["method"],
//             cols: ["version"]
//         }
//     );
//  });

 // Or https://github.com/nicolaskruchten/pivottable/issues/208