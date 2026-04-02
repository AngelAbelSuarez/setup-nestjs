import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { CharacterDto } from './dto/character.dto';

@Injectable()
export class ClientsDragonBallZ {
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>(
      'DRAGONBALL_API_URL',
      'https://dragonball-api.com/api/characters',
    );
  }

  async getCharacterById(id: number): Promise<CharacterDto | null> {
    try {
      const response: AxiosResponse<CharacterDto> =
        await axios.get<CharacterDto>(`${this.apiUrl}/${id}`);

      const data = {
        id: response.data.id,
        name: response.data.name,
        ki: response.data.ki,
        maxKi: response.data.maxKi,
        race: response.data.race,
        gender: response.data.gender,
        description: response.data.description,
        image: response.data.image,
        affiliation: response.data.affiliation,
      };
      return data;
    } catch {
      // console.log('Error character not found');
      return null;
    }
  }

  async getCharacterByIds(ids: number[]): Promise<CharacterDto[]> {
    const promises = ids.map((id) => this.getCharacterById(id));
    const results = await Promise.all(promises);
    return results.filter((character) => character !== null);
  }
}
