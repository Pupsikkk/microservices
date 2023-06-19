const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const port = 3000;

const kafka = new Kafka({
    // clientId: 'my-consumer',
    brokers: ['kafka:9092'], // Замініть на відповідні значення для вашого кластера Kafka
});

const consumer = kafka.consumer({ groupId: 'my-consumer-group' });
console.log({ consumer })

async function runConsumer() {
    await consumer.connect();
    console.log('CONNECTED')
    await consumer.subscribe({ topic: 'demo', fromBeginning: true });
    console.log('SUBSCRIBED')

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('Отримано повідомлення:', {
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });
}

app.use(express.json());

app.get('/api/logger', async (req, res) => {
    res.send('check')
})

app.post('/api/logger/send', async (req, res) => {
    try {
        const { message } = req.body;

        const producer = kafka.producer();
        await producer.connect();

        console.log()

        await producer.send({
            topic: 'demo', // Замініть на назву топіку, з яким ви хочете взаємодіяти
            messages: [{ value: message }],
        });

        await producer.disconnect();

        res.status(200).json({ success: true, message: 'Повідомлення відправлено' });
    } catch (error) {
        console.error('Помилка при відправленні повідомлення:', error);
        res.status(500).json({ success: false, message: 'Помилка при відправленні повідомлення' });
    }
});

app.listen(port, async () => {
    console.log(`Сервер запущено на порту ${port}`);
    await runConsumer();
    console.log('Підключено до Kafka та почато слухання повідомлень');
});
