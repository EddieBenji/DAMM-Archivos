
document.addEventListener("deviceready", deviceReady, false);
var filesystem = null;
var messageBox;

function deviceReady() {

    // Allow for vendor prefixes.
    window.requestFileSystem = window.requestFileSystem ||
            window.webkitRequestFileSystem;
    messageBox = document.getElementById('messages');



// Start the app by requesting a FileSystem (if the browser supports the API)
    if (window.requestFileSystem) {
        initFileSystem();
        alert("Si se pueden escribir archivos.");
    } else {
        alert("Sorry! Your browser doesn\'t support the FileSystem API :(");
    }
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

function pruebaArchivos()
{
    if (window.requestFileSystem) {
        alert("Los archivos si son soportados");
    } else {
        alert("No se soportan el manejo de archivos :(");
    }

}

function initFileSystem() {
    // Request a file system with the new size.
    window.requestFileSystem(window.PERSISTENT, 1024, function (fs) {
        filesystem = fs;
    }, errorHandler);
}


function saveFile(filename, content) {
    filesystem.root.getFile(filename, {create: true}, function (fileEntry) {

        fileEntry.createWriter(function (fileWriter) {
            var fileParts = [content];
            var contentBlob = new Blob(fileParts, {type: 'text/html'});
            fileWriter.write(contentBlob);

            fileWriter.onwriteend = function (e) {
                // messageBox.innerHTML = 'File saved!';
                alert("Archivo Guardado");
                document.getElementById("nombre_archivo").value = "";
                document.getElementById("contenido_archivo").value = "";
                window.location = "index.html";
            };

            fileWriter.onerror = function (e) {
                console.log('Write error: ' + e.toString());
                alert('An error occurred and your file could not be saved!');
            };

        }, errorHandler);

    }, errorHandler);
}

function cancelar() {
    document.getElementById("nombre_archivo").innerHTML = "";
    document.getElementById("contenido_archivo").innerHTML = "";
    window.location = "index.html";
}

function escribeArchivo() {
    var nombreArchivo = document.getElementById("nombre_archivo").value;
    nombreArchivo = nombreArchivo + ".txt";

    var contenidoArchivo = document.getElementById("contenido_archivo").value;

    saveFile(nombreArchivo, contenidoArchivo);
}
;