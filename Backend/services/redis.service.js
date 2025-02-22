import Redis from "ioredis";


const redisClient=new Redis({
    host:process.env.REDIS_HOST,
    port:Number(process.env.REDIS_PORT),
    password:process.env.REDIS_PASSWORD,
    connectTimeout: 10000000,
})

redisClient.on('connect',()=>{
    console.log('REDIS CONNECTED')
})
redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

export default redisClient