import { useQuery } from "@tanstack/react-query";
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
  if (!response.ok) throw new Error(`Error ${response.status}: No se encontró el Pokémon #${id}`);
  return response.json();
};

const Loading = () => (
  <div className="loading-container">
    <RotatingLines strokeColor="black" animationDuration="1" width="50" />
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="error-container">
    <IoWarning color="red" size={50} />
    <p className="error-message">{message}</p>
  </div>
);

const BackPackPokemon = ({ id }: BackPackPokemonProps) => {
  const { data: pokemonData, isLoading, isError, error } = useQuery<PokemonData>({
    queryKey: ["pokemon", id],
    queryFn: () => fetchPokemon(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return (
    <div
      className={`backpack-pokemon-card ${isLoading || isError ? "loading-error" : ""}`}
      style={{
        backgroundImage: pokemonData?.sprites.front_default ? `url(${pokemonData.sprites.front_default})` : undefined,
        backgroundColor: !pokemonData?.sprites.front_default ? "#f0f0f0" : undefined,
      }}
    >
      {isLoading && <Loading />}
      {isError && <ErrorDisplay message={error?.message || "Error al cargar"} />}
      {!isLoading && !isError && pokemonData && (
        <>
          <p>#{id}</p>
          <p>{pokemonData.name}</p>
        </>
      )}
    </div>
  );
};

export default BackPackPokemon;
