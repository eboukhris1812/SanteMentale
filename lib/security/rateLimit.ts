export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
};

type UpstashLimiter = {
  limit: (
    identifier: string
  ) => Promise<{ success: boolean; remaining: number; reset: number }>;
};

let upstashLimiter: UpstashLimiter | null | undefined;
const fallbackStore = new Map<string, { count: number; resetAt: number }>();

const WINDOW_SECONDS = 60;
const LIMIT_PER_WINDOW = 20;

async function getUpstashLimiter(): Promise<UpstashLimiter | null> {
  if (upstashLimiter !== undefined) {
    return upstashLimiter;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    upstashLimiter = null;
    return upstashLimiter;
  }

  try {
    // Dynamic import keeps local dev working even if packages are not installed yet.
    const dynamicImport = new Function(
      "specifier",
      "return import(specifier)"
    ) as (specifier: string) => Promise<any>;
    const redisModule = await dynamicImport("@upstash/redis");
    const ratelimitModule = await dynamicImport("@upstash/ratelimit");
    const redis = new redisModule.Redis({ url, token });

    upstashLimiter = new ratelimitModule.Ratelimit({
      redis,
      limiter: ratelimitModule.Ratelimit.fixedWindow(
        LIMIT_PER_WINDOW,
        `${WINDOW_SECONDS} s`
      ),
      prefix: "mental-health-bilan",
    }) as UpstashLimiter;

    return upstashLimiter;
  } catch {
    upstashLimiter = null;
    return upstashLimiter;
  }
}

function fallbackRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const previous = fallbackStore.get(identifier);

  if (!previous || now >= previous.resetAt) {
    fallbackStore.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_SECONDS * 1000,
    });
    return {
      allowed: true,
      remaining: LIMIT_PER_WINDOW - 1,
      resetInSeconds: WINDOW_SECONDS,
    };
  }

  const nextCount = previous.count + 1;
  fallbackStore.set(identifier, { ...previous, count: nextCount });
  const remaining = Math.max(0, LIMIT_PER_WINDOW - nextCount);
  const resetInSeconds = Math.max(1, Math.ceil((previous.resetAt - now) / 1000));

  return {
    allowed: nextCount <= LIMIT_PER_WINDOW,
    remaining,
    resetInSeconds,
  };
}

export async function enforceRateLimit(ip: string): Promise<RateLimitResult> {
  const identifier = ip && ip !== "unknown" ? ip : "anonymous";
  const limiter = await getUpstashLimiter();

  if (!limiter) {
    return fallbackRateLimit(identifier);
  }

  const result = await limiter.limit(identifier);
  const now = Date.now();
  const resetInSeconds = Math.max(1, Math.ceil((result.reset - now) / 1000));

  return {
    allowed: result.success,
    remaining: result.remaining,
    resetInSeconds,
  };
}
