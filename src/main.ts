import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { CompressionTypes, CompressionCodecs } from 'kafkajs';
import { SnappyCodec } from 'kafkajs-snappy';
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'client',
        compression: CompressionTypes.Snappy,

        brokers: ['localhost:9092'],
        ssl: false,
      },
      producerOnlyMode: false,
      consumer: {
        groupId: 'consumer',
        sessionTimeout: 90000,
        heartbeatInterval: 30000,
        compression: CompressionTypes.Snappy,
      },
      // parser: { keepBinary: true },
      send: {
        compression: CompressionTypes.Snappy,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
