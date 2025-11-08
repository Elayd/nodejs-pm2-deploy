require('dotenv').config({ path: '../.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/master', DEPLOY_REPO,
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
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'pre-deploy-local': 'scp .env $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/source/backend/.env',

      'post-deploy': [
        'cd backend',

        'npm install',

        'npm run build',

        'pm2 startOrReload ecosystem.config.js --env production --update-env',
      ].join(' && '),
    },
  },
};
