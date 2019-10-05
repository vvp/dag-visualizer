const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'visualizer.js',
        library: 'visualizer',
        libraryTarget: 'umd',
        globalObject: 'this',
        path: path.resolve(__dirname, 'dist'),
    },
}