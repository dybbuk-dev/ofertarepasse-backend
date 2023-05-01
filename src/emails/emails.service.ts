import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailsService {
  constructor(private readonly mailerService: MailerService) {}

  async negociation(email: string, title: string, text: string) {
    this.mailerService.sendMail({
      to: email,
      from: 'nao-responder@ofertarepasse.com.br',
      subject: title,
      text: text,
    });
  }
}
