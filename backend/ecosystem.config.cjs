module.exports = {
  apps: [
    {
      name: "karaadi-backend",
      script: "src/server.ts",
      cwd: "/home/ec2-user/karaadi/backend",
      interpreter: "tsx",
      interpreter_args: "--env-file=.env.production",
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
