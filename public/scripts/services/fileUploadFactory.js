angular.module('parseApp')
    .factory('fileUploadFactory', function ($q) {
        // Service logic

        var fileLists = [];

        var uploadFiles = function (files,parseClass,fieldName,data) {
            var defer = $q.defer();
            var Upload = Parse.Object.extend(parseClass);
            var  upload = new Upload();
            var file_count = 1;
            files.forEach(function (file) {

                console.log("file name : "+file.name)
                var name =file.name;

                var parseFile = new Parse.File(name, file);
                var file_name = 'r_c_'+file_count;
                parseFile.save().then(function() {
                    // The file has been saved to Parse.




                }, function(error) {
                    // The file either could not be read, or could not be saved to Parse.
                    defer.reject(JSON.parse(JSON.stringify(error)))
                });
                upload.set(file_name,parseFile)
                file_count++;
           });





             for(d in data){
                 upload.set(d,data[d]);
             }

            upload.save(null, {
                success: function(result) {
                    // Execute any logic that should take place after the object is saved.
                    var added = JSON.parse(JSON.stringify(result));

                    defer.resolve(added);
                },
                error: function(category, error) {

                    defer.reject(error.message);
                }
            });



            return defer.promise;

        }





        // Public API here
        return {
            uploadFiles:uploadFiles
        };


    });
