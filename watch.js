
        var chokidar = require('chokidar');
        var fs = require('fs');
        var watcher = null;
        var Path = require('path');
        var showInLogFlag = false;

        function StartWatcher(path){
            document.getElementById("start").disabled = true;
            document.getElementById("messageLogger").innerHTML = "Scanning the path, please wait ...";

            watcher = chokidar.watch(path, {
                ignored: /[\/\\]\./,
                persistent: true
            });

            function onWatcherReady(){
                console.info('From here can you check for real changes, the initial scan has been completed.');
                showInLogFlag = true;
                document.getElementById("stop").style.display = "block";
                document.getElementById("messageLogger").innerHTML = `This path ${path} is now being watched`;
            }

            watcher
            .on('add', function(path) { 
                
                var file = Path.basename(path)
                 console.log(' New File',file, 'has been added');

                if(showInLogFlag){
                    // addLog("File added : "+path,"new");
                    addLog("File added : "+file,"new");
                }
            })
            .on('addDir', function(path) {
                var DirName = Path.basename(path)
                console.log('Directory', DirName, 'has been added');
                //  console.log('Directory', path, 'has been added');

                 if(showInLogFlag){
                    addLog("Folder added : "+DirName,"new");
                    //  addLog("Folder added : "+path,"new");
                 }
             })
            // .on('change', function(path) {

            //     var file = Path.basename(path)
            //     // console.log('File', path, 'has been changed');
            //     console.log('File', file, 'has been changed');


            //     if(showInLogFlag){
            //         addLog("A change ocurred in : "+file,"change");
            //     }
            // })
            .on('unlink', function(path) {

                var file = Path.basename(path)
                console.log('File', file, 'has been removed');
                // console.log('File', path, 'has been removed');

                if(showInLogFlag){
                    addLog("A file was deleted : "+file,"delete");
                    // addLog("A file was deleted : "+path,"delete");
                }
            })
            .on('unlinkDir', function(path) {
                
                var DirName = Path.basename(path)
                console.log('Directory', DirName, 'has been removed');
                // console.log('Directory', path, 'has been removed');

                if(showInLogFlag){
                    addLog("A folder was deleted : "+DirName," delete");
                    // addLog("A folder was deleted : "+path,"delete");
                }
            })
            .on('error', function(error) {
                console.log('Error happened', error);

                if(showInLogFlag){
                    addLog("An error ocurred: ","delete");
                    console.log(error);
                }
            })
            .on('ready', onWatcherReady)
            .on('raw', function(event, path, details) {
                // This event should be triggered everytime something happens.
                console.log('Raw event info:', event, path, details);
            });
        }

        document.getElementById("start").addEventListener("click",function(e){
            const {dialog} = require('electron').remote;
            dialog.showOpenDialog({
                properties: ['openDirectory']
            },function(path){
                if(path){
                    StartWatcher(path[0]);
                }else {
                    console.log("No path selected");
                }
            });
        },false);

         document.getElementById("stop").addEventListener("click",function(e){
             if(!watcher){
                 console.log("You need to start first the watcher");
             }else{
                 watcher.close();
                 document.getElementById("start").disabled = false;
                 showInLogFlag = false;
                 document.getElementById("messageLogger").innerHTML = "Nothing is being watched";
             }
         },false);

        

         function resetLog(){
             return document.getElementById("log-container").innerHTML = "";
         }

         function addLog(message,type){
             var el = document.getElementById("log-container");
             var newItem = document.createElement("LI");       // Create a <li> node
             var textnode = document.createTextNode(message);  // Create a text node
             if(type == "delete"){
                 newItem.style.color = "red";
             }else if(type == "change"){
                 newItem.style.color = "blue";
             }else{
                 newItem.style.color = "green";
             }

             newItem.appendChild(textnode);                    // Append the text to <li>
             el.appendChild(newItem);

              //////////////////////////////////////////////////

         
              
             //////////////////////////////////////////////////
         }