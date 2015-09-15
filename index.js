var express = require('express'),
    app = express(),
    path = require('path');

var indexPath = path.resolve(__dirname, 'build/index.html'),
    vendorsPath = path.resolve(__dirname, 'vendors'),
    scriptsPath = path.resolve(__dirname, 'build/javascript');
    templatePath = path.resolve(__dirname, 'build');

app.use(express.static(vendorsPath));
app.use(express.static(scriptsPath));
app.use(express.static(templatePath));

//base route
app.get('*', function(req, res){
    res.sendFile(indexPath);
});

var server = app.listen(3050, function(){
   console.log('Server started http://localhost:3050/');
});