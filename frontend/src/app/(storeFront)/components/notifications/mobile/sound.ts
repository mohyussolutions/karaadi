let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function playNotificationSound(): void {
  try {
    const context = getContext();
    if (!context) return;

    const resume = context.state === "suspended" ? context.resume() : Promise.resolve();
    resume.then(() => {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.connect(gain);
      gain.connect(context.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, context.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, context.currentTime + 0.1);

      gain.gain.setValueAtTime(0.25, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);

      osc.start(context.currentTime);
      osc.stop(context.currentTime + 0.35);
    }).catch(() => {});
  } catch {}
}
