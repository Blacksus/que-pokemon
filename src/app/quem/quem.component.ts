import { Component, OnInit } from '@angular/core';
import { Pokemon } from 'pokenode-ts';
import { PokeapiService } from '../pokeapi.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quem',
  templateUrl: './quem.component.html',
  styleUrls: ['./quem.component.css']
})
export class QuemComponent implements OnInit {
  particlesOptions = {
    fpsLimit: 60,
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#ff0000',
        animation: {
          enable: true,
          speed: 20,
          sync: true
        }
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0
        },
        polygon: {
          nb_sides: 5
        },
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 3,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 20,
          size_min: 0.1,
          sync: false
        }
      },
      links: {
        enable: true,
        distance: 100,
        color: '#ffffff',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 0.8
        },
        repulse: {
          distance: 200
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true,
    background: {
      color: '#000000',
      image: '',
      position: '50% 50%',
      repeat: 'no-repeat',
      size: 'cover'
    }
  };

  chute = new FormControl();
  poke: Pokemon;
  imgPokemon: any;
  pokemons: any[];
  filteredOptions: Observable<any[]>;
  public erros: Pokemon[];
  public fakeArray = new Array(3);
  public acertou: boolean;
  public acabou: boolean;
  public pokemonSelecionado: any = null;

  formatter = (pokemon: Pokemon) => pokemon.name;

  constructor(private pokeApi: PokeapiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.acabou = false;
    this.acertou = false;
    this.erros = [];
    this.pokeApi.listarTodosKanto().subscribe(r => this.pokemons = r.results);

    this.pokeApi.pegarPokemon(5).subscribe(r => {
      this.poke = r;
      const pokemonImg = this.poke.sprites.other['official-artwork'].front_default as string;

      this.http.get(pokemonImg, { responseType: 'blob' })
        .subscribe(blob => {
          const reader = new FileReader();
          const binaryString = reader.readAsDataURL(blob);
          reader.onload = (event: any) => {
            this.imgPokemon = event.target.result;
          };
          reader.onerror = (event: any) => {
            console.log('File could not be read: ' + event.target.error.code);
          };
        });
    });
  }

  search: OperatorFunction<string, readonly { id: number, name: string }[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 1),
    map(term => this.pokemons.filter(p => new RegExp(term, 'mi').test(p.name)).slice(0, 10))
  )

  public chutar(): void {

    if (this.pokemonSelecionado != null) {
      if (this.pokemonSelecionado.name === this.poke.name) {
        this.acertou = true;
        this.acabou = true;
      }
      else {
        this.fakeArray.pop();
        this.erros.push(this.pokemonSelecionado);

        if (this.erros.length === 3) {
          this.acabou = true;
        }
      }
    }
    this.pokemonSelecionado = null;
  }

}
