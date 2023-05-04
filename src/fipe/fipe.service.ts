import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class FipeService {
  constructor(private readonly httpService: HttpService) {}

  async fipe(plate: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(
          `https://placas.fipeapi.com.br/placas/${plate.replace('-', '')}?key=${
            process.env.WIPSITES_KEY
          }`,
        )
        .pipe(
          catchError(() => {
            throw new BadRequestException(
              'Não encontramos sua placa, verifique antes de enviar novamente.',
            );
          }),
        ),
    );

    return data;
  }
}
