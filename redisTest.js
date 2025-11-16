import IORedis from "ioredis";

async function test() {
  const redis = new IORedis(process.env.REDIS_URL);
  console.log(await redis.ping());
}

test();
