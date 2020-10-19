const config = {
    URL: process.env.NODE_ENV === 'production' ? 'https://url-shortener-ra.herokuapp.com' : 'http://localhost:5000'
}

export default config;