const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const port = 3000;

const kafka = new Kafka({
    brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'logger-group' });

async function logConsumer() {
    await consumer.connect();
    console.log('CONNECTED')
    await consumer.subscribe({ topic: 'log', fromBeginning: true });
    console.log('SUBSCRIBED TO LOG')

    await consumer.run({
        eachMessage: async ({ message }) => {
            console.log(message.value.toString());
        },
    });
}

app.listen(port, async () => {
    console.log(`Сервер запущено на порту ${port}`);
    await logConsumer();
    console.log('Підключено до Kafka та почато слухання повідомлень');
});
