const indexCtrl = {};

indexCtrl.renderIndex = (req,res) => {
    res.render('index');
}

indexCtrl.renderAbout = (req,res) => {
    res.render('about');
}

indexCtrl.renderStoreProducts =  (req,res) => {
    res.render('catalog',{layout: 'store'});
}

module.exports = indexCtrl;