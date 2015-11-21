document.addEventListener("deviceready", onDeviceReady, false);
var filesystem = null;
var pathContext = "proyecto/";
var folderName = "proyecto";

function onDeviceReady() {
    window.requestFileSystem = window.requestFileSystem
        || window.webkitRequestFileSystem;
    // Start the app by requesting a FileSystem (if the browser supports the API)
    if (window.requestFileSystem) {
        initFileSystem();

        window.requestFileSystem(LocalFileSystem.PERSISTENT,
            0, onFileSystemSuccess, fail);
    }

}

function initFileSystem() {
    // Request a file system with the new size.
    window.requestFileSystem(window.PERSISTENT, 1024, function (fs) {
        filesystem = fs;
    }, errorHandler);
}
function onFileSystemSuccess(filesystem) {
    // In here, we put where the folder is. If it is found, then it
    // continues to getDirSuccess
    filesystem.root.getDirectory(folderName,
        {
            create: false, exclusive: false
        },
        getDirSuccess,
        fail);
}

function getDirSuccess(dirEntry) {
    var directoryReader = dirEntry.createReader();
    directoryReader.readEntries(readerSuccess, fail);
}

var divsTotales;
function readerSuccess(entries) {
    var i;

    var listado = "";
    var popUps = "";
    divsTotales = entries.length;

    for (i = 0; i < entries.length; i++) {
        listado += "<li data-icon='gear'><a href='#opciones" + i +
            "' data-rel='popup' data-position-to='window' " +
            "data-transition='pop'>" + entries[i].name +
            "</a></li>";
        var options = "opciones" + i;
        var deleteOperation = "delop" + i;
        var editOperation = "editop" + i;
        popUps += "<div data-role='popup' id='" + options + "' data-theme='a' data-overlay-theme='b' " +
            "class='ui-content' style='max-width:340px; padding-bottom:2em;'> " +
            "<h3>Escoja la operacion</h3>" +
            "<input id='" + deleteOperation + "' type='button' data-icon='delete' " +
            "value='eliminar' />" +
            "<input id='" + editOperation + "' type='button' data-icon='edit' " +
            "value='modificar' /></div>";


    }

    actualizarLista(listado);
    crearPopUps(popUps);

    for (var counter = 0; counter < entries.length; counter++) {
        (function (counter) {
            //It is added the delete operation as 'onclick' in each link
            document.getElementById('delop' + counter).
            addEventListener("click", function () {
                deleteFile(entries[counter].name);
            });
        }(counter));

    }
    //k is another counter
    for (var k = 0; k < entries.length; k++) {
        (function (k) {
            //It is added the the function that will set the info from the read file, in the view
            document.getElementById('editop' + k).
            addEventListener("click", function () {
                setInfoFromFile(entries[k].name);
            });
        }(k));

    }
}

var listcreated = false;
function actualizarLista(datos) {
    if (!listcreated) {
        var divList = $("#divList");
        divList.append("<ul id='lista' data-role='listview' data-inset='true' data-filter='true' " +
            "data-filter-placeholder='buscar..'></ul>");
        listCreated = true;
        divList.trigger("create");
    }
    var list = $("#lista");
    list.append(datos);
    list.listview("refresh");
}

function crearPopUps(popups) {
    var divPopups = $('#popups');
    divPopups.append(popups);
    divPopups.trigger("create");
}

function readFile(filename) {
    var content = null;
    var path = pathContext + filename;
    filesystem.root.getFile(path, {}, function (fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                content = String(this.result);
                document.getElementById("nombre_archivo_modificar").value = filename;
                document.getElementById("contenido_archivo_modificar").innerHTML = content;
            };
            reader.readAsText(file);
        }, errorHandler);

    }, errorHandler);
}
function setInfoFromFile(filename) {
    readFile(filename);
    window.location = "#modificar";
}

function saveEditedFile() {
    var filename = document.getElementById("nombre_archivo_modificar").value;
    var content = document.getElementById("contenido_archivo_modificar").value;
    var path = pathContext + filename;

    //alert(path);
    filesystem.root.getFile(
        path,
        {
            create: false
        },
        function (fileEntry) {
            // Create a FileWriter object for our FileEntry
            // (with the given name of the file).
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.seek(0); //Start write position at the beginning of the file
                var fileParts = [content];
                var contentBlob = new Blob(fileParts, {
                    type: 'text/html'
                });
                fileWriter.write(contentBlob);

            }, errorHandler);

        }, errorHandler);
    alert("Archivo Modificado");
}

function saveFile() {
    var filename = document.getElementById("nombre_archivo_alta").value;
    var content = document.getElementById("contenido_archivo_alta").value;
    var path = pathContext + filename + ".txt";

    filesystem.root.getFile(path, {create: true}, function (fileEntry) {

        fileEntry.createWriter(function (fileWriter) {
            var fileParts = [content];
            var contentBlob = new Blob(fileParts, {type: 'text/html'});
            fileWriter.write(contentBlob);

            fileWriter.onwriteend = function (e) {
                alert("Archivo Guardado");
                window.location.href = "index.html";
            };

            fileWriter.onerror = function (e) {
                console.log('Write error: ' + e.toString());
                alert('An error occurred and your file could not be saved!');
            };

        }, errorHandler);

    }, errorHandler);

}

function cancelar() {
    window.location.href = "index.html";
}
function deleteFile(filename) {
    var proceed = confirm("Seguro desea eliminar este archivo: " + filename);
    if (!proceed) return;

    var path = pathContext + filename;
    filesystem.root.getFile(path,
        {
            create: false
        },
        function (fileEntry) {
            fileEntry.remove(function () {
                alert("Archivo " + filename + " Eliminado");
                window.location.href = "index.html";
            }, errorHandler);

        }, errorHandler);
}

function fail() {
    alert("No Soportan Archivos");
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
