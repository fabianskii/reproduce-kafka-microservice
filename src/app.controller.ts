import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @EventPattern('example-topic')
  async createEvent(event) {
    console.log('Event: ');
    console.log(event);
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
