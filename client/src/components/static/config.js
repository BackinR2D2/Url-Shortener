const config = {
	URL:
		process.env.NODE_ENV === 'production'
			? 'https://short-url-olu1.onrender.com'
			: 'http://localhost:5000',
};

export default config;
