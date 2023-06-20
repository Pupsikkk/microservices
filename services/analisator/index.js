const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const port = 3000;

const kafka = new Kafka({
    brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'analisator-group' });
const stats = new Map();

setInterval(() => {
    console.log(`\n${new Date()}`);
    for (const microservice of stats.keys()) {
        const microserviceStats = stats.get(microservice);
        const { totalRequests, startTime } = microserviceStats;
        const timeDeltaInSec = Math.floor(Date.now() / 1000) - Math.floor(startTime / 1000);

        const perSec = totalRequests / timeDeltaInSec;
        const perMin = perSec * 60;
        const perHour = perMin * 60;

        console.log(`${microservice.toUpperCase()} -- total:${microserviceStats.totalRequests} perSec:${perSec} perMin:${perMin} perHour:${perHour}`)
    }
    console.log('\n')
}, 60 * 1000)

async function statsConsumer() {
    await consumer.connect();
    console.log('CONNECTED')
    await consumer.subscribe({ topic: 'stats', fromBeginning: true });
    console.log('SUBSCRIBED TO STATS')

    await consumer.run({
        eachMessage: async ({ message }) => {
            const incomingMessage = JSON.parse(message.value.toString());

            let existingRecord = stats.get(incomingMessage.microservice);
            if (!existingRecord)
                existingRecord = {
                    totalRequests: 0,
                    startTime: new Date().getTime(),
                }

            existingRecord.totalRequests += 1;
            stats.set(incomingMessage.microservice, existingRecord)
        },
    });
}

app.listen(port, async () => {
    console.log(`Сервер запущено на порту ${port}`);
    await statsConsumer();
    console.log('Підключено до Kafka та почато слухання повідомлень');
});
