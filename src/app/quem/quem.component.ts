import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Pokemon } from 'pokenode-ts';
import { PokeapiService } from '../pokeapi.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Container, Main } from 'tsparticles';

@Component({
  selector: 'app-quem',
  templateUrl: './quem.component.html',
  styleUrls: ['./quem.component.css']
})
export class QuemComponent implements OnInit, AfterViewInit {
  @ViewChild('eleImgPokemon', { static: false }) eleImgPokemon: ElementRef;
  @ViewChild('canvaPokemon', { static: false }) divCanvaPokemon: ElementRef<HTMLCanvasElement>;

  particlesOptions = {
    background: {
      color: {
        value: '#0d47a1'
      }
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push'
        },
        onHover: {
          enable: true,
          mode: 'repulse'
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 400,
          duration: 2,
          opacity: 0.8,
          size: 40
        },
        push: {
          quantity: 4
        },
        repulse: {
          distance: 200,
          duration: 0.4
        }
      }
    },
    particles: {
      color: {
        value: '#ffffff'
      },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1
      },
      move: {
        // direction: 'top',
        enable: true,
        // outModes: 'bounce',
        random: false,
        speed: 6,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 80
      },
      opacity: {
        value: 0.5
      },
      shape: {
        type: 'circle'
      },
      size: {
        value: { min: 1, max: 5 }
      }
    },
    detectRetina: true
  };
  id = 'tsparticles';
  chute = new FormControl();
  poke: Pokemon;
  imgPokemon: any;
  pokemons: any[];
  filteredOptions: Observable<any[]>;
  public tentativas: Pokemon[];
  public fakeArray = new Array(3);
  public acertou: boolean;
  public acabou: boolean;
  public pokemonSelecionado: any = null;
  private context: CanvasRenderingContext2D | null;
  formatter = (pokemon: Pokemon) => pokemon.name;

  constructor(private pokeApi: PokeapiService, private http: HttpClient) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.context = (this.divCanvaPokemon.nativeElement as HTMLCanvasElement).getContext('2d');
      this.eleImgPokemon.nativeElement.remove();
      this.draw();
    }, 500);
  }

  ngOnInit(): void {
    this.acabou = false;
    this.acertou = false;
    this.tentativas = [];
    this.pokeApi.listarTodosKanto().subscribe(r => this.pokemons = r.results);

    this.pokeApi.pegarPokemon(5).subscribe(r => {
      this.poke = r;
      this.imgPokemon = this.poke.sprites.other['official-artwork'].front_default as string;
    });
  }

  private draw(): void {
    const image = new Image();

    image.src = this.imgPokemon;
    this.context.drawImage(image, 0, 0);
    this.context.scale(-100, -100);
    this.context.globalAlpha = 0.2;
    this.context.fillStyle = 'blue';
    this.context.fillRect(50, 50, 75, 50);
    this.context.fillStyle = 'green';
    this.context.fillRect(80, 80, 75, 50);
    this.context.save();
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
        this.tentativas.push(this.pokemonSelecionado);
        this.acertou = true;
        this.acabou = true;
      }
      else {
        this.fakeArray.pop();
        this.tentativas.push(this.pokemonSelecionado);

        if (this.tentativas.length === 3) {
          this.acabou = true;
        }
      }
    }
    this.pokemonSelecionado = null;
  }

}
