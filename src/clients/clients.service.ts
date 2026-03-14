import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

interface CharacterResponse {
    id: string;
    name: string;
    race: string;
    affiliation: string;
}

@Injectable()
export class Clients {
    private readonly apiUrl: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.apiUrl = this.configService.get<string>(
            'DRAGONBALL_API_URL',
            'https://dragonball-api.com/api/characters'
        );
    }

    async getCharacterById(id: number): Promise<CharacterResponse | null> {
        try {
            const response: AxiosResponse<CharacterResponse> = await axios.get<CharacterResponse>(
                `${this.apiUrl}/${id}`,
            );
            return response.data;
        } catch {
            console.log('Error character not found');
            return null;
        }
    }

    async getCharacterByIds(ids: number[]): Promise<CharacterResponse[]> {
        const promises = ids.map((id) => this.getCharacterById(id));
        const results = await Promise.all(promises);
        return results.filter((character) => character !== null);
    }
}
