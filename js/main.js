//Example fetch using pokemonapi.co
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  const choice = document.querySelector('input').value
  const url = `https://pokeapi.co/api/v2/pokemon/${choice}`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        const potentialPet = new Poke(data.name, data.weight, data.height,data.types, data.sprites.other['official-artwork'].front_default);
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

class Poke {
  constructor(name, weight, height, types, image) {
    this.name = name;
    this.weight = weight;
    this.height = height;
    this.types = types;
    this.image = image;
    this.housepet = true;
    this.reason = [];
    this.typeList = [];
  }

  getTypes() {
    for(const prop of this.types) {
      this.typeList.push(prop.type.name)
    }
    return this.typeList;
  }

  weightToPounds(kilaza) {
    return Math.round( (kilaza/4.536)*100)/100;
  }

  heightToFeet(height) {
    return Math.round((height/3.048)*100)/100
  }

  isItHousepet() {
    // check height, weight, and types
    let badTypes = ["fire", "electric", "fighting", "poison", "ghost"]
    let weightPokemon = this.weightToPounds(this.weight);
    let heightPokemon = this.heightToFeet(this.height);
    if(weightPokemon > 400) {
      this.reason.push(`it is too heavey at ${masaPokemona} pounds`)
      this.housepet = false;
    }
    
    if(heightPokemon > 7) {
      this.reason.push(`it is too tall at ${heightPokemon} feet`)
    }
  }
}
