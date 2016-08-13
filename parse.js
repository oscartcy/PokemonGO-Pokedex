var fs = require('fs');

var lineReader = require('readline').createInterface({
  input: fs.createReadStream('./hk_raw.txt')
});

var hk_raw = {};
lineReader.on('line', (line) => {
  var split = line.split('\t');

  hk_raw[split[0]] = split[1];
});


lineReader.on('close', () => {
  console.log(hk_raw);
  injectHkName();
});

function injectHkName() {
  var pokedex = require('./pokedex.json');

  pokedex.pokemon.forEach((pokemon, index, array) => {
    var hk_name = hk_raw[pokemon.num];

    pokemon.name_hk = hk_name;
    array[index] = pokemon;
  });

  console.log(pokedex);

  fs.writeFile('pokedex_hk.json', JSON.stringify(pokedex, null, 2), (err) => {
    if (err)
      console.error(err);
  });
}