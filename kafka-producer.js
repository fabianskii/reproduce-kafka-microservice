const { Kafka } = require('kafkajs');

const { CompressionTypes, CompressionCodecs } = require('kafkajs');
const SnappyCodec = require('kafkajs-snappy');

CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: 'client',
  brokers: ['localhost:9092'],
  ssl: false,
});

const producer = kafka.producer();
producer.on('producer.connect', () => {
  console.log(`KafkaProvider: connected`);
});
producer.on('producer.disconnect', () => {
  console.log(`KafkaProvider: could not connect`);
});
producer.on('producer.network.request_timeout', (payload) => {
  console.log(`KafkaProvider: request timeout ${payload.clientId}`);
});

const run = async () => {
  // Producing
  await producer.connect();
  await producer.send({
    compression: CompressionTypes.Snappy,

    topic: 'example-topic',
    messages: [
      {
        value: JSON.stringify({
          id: 'DC127DCC-2689-4CE7-BC42-890BB56BCC4E.1',
          version: '1.0',
          occurred: '2023-10-28T09:31:18.147Z',
          original_encoding: 'ascii',
          original_encodingg: 'ascii',
        }),
      },
    ],
  });
  console.log(`Message sent.`);
  process.exit(1);
};

run().catch(console.error);
