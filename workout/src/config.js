/* React environment configuration (frontend only) */
// Do not store any sensitive data/secret values/API keys here - it is available in the browser to anyone.

const prod = {
    env: 'production',
    api_host: '' // an empty string to signify a relative path. can also put a deployment URL.
};
const dev = {
    env: 'development',
    api_host: 'http://localhost:5000', // web server localhost port
    use_frontend_test_user: true, // for testing a logged in frontend only, without any actual logging in, set to true (note that the test user will have to be turned on in the backend if you want to make authenticated requests).
    user: "6062c2958091680b946b1ade"
};

// export the appropriate environment
export default process.env.NODE_ENV === 'production' ? prod : dev;