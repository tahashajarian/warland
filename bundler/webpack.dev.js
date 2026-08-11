const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')

const infoColor = (_message) =>
{
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devtool: 'eval-cheap-module-source-map',
        devServer:
        {
            host: '0.0.0.0',
            port: 8080,
            contentBase: './dist',
            watchContentBase: true,
            open: true,
            https: false,
            useLocalIp: true,
            disableHostCheck: true,
            overlay: true,
            noInfo: true,
            after: function(app, server, compiler)
            {
                const port = server.options.port
                const https = server.options.https ? 's' : ''
                const domain = `http${https}://localhost:${port}`
                console.log(`Project running at ${infoColor(domain)}`)
            }
        }
    }
)
