// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? "pending" : "idle",
    pokemon: null,
    error: null,
  })

  const { status, pokemon, error } = state;

  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: "pending"});
    fetchPokemon(pokemonName, 300).then(
      (pokemon) => {
        setState({pokemon, status: "resolved"});
      },
      (error) => {
        setState({error, status: "rejected"});
      },
    )
  },[pokemonName])


  if (status === "idle") {
    return "Submit a pokemon"
  } else if (status === "pending") {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === "rejected") {
    throw error
  } else if (status === "resolved") {
    return (
      <PokemonDataView pokemon={pokemon} />
    )
  }

  throw new Error("unexpected status: " + status)
}

function ErrorFallback ({error, resetErrorBoundary}) {
  return (
    <div role="alert"> 
      There was an error: {" "}
      <pre style={{whiteSpace: "normal"}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName("")
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} /> 
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
