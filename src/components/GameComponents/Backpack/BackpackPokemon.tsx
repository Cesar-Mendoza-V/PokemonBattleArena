import { useQuery } from "@tanstack/react-query";
import image from "./pokemon.png";
import { RotatingLines } from "react-loader-spinner";
import { IoWarning } from "react-icons/io5";

interface BackPackPokemonProps {
  id: number;
}

interface PokemonData {
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  name: string;
}

const fetchPokemon = async (id: number): Promise<PokemonData> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const BackPackPokemon = ({ id }: BackPackPokemonProps) => {
  const {
    data: pokemonData,
    isLoading,
    isError,
  } = useQuery<PokemonData>({
    queryKey: ["pokemon_" + id],
    queryFn: () => fetchPokemon(id),
  });

  return (
    <div
      style={{ backgroundImage: `url(${pokemonData?.sprites.front_default})` }}
      className="backpack-pokemon-card"
    >
      {isLoading && (
        <RotatingLines strokeColor="black" animationDuration="10" />
      )}
      {isError && <IoWarning color="black" size={"100%"} />}
      <p>#{id}</p>
      <p>{pokemonData?.name}</p>
    </div>
  );
};

export default BackPackPokemon;
