module.exports = {
  devServer: {
    allowedHosts: 'all',
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:7234',
        secure: false,
        changeOrigin: true
      }
    }
  }
};