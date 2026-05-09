module.exports = {
  apps: [
    {
      name: "karaadi-backend",
      script: "dist/server.js",
      cwd: "/home/ec2-user/karaadi/backend",
      node_args: "--env-file=.env",
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
      },
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
};
