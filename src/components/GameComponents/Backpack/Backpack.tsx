import { useEffect, useState } from "react";
import "./Backpack.css";
import BackPackPokemon from "./BackpackPokemon";

const Backpack = () => {
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);

  useEffect(() => {
    const ammount = Math.ceil(Math.random() * 20);

    const newPokemonIds = [];

    for (let i = 0; i < ammount; i++) {
      newPokemonIds.push(Math.ceil(Math.random() * 151));
    }

    console.log(newPokemonIds.sort((a, b) => a - b));

    setPokemonIds(newPokemonIds);
  }, []);

  return (
    <section className="backpack-layout">
      <h1 className="backpack-title">Mochila</h1>
      <div className="backpack-pokemons-layout">
        {pokemonIds.map((id) => (
          <BackPackPokemon id={id} />
        ))}
      </div>
    </section>
  );
};

export default Backpack;
