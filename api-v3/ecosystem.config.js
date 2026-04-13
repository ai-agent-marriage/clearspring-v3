module.exports = {
  apps: [{
    name: 'clearspring-v3-api',
    script: 'app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      GITHUB_SHA: process.env.GITHUB_SHA || 'manual-deploy'
    },
    error_file: './logs/v3-error.log',
    out_file: './logs/v3-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true
  }]
};
