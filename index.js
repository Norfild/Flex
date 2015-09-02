var express = require('express'),
    app = express(),
    path = require('path');

var indexPath = path.resolve(__dirname, 'build/index.html');

//base route
app.get('*', function(req, res){
    res.sendFile(indexPath);
});

var server = app.listen(3050, function(){
   console.log('server started');
});