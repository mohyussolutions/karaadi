module.exports = {
  apps: [
    {
      name: "karaadi-backend",
      cwd: "./backend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        ENABLE_EVENT_LOOP_MONITOR: "false",
      },
    },
  ],
};
