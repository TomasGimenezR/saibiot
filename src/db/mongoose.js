const mongoose = require('mongoose')

const url = 'mongodb+srv://tgr:nwnPBCxsxd2AtjdR@tgr-cluster.lw6zv.mongodb.net/saibiot?retryWrites=true&w=majority';
console.log(url)

mongoose.connect( url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})