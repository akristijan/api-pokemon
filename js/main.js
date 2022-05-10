//Example fetch using pokemonapi.co
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  const choice = document.querySelector('input').value.replaceAll('.', '').replaceAll(' ', '-').toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${choice}`
  console.log(url)

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        const potentialPet = new PokeInfo(data.name, data.weight, data.height,data.types, data.sprites.other['official-artwork'].front_default, data.location_area_encounters);
        potentialPet.getTypes()
        potentialPet.isItHousepet()
        potentialPet.locationInfo()
        potentialPet.locationCleanUp()
        let decision = ''
        if(potentialPet.housepet) {
          decision = 'This Pokemon is small enough, light enough, and safe enough to be a good pet!'; 
        }
        else {
          decision = `This Pokemon would not be a good pet because ${potentialPet.reason.join(' and ')}.`
        }
        document.querySelector('h2').innerText = decision;
        document.querySelector('img').src = potentialPet.image;
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
    console.log(this.reason)

    if(weightPokemon > 400) {
      this.reason.push(`it is too heavey at ${weightPokemon} pounds`)
      this.housepet = false;
    }
    
    if(heightPokemon > 7) {
      this.reason.push(`it is too tall at ${heightPokemon} feet`)
      this.housepet = false;

    }
    if(badTypes.some( t => this.typeList.indexOf(t) !== -1)) {
      this.reason.push("it's type is too dangerous")
      this.housepet = false;

    }
  }

  
}

class PokeInfo extends Poke {
  constructor(name, weight, height, types, image, location) {
    super(name, weight, height, types, image)
    this.locationURL = location;
    this.locationList = [];
    this.locationString = '';
  }

  locationInfo() {
    fetch(this.locationURL) 
        .then(res => res.json())
        .then(data => {
          data.forEach(obj => {
            this.locationList.push(obj.location_area.name
              )
              
          })
          this.locationList.forEach(location => {
            this.locationString += location;
          })
          console.log(this.locationString)
          console.log(this.locationCleanUp())
        })
        .catch(err => {
          console.log(`error ${err}`)
      }) ;
  }

  locationCleanUp() {
    const words = this.locationList.slice(0,5).join(',').replaceAll("-", ' ').split(' ')
    return words

  }
}
