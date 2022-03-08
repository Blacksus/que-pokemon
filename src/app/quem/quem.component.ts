import { Component, OnInit } from '@angular/core';
import { APIResource, NamedAPIResource, NamedAPIResourceList, Pokemon } from 'pokenode-ts';
import { PokeapiService } from '../pokeapi.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-quem',
  templateUrl: './quem.component.html',
  styleUrls: ['./quem.component.css']
})
export class QuemComponent implements OnInit {
  chute = new FormControl();
  poke: Pokemon;
  imgPokemon: any;
  pokemons: any[];
  filteredOptions: Observable<any[]>;

  constructor(private pokeApi: PokeapiService) { }

  ngOnInit(): void {
    this.pokeApi.listarTodosKanto().subscribe(r => this.pokemons = r.results);

    this.filteredOptions = this.chute.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.pokeApi.pegarPokemon(5).subscribe(r => {
      this.poke = r;
      this.imgPokemon = this.poke.sprites.other['official-artwork'].front_default;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.pokemons.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
