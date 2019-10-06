const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'visualizer.js',
        library: 'Visualizer',
        libraryTarget: 'umd',
        globalObject: 'this',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', {
                            'plugins': ['@babel/plugin-proposal-class-properties']
                        }]
                    }
                }
            }
        ]
    },
}