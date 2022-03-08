import { Injectable } from '@angular/core';
import { NamedAPIResourceList, Pokemon, PokemonClient } from 'pokenode-ts';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private api: PokemonClient;
  constructor() {
    this.api = new PokemonClient();
  }

  pegarPokemon(id: number): Observable<Pokemon> {
    return from(this.api.getPokemonById(id));
  }

  listarTodosKanto(): Observable<NamedAPIResourceList> {
    return from(this.api.listPokemons(0, 151));
  }
}
