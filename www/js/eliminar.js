document.addEventListener("deviceready", deviceReady, false);
var filesystem = null;
var messageBox;

function deviceReady() {
    // Allow for vendor prefixes.
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;


    // Start the app by requesting a FileSystem (if the browser supports the API)
    if (window.requestFileSystem) {
        initFileSystem();
    }
}

function initFileSystem() {
    // Request a file system with the new size.
    window.requestFileSystem(window.PERSISTENT, 1024, function (fs) {
        filesystem = fs;
    }, errorHandler);
}

// A simple error handler to be used throughout this demo.
function errorHandler(error) {
    var message = '';
    switch (error.code) {
        case FileError.SECURITY_ERR:
            message = 'Security Error';
            break;
        case FileError.NOT_FOUND_ERR:
            message = 'Not Found Error';
            break;
        case FileError.QUOTA_EXCEEDED_ERR:
            message = 'Quota Exceeded Error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            message = 'Invalid Modification Error';
            break;
        case FileError.INVALID_STATE_ERR:
            message = 'Invalid State Error';
            break;
        default:
            message = 'Unknown Error UAY';
            break;
    }
    alert(message);
}


function deleteFile(filename) {
   // var filename = 'yyy.txt';
    var direccionArchivo = "proyecto/" + filename;
    alert("Se borrara el archivo: proyecto/" + filename);
    filesystem.root.getFile(direccionArchivo, {create: false}, function (fileEntry) {
        fileEntry.remove(function () {
            alert("Archivo " + filename + " Eliminado");
        }, errorHandler);

    }, errorHandler);

}
function cancelar() {
    window.location.href = "index.html";

}