document.addEventListener("deviceready", onDeviceReady, false);
var filesystem = null;

function onDeviceReady() {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    // Start the app by requesting a FileSystem (if the browser supports the API)
    if (window.requestFileSystem) {
        initFileSystem();
    }
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);

}

function initFileSystem() {
    // Request a file system with the new size.
    window.requestFileSystem(window.PERSISTENT, 1024, function (fs) {
        filesystem = fs;
    }, errorHandler);
}
function onFileSystemSuccess(filesystem) {
    // aquí se señala en qué carpeta buscas, si la encuentra, sigue
    filesystem.root.getDirectory("proyecto", {create: false, exclusive: false}, getDirSuccess, fail);
}

function getDirSuccess(dirEntry) {
    var directoryReader = dirEntry.createReader();

    // lista todo en el directorio
    directoryReader.readEntries(readerSuccess, fail);
}

var divsTotales;
function readerSuccess(entries) {
    var i;
    divsTotales = entries.length;
    var fragment = document.createDocumentFragment();
    var lista = document.getElementById("archivos");
    var tabla = document.getElementById("tableList");
    for (i = 0; i < entries.length; i++) {
        var name_link = "<h4>" + entries[i].name + "</h4>";
        //alert("i es: " + i);
        var inputBtnDel = document.createElement('input');
        inputBtnDel.setAttribute("type", "button");
        inputBtnDel.setAttribute("id", "btnDel" + i);
        inputBtnDel.setAttribute("value", "delete");

        var inputBtnModif = document.createElement('input');
        inputBtnModif.setAttribute("type", "button");
        inputBtnModif.setAttribute("id", "btnModif" + i);
        inputBtnModif.setAttribute("value", "edit");

        var tr = document.createElement('tr');
        fragment.appendChild(tr);
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');

        td1.innerHTML = name_link;
        td2.appendChild(inputBtnDel);
        td3.appendChild(inputBtnModif);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        fragment.appendChild(tr);

    }
    document.querySelector('#tableList').appendChild(fragment);


    for (var p = 0; p < entries.length; p++) {
        (function (p) {
            //se agregan dos eventListener a cada td de la tabla
            document.getElementById("btnDel" + p).addEventListener("click", function () {
                deleteFile(entries[p].name);
            });
        }(p));

    }

    for (var k = 0; k < entries.length; k++) {
        (function (k) {
            //se agregan dos eventListener a cada td de la tabla
            document.getElementById("btnModif" + k).addEventListener("click", function () {
                editFile(entries[k].name);
            });
        }(k));

    }
}

function readFile(filename) {
    var content = null;
    var direccionArchivo = "proyecto/" + filename;
    filesystem.root.getFile(direccionArchivo, {}, function (fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                content = String(this.result);
                document.getElementById("nombre_archivo_modificar").value = filename;
                document.getElementById("contenido_archivo_modificar").innerHTML = content;
            };
            reader.readAsText(file);
            //alert("Archivo " + filename + " Eliminado");
        }, errorHandler);

    }, errorHandler);
}
function editFile(filename) {
    //alert(filename);
    readFile(filename);
    window.location = "#modificar";
}

function saveEditedFile() {
    var filename = document.getElementById("nombre_archivo_modificar").value;
    var content = document.getElementById("contenido_archivo_modificar").value;
    var path = "proyecto/" + filename;
    alert(path);
    filesystem.root.getFile(
        path,
        {
            create: false
        },
        function (fileEntry) {
            // Create a FileWriter object for our FileEntry (with the given name of the file).
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.seek(0); //Start write position at EOF
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
    var direccionArchivo = "proyecto/" + filename + ".txt";
    filesystem.root.getFile(direccionArchivo, {create: true}, function (fileEntry) {

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
    var direccionArchivo = "proyecto/" + filename;
    alert("Se borrara el archivo: proyecto/" + filename);
    filesystem.root.getFile(direccionArchivo, {create: false}, function (fileEntry) {
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
