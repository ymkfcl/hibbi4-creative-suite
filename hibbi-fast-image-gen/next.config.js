module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Replace with your image domain if needed
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api/generate', // Set your API URL
  },
};