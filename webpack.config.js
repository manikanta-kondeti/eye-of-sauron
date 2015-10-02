var path = require('path');

module.exports = {
    name: 'client-side rendering',
    entry: './index.jsx',
    output: {
        filename: 'bundle.js'

    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            }
        ]
    },
    externals: {
        //don't bundle the 'react' npm package with our bundle.js
        //but get it from a global 'React' variable
        'react': 'React'
    },
    resolve: {
        resolve: {
            config: '/config.js',
            extensions: ['', '.js']
        },
        extensions: ['', '.js', '.jsx']
    }

 }