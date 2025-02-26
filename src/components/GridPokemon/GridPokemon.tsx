import { useQuery } from "@tanstack/react-query";
import { IoWarning } from "react-icons/io5";
import { RotatingLines } from "react-loader-spinner";

interface SpawnedPokemon {
  id: number;
  x: number;
  y: number;
}

interface GridPokemonProps {
  pokemon: SpawnedPokemon;
  selected: boolean;
  setSelectedPokemon: (pokemon: SpawnedPokemon) => void;
}

interface PokemonData {
  sprites: {
    front_default: string;
  };
}

const fetchPokemon = async (id: number): Promise<PokemonData> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const GridPokemon = ({
  pokemon,
  selected,
  setSelectedPokemon,
}: GridPokemonProps) => {
  const {
    data: pokemonData,
    isLoading,
    isError,
  } = useQuery<PokemonData>({
    queryKey: ["pokemon_" + pokemon.id],
    queryFn: () => fetchPokemon(pokemon.id),
  });

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSelectedPokemon(pokemon);
      }}
      className="grid-pokemon"
      style={{
        gridColumnStart: pokemon.x,
        gridRowStart: pokemon.y,
        gridColumnEnd: pokemon.x + 2,
        gridRowEnd: pokemon.y + 2,
        backgroundImage: pokemonData?.sprites?.front_default
          ? `url(${pokemonData.sprites.front_default})`
          : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: selected ? "2px solid black" : "none",
        borderRadius: 20,
      }}
    >
      {isLoading && (
        <RotatingLines strokeColor="black" animationDuration="10" />
      )}
      {isError && <IoWarning color="black" size={"full"} />}
    </div>
  );
};

export default GridPokemon;
