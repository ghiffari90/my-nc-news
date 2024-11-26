const { response } = require("./app");

exports.psqlErrorHandler = (err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid id type' });
    } else if(err.code === '23503'){
        res.status(404).send({ msg: 'not found' })
    } else {
        next(err);
    };
};

exports.customErrorHandler = (err, req, res, next) => {
    if((err.status && err.msg)){
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

exports.serverErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal server error'});
}