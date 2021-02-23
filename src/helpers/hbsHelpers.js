const hbsHelpers = {};

hbsHelpers.isAdmin = function(user) {
    if(user !== null && user.role !== 'CLIENT_ROLE'){
        return true;
    }
    return false;
};

hbsHelpers.isMaster = function(user) {
    if(user !== null && user.role === 'MASTER_ROLE'){
        return true;
    }
    return false;
};

hbsHelpers.areEquals = ('ifEquals', function(arg1, arg2, options) {
    console.log(arg1,arg2);
    return (arg1 === arg2) ? true : false;
});

hbsHelpers.paginate = function(nPages){
    let pages = [];
    for(i= 1; i <= nPages; i++){
        pages.push(i);
    }
    return pages;
}


module.exports = hbsHelpers;