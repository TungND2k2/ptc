module.exports = {
    apps: [
        {
            name: 'ekyc-api',
            script: 'dist/src/main.js',
            args: '',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                APP_TYPE: 'api',
            },
        },
        {
            name: 'ekyc-microservice',
            script: 'dist/src/main.js',
            args: '',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                APP_TYPE: 'microservice',
            },
        },
        // {
        //     name: 'ekyc-cron',
        //     script: 'dist/src/main.js',
        //     args: '',
        //     instances: 1,
        //     autorestart: true,
        //     watch: false,
        //     max_memory_restart: '1G',
        //     env: {
        //         NODE_ENV: 'production',
        //         APP_TYPE: 'cron'
        //     },
        // },
    ],
};