require('dotenv').config({ path: '../.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'git@github.com:Elayd/nodejs-pm2-deploy.git',
      path: DEPLOY_PATH,
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no', 'IdentityFile=~/.ssh/keys/private_key'],

      'post-deploy': [
        'cd frontend',

        'npm install',

        'NODE_OPTIONS=--openssl-legacy-provider npm run build',
      ].join(' && '),
    },
  },
};
