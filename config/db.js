if (process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb://noam:Nmkl9634@ds163905.mlab.com:63905/test-test'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}