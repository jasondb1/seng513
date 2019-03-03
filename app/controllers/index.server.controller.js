// render function 



exports.render = function (req, res) {
    res.render('index', {
        online: 'Group 2 SENG 513 UI MOCKUP',
        smallFish: 'SmallFish Login'
    });
};



//exports.render = function (req, res) {
//    res.status(200).send('ERP IS ALIVE ');
//};