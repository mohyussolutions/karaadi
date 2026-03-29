// PM2 ecosystem config for karaadi-backend
module.exports = {
  apps: [
    {
      name: "karaadi-backend-dev",
      script: "src/server.ts",
      cwd: __dirname,
      interpreter: "tsx",
      env: {
        NODE_ENV: "development",
        PORT: 8080,
      },
      error_file: "logs/pm2-backend-dev-error.log",
      out_file: "logs/pm2-backend-dev-out.log",
      log_file: "logs/pm2-backend-combined.log",
      merge_logs: true,
    },
    {
      name: "karaadi-backend-prod",
      script: "src/server.ts",
      cwd: __dirname,
      interpreter: "tsx",
      env: {
        NODE_ENV: "production",
        PORT: 9090,
      },
      error_file: "logs/pm2-backend-prod-error.log",
      out_file: "logs/pm2-backend-prod-out.log",
      log_file: "logs/pm2-backend-combined.log",
      merge_logs: true,
    },
  ],
};
