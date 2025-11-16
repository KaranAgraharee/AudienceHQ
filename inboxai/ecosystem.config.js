module.exports = {
  apps: [{
    name: 'inboxai-worker',
    script: 'node_modules/.bin/tsx',
    args: 'worker/index.ts',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: './logs/worker-error.log',
    out_file: './logs/worker-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    env: {
      NODE_ENV: 'production'
    }
  }]
};

