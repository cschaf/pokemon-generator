const typeChart = {
    normal: { attackEffectiveAgainst: [], attackNotVeryEffectiveAgainst: ['rock', 'steel'], attackNoEffectAgainst: ['ghost'], defenseWeakTo: ['fighting'], defenseResists: [], defenseImmuneTo: ['ghost'] },
    fire: { attackEffectiveAgainst: ['grass', 'ice', 'bug', 'steel'], attackNotVeryEffectiveAgainst: ['fire', 'water', 'rock', 'dragon'], attackNoEffectAgainst: [], defenseWeakTo: ['water', 'ground', 'rock'], defenseResists: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], defenseImmuneTo: [] },
    water: { attackEffectiveAgainst: ['fire', 'ground', 'rock'], attackNotVeryEffectiveAgainst: ['water', 'grass', 'dragon'], attackNoEffectAgainst: [], defenseWeakTo: ['grass', 'electric'], defenseResists: ['fire', 'water', 'ice', 'steel'], defenseImmuneTo: [] },
    grass: { attackEffectiveAgainst: ['water', 'ground', 'rock'], attackNotVeryEffectiveAgainst: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], attackNoEffectAgainst: [], defenseWeakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], defenseResists: ['water', 'grass', 'electric', 'ground'], defenseImmuneTo: [] },
    electric: { attackEffectiveAgainst: ['water', 'flying'], attackNotVeryEffectiveAgainst: ['grass', 'electric', 'dragon'], attackNoEffectAgainst: ['ground'], defenseWeakTo: ['ground'], defenseResists: ['electric', 'flying', 'steel'], defenseImmuneTo: [] },
    ice: { attackEffectiveAgainst: ['grass', 'ground', 'flying', 'dragon'], attackNotVeryEffectiveAgainst: ['fire', 'water', 'ice', 'steel'], attackNoEffectAgainst: [], defenseWeakTo: ['fire', 'fighting', 'rock', 'steel'], defenseResists: ['ice'], defenseImmuneTo: [] },
    fighting: { attackEffectiveAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'], attackNotVeryEffectiveAgainst: ['poison', 'flying', 'psychic', 'bug', 'fairy'], attackNoEffectAgainst: ['ghost'], defenseWeakTo: ['flying', 'psychic', 'fairy'], defenseResists: ['bug', 'rock', 'dark'], defenseImmuneTo: [] },
    poison: { attackEffectiveAgainst: ['grass', 'fairy'], attackNotVeryEffectiveAgainst: ['poison', 'ground', 'rock', 'ghost'], attackNoEffectAgainst: ['steel'], defenseWeakTo: ['ground', 'psychic'], defenseResists: ['grass', 'fighting', 'poison', 'bug', 'fairy'], defenseImmuneTo: [] },
    ground: { attackEffectiveAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'], attackNotVeryEffectiveAgainst: ['grass', 'bug'], attackNoEffectAgainst: ['flying'], defenseWeakTo: ['water', 'grass', 'ice'], defenseResists: ['poison', 'rock'], defenseImmuneTo: ['electric'] },
    flying: { attackEffectiveAgainst: ['grass', 'fighting', 'bug'], attackNotVeryEffectiveAgainst: ['electric', 'rock', 'steel'], attackNoEffectAgainst: [], defenseWeakTo: ['electric', 'ice', 'rock'], defenseResists: ['grass', 'fighting', 'bug'], defenseImmuneTo: ['ground'] },
    psychic: { attackEffectiveAgainst: ['fighting', 'poison'], attackNotVeryEffectiveAgainst: ['psychic', 'steel'], attackNoEffectAgainst: ['dark'], defenseWeakTo: ['bug', 'ghost', 'dark'], defenseResists: ['fighting', 'psychic'], defenseImmuneTo: [] },
    bug: { attackEffectiveAgainst: ['grass', 'psychic', 'dark'], attackNotVeryEffectiveAgainst: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], attackNoEffectAgainst: [], defenseWeakTo: ['fire', 'flying', 'rock'], defenseResists: ['grass', 'fighting', 'ground'], defenseImmuneTo: [] },
    rock: { attackEffectiveAgainst: ['fire', 'ice', 'flying', 'bug'], attackNotVeryEffectiveAgainst: ['fighting', 'ground', 'steel'], attackNoEffectAgainst: [], defenseWeakTo: ['water', 'grass', 'fighting', 'ground', 'steel'], defenseResists: ['normal', 'fire', 'poison', 'flying'], defenseImmuneTo: [] },
    ghost: { attackEffectiveAgainst: ['psychic', 'ghost'], attackNotVeryEffectiveAgainst: ['dark'], attackNoEffectAgainst: ['normal'], defenseWeakTo: ['ghost', 'dark'], defenseResists: ['poison', 'bug'], defenseImmuneTo: ['normal', 'fighting'] },
    dragon: { attackEffectiveAgainst: ['dragon'], attackNotVeryEffectiveAgainst: ['steel'], attackNoEffectAgainst: ['fairy'], defenseWeakTo: ['ice', 'dragon', 'fairy'], defenseResists: ['fire', 'water', 'grass', 'electric'], defenseImmuneTo: [] },
    dark: { attackEffectiveAgainst: ['psychic', 'ghost'], attackNotVeryEffectiveAgainst: ['fighting', 'dark', 'fairy'], attackNoEffectAgainst: [], defenseWeakTo: ['fighting', 'bug', 'fairy'], defenseResists: ['ghost', 'dark'], defenseImmuneTo: ['psychic'] },
    steel: { attackEffectiveAgainst: ['ice', 'rock', 'fairy'], attackNotVeryEffectiveAgainst: ['fire', 'water', 'electric', 'steel'], attackNoEffectAgainst: [], defenseWeakTo: ['fire', 'fighting', 'ground'], defenseResists: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], defenseImmuneTo: ['poison'] },
    fairy: { attackEffectiveAgainst: ['fighting', 'dragon', 'dark'], attackNotVeryEffectiveAgainst: ['fire', 'poison', 'steel'], attackNoEffectAgainst: [], defenseWeakTo: ['poison', 'steel'], defenseResists: ['fighting', 'bug', 'dark'], defenseImmuneTo: ['dragon'] }
};

const TYPE_ICON_BASE_URL = 'https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@main/icons/';
const POKEWIKI_URL_BASE = 'https://www.pokewiki.de/';
const BASE_API_URL = 'https://pokeapi.co/api/v2/';

const POKEMON_LIMIT = 1300;
const MIN_EXPECTED_POKEMON_COUNT = 1000;
const MAX_TEAM_SIZE = 6;

// Cache Keys
const CACHE_KEY = 'pokemonGeneratorCache_v5';
const LOCKED_POKEMON_CACHE_KEY = 'lockedPokemonIds_v1';
const FILTER_STATE_CACHE_KEY = 'pokemonGeneratorFilterState_v1';
const TEAM_MEMBERS_CACHE_KEY = 'pokemonTeamMembers_v1';
const SHINY_POKEMON_CACHE_KEY = 'shinyPokemonIds_v1';

// Icons
const ICON_SELECT_ALL = 'fa-solid fa-square-check';
const ICON_DESELECT_ALL = 'fa-solid fa-square-minus';
