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

    const { data: dataFipe } = await firstValueFrom(
      this.httpService
        .get<any>(
          `http://api.fipeapi.com.br/v1/fipe/${data.data.fipes[0].codigo}?${process.env.WIPSITES_KEY_FIPE}`,
        )
        .pipe(
          catchError(() => {
            throw new BadRequestException(
              'Não encontramos sua placa, verifique antes de enviar novamente.',
            );
          }),
        ),
    );

    data.data.veiculo.marca = dataFipe[0].marca;
    data.data.veiculo.modelo = dataFipe[0].modelo.split(' ')[0];
    data.data.veiculo.versao = dataFipe[0].modelo
      .replace(dataFipe[0].modelo.split(' ')[0], '')
      .replace(' ', '');

    return data;
  }
}
