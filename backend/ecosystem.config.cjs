module.exports = {
  apps: [
    {
      name: "karaadi-backend",
      script: "src/server.ts",
      cwd: __dirname,
      interpreter: "tsx",
      env: {
        NODE_ENV: "development",
        PORT: 8080,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
      },

      merge_logs: true,
    },
  ],
};
