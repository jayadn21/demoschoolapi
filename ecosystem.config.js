module.exports = {
    apps: [{
        name: "server",
        script: "./server.js",
        env: {
            NODE_ENV: ""
        },
        env_demo: {
            NODE_ENV: "demo",
        },
        env_azure: {
            NODE_ENV: "azure",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}
