require('dotenv').config({ path: '../.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
  apps: [
    {
      name: 'api',
      script: './dist/app.js',
      env: { NODE_ENV: 'production' },
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'git@github.com:Elayd/nodejs-pm2-deploy.git',
      path: DEPLOY_PATH,

      'pre-deploy-local': 'scp ./backend/.env $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/shared/backend/.env',

      'post-deploy': [
        'cd backend',

        'ln -sfn ../../shared/backend/.env .env',

        'npm ci',

        'npm run build',

        'pm2 startOrReload ecosystem.config.js --env production --update-env',
      ].join(' && '),
    },
  },
};
