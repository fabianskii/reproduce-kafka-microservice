import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { CompressionTypes, CompressionCodecs } from 'kafkajs';
import { SnappyCodec } from 'kafkajs-snappy';
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'EVENT_MICROSERVICE',
        useFactory: () => ({
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
        }),
        inject: [],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
