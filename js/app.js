// --- Global State Variables ---
// Import IndexedDB helper functions
import { initDB, saveData, loadData, clearData, POKEMON_STORE_NAME, DB_NAME } from './indexeddb-helper.js'; // Added DB_NAME

let dbInstance = null; // To hold the initialized DB object

const pokemonData = [];
let displayedPokemonList = [];
let hasGeneratedAtLeastOnce = false;
let currentTeam = [];
let isDetailedAnalysisVisible = false;
const evolutionChains = new Map();
let isLoading = false;
let lockedPokemonIds = new Set();
let shinyPokemonIds = new Set();
let countForNewPokemons = 10;
let currentSortCriteria = 'id';
let currentSortDirection = 'asc';
let allFiltersExpanded = false; // Default to collapsed

// --- DOM Element References ---
const loadingProgressContainer = document.getElementById('loading-progress-container');
const loadingProgressBarElement = document.getElementById('loading-progress-bar');
const loadingProgressTextElement = document.getElementById('loading-progress-text');
const lockedPokemonSectionContainer = document.getElementById('locked-pokemon-section-container');
const lockedPokemonResultsContainer = document.getElementById('locked-pokemon-results');
const resultsContainer = document.getElementById('results');
const controlsDiv = document.querySelector('.controls');
const mainGenerateBtn = document.getElementById('generate');
const stickyGenerateBtn = document.getElementById('stickyGenerateBtn');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const sortingControls = document.getElementById('sorting-controls');
const sortDirectionIcon = document.getElementById('sort-direction');
const clearCacheBtn = document.getElementById('clearCacheBtn');
const teamBuilderSectionContainer = document.getElementById('team-builder-section-container');
const teamBuilderResultsContainer = document.getElementById('team-builder-results');
const teamAnalysisSimpleContainer = document.getElementById('team-analysis-simple');
const teamAnalysisDetailedContainer = document.getElementById('team-analysis-detailed');
const toggleAnalysisViewBtn = document.getElementById('toggle-analysis-view-btn');
const nameFilterContainer = document.getElementById('name-filter-container');
const nameFilterInput = document.getElementById('nameFilter');
const countInput = document.getElementById('count');
const statusElement = document.getElementById('status');
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleAllFiltersButton = document.getElementById('toggleAllFiltersBtn');


// --- Core Functions ---

function updateToggleIcon(groupClass) {
    const iconElement = document.querySelector(`.toggle-all-icon[data-group="${groupClass}"]`);
    if (!iconElement) return;
    const checkboxesInGroup = document.querySelectorAll(`.${groupClass}`);
    if (checkboxesInGroup.length === 0) {
        iconElement.className = 'toggle-all-icon';
        iconElement.title = ''; return;
    }
    const allSelected = Array.from(checkboxesInGroup).every(cb => cb.checked);
    iconElement.className = `toggle-all-icon ${allSelected ? ICON_DESELECT_ALL : ICON_SELECT_ALL}`;
    // Ensure translations and currentLang are accessible (loaded from i18n.js)
    iconElement.title = translations[currentLang][allSelected ? 'tooltipDeselectAll' : 'tooltipSelectAll'];
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    updateDarkModeIcon(isDarkMode);
}

function updateDarkModeIcon(isDarkMode) {
    if (darkModeToggle) darkModeToggle.className = `fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`;
}

function getEvolutionStage(pokemonName, chain, stage = 0) {
    const cleanPokemonName = pokemonName.split('-')[0];
    if (chain && chain.species && chain.species.name && chain.species.name.split('-')[0] === cleanPokemonName) return stage;
    if (chain && chain.evolves_to) {
        for (const evolvesTo of chain.evolves_to) {
            const foundStage = getEvolutionStage(cleanPokemonName, evolvesTo, stage + 1);
            if (foundStage !== -1) return foundStage;
        }
    }
    return -1;
}

function countStagesInChain(chain) {
    let maxDepth = 0;
    function traverse(currentChain, currentDepth) {
        maxDepth = Math.max(maxDepth, currentDepth);
        if (currentChain.evolves_to) currentChain.evolves_to.forEach(evolvesTo => traverse(evolvesTo, currentDepth + 1));
    }
    if (chain) traverse(chain, 1);
    return maxDepth;
}

async function fetchPokemonDataFromAPI() {
    isLoading = true;
    mainGenerateBtn.disabled = true;
    stickyGenerateBtn.disabled = true;
    statusElement.textContent = translations[currentLang].loadingData;

    const cachedDataJSON = localStorage.getItem(CACHE_KEY);
    if (cachedDataJSON) {
        try {
            const cachedData = JSON.parse(cachedDataJSON);
            if (cachedData.pokemon && cachedData.pokemon.length >= MIN_EXPECTED_POKEMON_COUNT &&
                cachedData.pokemon.every(p => p && // Ensure pokemon object itself is not null/undefined
                    p.hasOwnProperty('baseStatTotal') &&
                    p.hasOwnProperty('isMega') &&
                    p.hasOwnProperty('isAlolan') &&
                    p.hasOwnProperty('isDefaultForm') && // Existing checks
                    p.hasOwnProperty('image_url') &&    // New check
                    p.hasOwnProperty('shiny_image_url') &&// New check
                    p.hasOwnProperty('icon_url')))     // New check
            {
                pokemonData.push(...cachedData.pokemon);
                if (loadingProgressContainer) loadingProgressContainer.style.display = 'none';
                isLoading = false;
                mainGenerateBtn.disabled = false;
                stickyGenerateBtn.disabled = false;
                statusElement.textContent = translations[currentLang].loadedFromCache;
                validateLockedPokemonIds();
                return; // Exit early if valid cache found
            } else {
                console.warn(`Cached Pokémon data is incomplete, outdated, or contains invalid entries. Forcing API refresh.`);
                localStorage.removeItem(CACHE_KEY);
            }
        } catch (e) {
            console.error("Error parsing cached Pokémon data:", e);
            localStorage.removeItem(CACHE_KEY);
        }
    }

    // --- Fetching logic (identical to original, ensure BASE_API_URL, POKEMON_LIMIT, etc. are available from pokedex-data.js) ---
    if (loadingProgressContainer) loadingProgressContainer.style.display = 'block';
    if (loadingProgressBarElement) loadingProgressBarElement.style.width = '0%';
    if (loadingProgressTextElement) loadingProgressTextElement.textContent = translations[currentLang].progressText(0, POKEMON_LIMIT);
    let loadedCount = 0, totalToLoad = 0;
    try {
        const response = await fetch(`${BASE_API_URL}pokemon?limit=${POKEMON_LIMIT}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        totalToLoad = data.results.length;
        if (loadingProgressTextElement) loadingProgressTextElement.textContent = translations[currentLang].progressText(0, totalToLoad);
        const pokemonDetailsPromises = data.results.map(async (p) => {
            let pokemonDetail = null;
            try {
                const detailResponse = await fetch(p.url);
                if (!detailResponse.ok) throw new Error(`Detail fetch for ${p.name} failed: ${detailResponse.status}`);
                const detailData = await detailResponse.json();

                const speciesResponse = await fetch(detailData.species.url);
                if (!speciesResponse.ok) throw new Error(`Species fetch for ${p.name} failed: ${speciesResponse.status}`);
                const speciesData = await speciesResponse.json();
                const generationUrl = speciesData.generation ? speciesData.generation.url : null;
                let generation = generationUrl ? parseInt(generationUrl.match(/\/generation\/(\d+)\//)?.[1] || 0) : null;

                let evolutionChainData = null, totalStages = 0;
                if (speciesData.evolution_chain && speciesData.evolution_chain.url) {
                    const chainUrl = speciesData.evolution_chain.url;
                    if (evolutionChains.has(chainUrl)) evolutionChainData = evolutionChains.get(chainUrl);
                    else {
                        try {
                            const chainResponse = await fetch(chainUrl);
                            if (chainResponse.ok) { evolutionChainData = await chainResponse.json(); evolutionChains.set(chainUrl, evolutionChainData); }
                        } catch (chainError) { console.warn(`Evo chain fetch error for ${p.name}:`, chainError); }
                    }
                    if (evolutionChainData) totalStages = countStagesInChain(evolutionChainData.chain);
                } else if (!speciesData.evolves_from_species) totalStages = 1;

                let evolutionStage = -1;
                if (evolutionChainData) evolutionStage = getEvolutionStage(detailData.name, evolutionChainData.chain);
                else if (!speciesData.evolves_from_species) evolutionStage = 0;

                let baseStatTotal = 0;
                if (detailData.stats && Array.isArray(detailData.stats)) {
                    detailData.stats.forEach(statInfo => {
                        baseStatTotal += statInfo.base_stat;
                    });
                }

                pokemonDetail = {
                    id: detailData.id, name: detailData.name,
                    germanName: speciesData.names.find(name => name.language.name === 'de')?.name || null,
                    types: detailData.types.map(typeInfo => typeInfo.type.name),
                    // sprites: detailData.sprites, // Removed
                    // image: detailData.sprites.other?.['official-artwork']?.front_default || detailData.sprites.front_default, // Removed
                    // shinyImage: detailData.sprites.other?.['official-artwork']?.front_shiny || detailData.sprites.front_shiny, // Removed
                    image_url: detailData.sprites.other?.['official-artwork']?.front_default || detailData.sprites.front_default || 'https://placehold.co/120x120/e0e0e0/333?text=Image+Missing',
                    shiny_image_url: detailData.sprites.other?.['official-artwork']?.front_shiny || detailData.sprites.front_shiny || 'https://placehold.co/120x120/e0e0e0/333?text=Shiny+Missing',
                    icon_url: detailData.sprites.versions?.['generation-vii']?.icons?.front_default || detailData.sprites.front_default || 'https://placehold.co/32x32/e0e0e0/333?text=?',
                    generation, evolutionStage, totalStages,
                    isLegendary: speciesData.is_legendary,
                    isMythical: speciesData.is_mythical,
                    isMega: detailData.name.includes('-mega'),
                    isAlolan: detailData.name.includes('-alola'),
                    isDefaultForm: detailData.is_default,
                    baseStatTotal
                };
            } catch (error) { console.warn(`Error processing ${p.name}: ${error.message}`);}
            finally {
                loadedCount++;
                const progressPercent = totalToLoad > 0 ? (loadedCount / totalToLoad) * 100 : 0;
                if (loadingProgressBarElement) loadingProgressBarElement.style.width = `${progressPercent}%`;
                if (loadingProgressTextElement) loadingProgressTextElement.textContent = translations[currentLang].progressText(loadedCount, totalToLoad);
            }
            return pokemonDetail;
        });
        const results = await Promise.all(pokemonDetailsPromises);
        pokemonData.push(...results.filter(p => p !== null && p.baseStatTotal > 0));
        pokemonData.sort((a, b) => a.id - b.id);
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ pokemon: pokemonData }));
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                console.warn("QuotaExceededError: Could not cache Pokémon data. App will use in-memory data for this session.");
                if (statusElement) { // Ensure statusElement exists
                    statusElement.textContent = translations[currentLang].quotaExceededError || 'Storage limit reached. Pokémon data could not be fully saved offline.';
                }
            } else {
                console.error("Error saving Pokémon data to cache:", e);
                // Optionally, inform the user of a generic cache error if desired
            }
        }
    } catch (error) { console.error("Fehler beim Laden der Pokémon-Daten:", error); statusElement.textContent = `${translations[currentLang].loadingError} ${error.message}`; }
    finally {
        isLoading = false;
        mainGenerateBtn.disabled = false;
        stickyGenerateBtn.disabled = false;
        if (loadingProgressContainer) loadingProgressContainer.style.display = 'none';
        validateLockedPokemonIds();
    }
}

function filterPokemon() {
    let filtered = [...pokemonData];
    const selectedGens = Array.from(document.querySelectorAll('.gen-checkbox:checked')).map(cb => parseInt(cb.value));
    if (selectedGens.length === 0 && document.querySelectorAll('.gen-checkbox').length > 0) return [];
    if (selectedGens.length > 0) filtered = filtered.filter(p => p.generation !== null && selectedGens.includes(p.generation));

    const selectedTypes = Array.from(document.querySelectorAll('.type-checkbox:checked')).map(cb => cb.id);
    if (selectedTypes.length === 0 && document.querySelectorAll('.type-checkbox').length > 0) return [];
    if (selectedTypes.length > 0) filtered = filtered.filter(p => p.types.some(type => selectedTypes.includes(type)));

    const selectedEvoPositions = Array.from(document.querySelectorAll('.evo-position-checkbox:checked')).map(cb => parseInt(cb.value));
    if (selectedEvoPositions.length === 0 && document.querySelectorAll('.evo-position-checkbox').length > 0) return [];
    if (selectedEvoPositions.length > 0) filtered = filtered.filter(p => selectedEvoPositions.includes(p.evolutionStage));

    const selectedChainLengths = Array.from(document.querySelectorAll('.chain-length-checkbox:checked')).map(cb => parseInt(cb.value));
    if (selectedChainLengths.length === 0 && document.querySelectorAll('.chain-length-checkbox').length > 0) return [];
    if (selectedChainLengths.length > 0) filtered = filtered.filter(p => selectedChainLengths.includes(p.totalStages));

    const includeLegendary = document.getElementById('includeLegendary').checked;
    const includeMythical = document.getElementById('includeMythical').checked;
    const includeMega = document.getElementById('includeMega').checked;
    const includeAlolan = document.getElementById('includeAlolan').checked;

    filtered = filtered.filter(p => {
        if (p.isLegendary && !includeLegendary) return false;
        if (p.isMythical && !includeMythical) return false;
        if (p.isMega && !includeMega) return false;
        if (p.isAlolan && !includeAlolan) return false;

        // Logic to handle non-default forms: Only include if explicitly checked or if it's a base legendary/mythical
        if (!p.isDefaultForm) {
            const isExplicitlyIncludedSpecialForm =
                (p.isMega && includeMega) ||
                (p.isAlolan && includeAlolan) ||
                // Include legendary/mythical forms only if the base filter is checked
                (p.isLegendary && includeLegendary) ||
                (p.isMythical && includeMythical);

            if (!isExplicitlyIncludedSpecialForm) return false; // Exclude non-default forms if their category isn't checked
        }

        return true;
    });


    const bstMinInput = document.getElementById('bstMin');
    const bstMaxInput = document.getElementById('bstMax');
    const bstMin = bstMinInput && bstMinInput.value !== "" ? parseInt(bstMinInput.value) : null;
    const bstMax = bstMaxInput && bstMaxInput.value !== "" ? parseInt(bstMaxInput.value) : null;

    if (bstMin !== null && !isNaN(bstMin)) {
        filtered = filtered.filter(p => p.baseStatTotal !== undefined && p.baseStatTotal >= bstMin);
    }
    if (bstMax !== null && !isNaN(bstMax)) {
        filtered = filtered.filter(p => p.baseStatTotal !== undefined && p.baseStatTotal <= bstMax);
    }

    return filtered;
}

function validateLockedPokemonIds() {
    if (pokemonData.length > 0 && lockedPokemonIds.size > 0) {
        const currentPokemonIds = new Set(pokemonData.map(p => p.id));
        let changed = false;
        const validLockedIds = [];
        lockedPokemonIds.forEach(id => {
            if (currentPokemonIds.has(id)) {
                validLockedIds.push(id);
            } else {
                changed = true; // ID was invalid
            }
        });
        if (changed) {
            lockedPokemonIds = new Set(validLockedIds);
            localStorage.setItem(LOCKED_POKEMON_CACHE_KEY, JSON.stringify(Array.from(lockedPokemonIds)));
            console.warn("Removed invalid IDs from locked Pokémon list.");
        }
    }
}

async function fetchPokemonDataFromAPI() {
    isLoading = true;
    mainGenerateBtn.disabled = true;
    stickyGenerateBtn.disabled = true;
    statusElement.textContent = translations[currentLang].loadingData;

    if (dbInstance) {
        try {
            const cachedStoreData = await loadData(dbInstance, POKEMON_STORE_NAME, 'mainCache');
            if (cachedStoreData && cachedStoreData.pokemon) { // Check cachedStoreData directly
                const cachedData = cachedStoreData; // Use the direct object from loadData
                 if (cachedData.pokemon && cachedData.pokemon.length >= MIN_EXPECTED_POKEMON_COUNT &&
                    cachedData.pokemon.every(p => p &&
                        p.hasOwnProperty('baseStatTotal') &&
                        p.hasOwnProperty('isMega') &&
                        p.hasOwnProperty('isAlolan') &&
                        p.hasOwnProperty('isDefaultForm') &&
                        p.hasOwnProperty('image_url') &&
                        p.hasOwnProperty('shiny_image_url') &&
                        p.hasOwnProperty('icon_url')))
                {
                    pokemonData.push(...cachedData.pokemon);
                    if (loadingProgressContainer) loadingProgressContainer.style.display = 'none';
                    isLoading = false;
                    mainGenerateBtn.disabled = false;
                    stickyGenerateBtn.disabled = false;
                    statusElement.textContent = translations[currentLang].loadedFromCache;
                    validateLockedPokemonIds();
                    return; // Exit early if valid cache found
                } else {
                    console.warn(`Cached Pokémon data in IndexedDB is incomplete, outdated, or contains invalid entries. Forcing API refresh.`);
                    await clearData(dbInstance, POKEMON_STORE_NAME, 'mainCache'); // Clear invalid cache from IndexedDB
                }
            }
        } catch (e) {
            console.error("Error loading Pokémon data from IndexedDB:", e);
            // Fall through to API fetch
        }
    } else {
        console.warn("DB instance not available for fetching Pokémon data. Attempting API fetch.");
    }

    // --- Fetching logic ---
    if (loadingProgressContainer) loadingProgressContainer.style.display = 'block';
    if (loadingProgressBarElement) loadingProgressBarElement.style.width = '0%';
    if (loadingProgressTextElement) loadingProgressTextElement.textContent = translations[currentLang].progressText(0, POKEMON_LIMIT);
    let loadedCount = 0, totalToLoad = 0;
    try {
        const response = await fetch(`${BASE_API_URL}pokemon?limit=${POKEMON_LIMIT}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        totalToLoad = data.results.length;
        if (loadingProgressTextElement) loadingProgressTextElement.textContent = translations[currentLang].progressText(0, totalToLoad);
        const pokemonDetailsPromises = data.results.map(async (p) => {
            let pokemonDetail = null;
            try {
                const detailResponse = await fetch(p.url);
                if (!detailResponse.ok) throw new Error(`Detail fetch for ${p.name} failed: ${detailResponse.status}`);
                const detailData = await detailResponse.json();

                const speciesResponse = await fetch(detailData.species.url);
                if (!speciesResponse.ok) throw new Error(`Species fetch for ${p.name} failed: ${speciesResponse.status}`);
                const speciesData = await speciesResponse.json();
                const generationUrl = speciesData.generation ? speciesData.generation.url : null;
                let generation = generationUrl ? parseInt(generationUrl.match(/\/generation\/(\d+)\//)?.[1] || 0) : null;

                let evolutionChainData = null, totalStages = 0;
                if (speciesData.evolution_chain && speciesData.evolution_chain.url) {
                    const chainUrl = speciesData.evolution_chain.url;
                    if (evolutionChains.has(chainUrl)) evolutionChainData = evolutionChains.get(chainUrl);
                    else {
                        try {
                            const chainResponse = await fetch(chainUrl);
                            if (chainResponse.ok) { evolutionChainData = await chainResponse.json(); evolutionChains.set(chainUrl, evolutionChainData); }
                        } catch (chainError) { console.warn(`Evo chain fetch error for ${p.name}:`, chainError); }
                    }
                    if (evolutionChainData) totalStages = countStagesInChain(evolutionChainData.chain);
                } else if (!speciesData.evolves_from_species) totalStages = 1;

                let evolutionStage = -1;
                if (evolutionChainData) evolutionStage = getEvolutionStage(detailData.name, evolutionChainData.chain);
                else if (!speciesData.evolves_from_species) evolutionStage = 0;

                let baseStatTotal = 0;
                if (detailData.stats && Array.isArray(detailData.stats)) {
                    detailData.stats.forEach(statInfo => {
                        baseStatTotal += statInfo.base_stat;
                    });
                }

                pokemonDetail = {
                    id: detailData.id, name: detailData.name,
                    germanName: speciesData.names.find(name => name.language.name === 'de')?.name || null,
                    types: detailData.types.map(typeInfo => typeInfo.type.name),
                    image_url: detailData.sprites.other?.['official-artwork']?.front_default || detailData.sprites.front_default || 'https://placehold.co/120x120/e0e0e0/333?text=Image+Missing',
                    shiny_image_url: detailData.sprites.other?.['official-artwork']?.front_shiny || detailData.sprites.front_shiny || 'https://placehold.co/120x120/e0e0e0/333?text=Shiny+Missing',
                    icon_url: detailData.sprites.versions?.['generation-vii']?.icons?.front_default || detailData.sprites.front_default || 'https://placehold.co/32x32/e0e0e0/333?text=?',
                    generation, evolutionStage, totalStages,
                    isLegendary: speciesData.is_legendary,
                    isMythical: speciesData.is_mythical,
                    isMega: detailData.name.includes('-mega'),
                    isAlolan: detailData.name.includes('-alola'),
                    isDefaultForm: detailData.is_default,
                    baseStatTotal
                };
            } catch (error) { console.warn(`Error processing ${p.name}: ${error.message}`);}
            finally {
                loadedCount++;
                const progressPercent = totalToLoad > 0 ? (loadedCount / totalToLoad) * 100 : 0;
                if (loadingProgressBarElement) loadingProgressBarElement.style.width = `${progressPercent}%`;
                if (loadingProgressTextElement) loadingProgressTextElement.textContent = translations[currentLang].progressText(loadedCount, totalToLoad);
            }
            return pokemonDetail;
        });
        const results = await Promise.all(pokemonDetailsPromises);
        pokemonData.push(...results.filter(p => p !== null && p.baseStatTotal > 0));
        pokemonData.sort((a, b) => a.id - b.id);

        if (dbInstance) {
            try {
                await saveData(dbInstance, POKEMON_STORE_NAME, { id: 'mainCache', pokemon: pokemonData });
                // Attempt to remove any known old localStorage cache keys for Pokémon data.
                localStorage.removeItem('pokemonCache'); // Common key used previously or as a fallback.
                // If CACHE_KEY was a specific constant from another file (e.g., pokedex-data.js)
                // and that file/constant is still part of the build, it could be referenced directly.
                // However, to avoid dependency or undefined errors if it's removed,
                // we'll rely on specific known keys or a general cleanup strategy.
                // For this example, 'pokemonCache' is assumed to be a primary old key.
                // If a global CACHE_KEY variable exists and is imported, it could be used:
                // if (typeof CACHE_KEY !== 'undefined') localStorage.removeItem(CACHE_KEY);
                console.log("Pokémon data saved to IndexedDB. Old localStorage cache for Pokémon data (if any) removed.");
            } catch (e) {
                console.error("Error saving Pokémon data to IndexedDB:", e);
                if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                     console.warn("QuotaExceededError with IndexedDB: Could not cache Pokémon data. App will use in-memory data for this session.");
                    if (statusElement) {
                        statusElement.textContent = translations[currentLang].quotaExceededError || 'Storage limit reached. Pokémon data could not be fully saved offline.';
                    }
                }
            }
        } else {
            console.warn("DB instance not available for saving Pokémon data.");
        }
    } catch (error) { console.error("Fehler beim Laden der Pokémon-Daten:", error); statusElement.textContent = `${translations[currentLang].loadingError} ${error.message}`; }
    finally {
        isLoading = false;
        mainGenerateBtn.disabled = false;
        stickyGenerateBtn.disabled = false;
        if (loadingProgressContainer) loadingProgressContainer.style.display = 'none';
        validateLockedPokemonIds();
    }
}

function createPokemonCard(pokemon, isTeamMemberCard = false) {
    // Make sure translations, currentLang, TYPE_ICON_BASE_URL etc. are accessible
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    if (!isTeamMemberCard) {
        card.id = `card-${pokemon.id}`;
    }

    let displayedNameOnCard = capitalizeFirstLetter(pokemon.name);
    if (currentLang === 'de') {
        if (pokemon.germanName) {
            displayedNameOnCard = pokemon.germanName;
            if (pokemon.isMega && !pokemon.germanName.toLowerCase().startsWith('mega-')) {
                displayedNameOnCard = `Mega-${pokemon.germanName}`;
            } else if (pokemon.isAlolan && !pokemon.germanName.toLowerCase().startsWith('alola-')) {
                displayedNameOnCard = `Alola-${pokemon.germanName}`;
            }
        } else { // Fallback for missing German name but special form
            let baseNameForDisplay = pokemon.name;
            if (pokemon.isMega) {
                baseNameForDisplay = pokemon.name.replace(/-mega(-x|-y)?/, ''); // More robust removal
                if (pokemon.name.includes('-mega-x')) baseNameForDisplay = `${baseNameForDisplay} X`;
                else if (pokemon.name.includes('-mega-y')) baseNameForDisplay = `${baseNameForDisplay} Y`;
                displayedNameOnCard = `Mega-${capitalizeFirstLetter(baseNameForDisplay)}`;
            } else if (pokemon.isAlolan) {
                baseNameForDisplay = pokemon.name.replace('-alola', '');
                displayedNameOnCard = `Alola-${capitalizeFirstLetter(baseNameForDisplay)}`;
            } else {
                displayedNameOnCard = capitalizeFirstLetter(pokemon.name); // Default English name
            }
        }
    }

    let nameForPokeWikiLink = pokemon.name;
    // Simplify name for link (remove form suffixes)
    nameForPokeWikiLink = nameForPokeWikiLink.replace(/-mega(-x|-y)?|-alola|-galar|-hisui|-paldea-.+|-therian|-incarnate|-origin|-altered|-sky|-standard|-aria|-pirouette|-active|-defense|-speed|-attack|-zen|-daruma|-resolute|-ordinary|-black|-white|-crowned|-eternamax|-rapid-strike|-single-strike|-hangry|-phony|-antique|-starter|-dada|-libre|-phd|-pop-star|-belle|-rock-star|-cosplay|-amped|-low-key|-armor|-striped-.+|-gulping|-gorging|-ice|-noice|-full-belly|-zero-to-hero|-hero|-family-of-three|-family-of-four|-combat-breed|-blaze-breed|-aqua-breed|-wellspring-mask|-hearthflame-mask|-cornerstone-mask|-unbound|-stellar$/, '');

    const capitalizedNameForLink = capitalizeFirstLetter(nameForPokeWikiLink);
    const pokemonWikiUrl = `${POKEWIKI_URL_BASE}${encodeURIComponent(capitalizedNameForLink)}`;

    const typeHtml = pokemon.types.map(type => {
        const typeNameTranslated = translations[currentLang][`type_${type}`] || capitalizeFirstLetter(type);
        const typeAltText = `${typeNameTranslated} ${translations[currentLang].typesLabelShort || 'Type'}`;
        return `
            <div class="pokemon-type-item" title="${typeNameTranslated}">
                <img src="${TYPE_ICON_BASE_URL}${type}.svg" class="type-icon" alt="${typeAltText}">
                <span class="pokemon-type-name">${typeNameTranslated}</span>
            </div>`;
    }).join('');

    let evolutionText = `${translations[currentLang].cardEvolution}: Unbekannt`;
    if (pokemon.evolutionStage !== -1 && pokemon.totalStages !== undefined && pokemon.totalStages > 0) {
        if (pokemon.totalStages === 1) {
            evolutionText = `${translations[currentLang].cardEvolution}: ${translations[currentLang].evo_basic} ${translations[currentLang].cardEvolutionNoEvo}`;
        } else {
            const stageText = translations[currentLang][`evo_stage${pokemon.evolutionStage}`] || `${translations[currentLang].cardEvolutionStage} ${pokemon.evolutionStage + 1}`; // +1 for 1-based display
            const totalStagesText = `(${pokemon.totalStages} ${translations[currentLang].cardTotalStages || 'Stages'})`; // Simplified for space
            evolutionText = `${translations[currentLang].cardEvolution}: ${stageText}`; // ${totalStagesText} - commented out total stages for brevity
        }
    }


    const isCurrentlyLocked = lockedPokemonIds.has(pokemon.id);
    const lockIconClass = `fa-solid ${isCurrentlyLocked ? 'fa-lock locked' : 'fa-unlock'}`;
    const lockIconTitle = isCurrentlyLocked ? translations[currentLang].tooltipUnlock : translations[currentLang].tooltipLock;

    const isInTeam = currentTeam.some(member => member.id === pokemon.id);
    const teamActionIconClass = `fa-solid ${isInTeam ? 'fa-minus' : 'fa-plus'}`;
    const teamActionIconTitle = isInTeam ? translations[currentLang].removeFromTeamTooltip : translations[currentLang].addToTeamTooltip;

    const removeFromTeamOnCardIcon = `<i class="fa-solid fa-times-circle team-remove-on-card-icon" data-pokemon-id="${pokemon.id}" title="${translations[currentLang].removeFromTeamOnTeamCardTooltip}"></i>`;

    const isInitiallyShiny = shinyPokemonIds.has(pokemon.id);
    const currentImageSrc = isInitiallyShiny && pokemon.shiny_image_url ? pokemon.shiny_image_url : (pokemon.image_url || 'https://placehold.co/120x120/e0e0e0/333?text=Image+Missing');


    let specialStatuses = [];
    if (pokemon.isLegendary) specialStatuses.push(translations[currentLang].includeLegendaryLabel);
    if (pokemon.isMythical) specialStatuses.push(translations[currentLang].includeMythicalLabel);
    if (pokemon.isMega) specialStatuses.push(translations[currentLang].includeMegaLabel);
    if (pokemon.isAlolan) specialStatuses.push(translations[currentLang].includeAlolanLabel);


    card.innerHTML = `
        <div class="pokemon-image">
            ${!isTeamMemberCard ? `<i class="${lockIconClass} lock-icon" data-pokemon-id="${pokemon.id}" title="${lockIconTitle}"></i>` : ''}
            ${isTeamMemberCard ? removeFromTeamOnCardIcon : ''}
            <img src="${currentImageSrc}"
                 alt="${displayedNameOnCard}"
                 loading="lazy"
                 data-pokemon-id="${pokemon.id}"
                 data-normal="${pokemon.image_url || 'https://placehold.co/120x120/e0e0e0/333?text=Image+Missing'}"
                 data-shiny="${pokemon.shiny_image_url || 'https://placehold.co/120x120/e0e0e0/333?text=Shiny+Missing'}"
                 onerror="this.onerror=null; this.src='https://placehold.co/120x120/e0e0e0/333?text=Error'; this.dataset.normal='https://placehold.co/120x120/e0e0e0/333?text=Image+Missing';this.dataset.shiny='https://placehold.co/120x120/e0e0e0/333?text=Shiny+Missing';">
            <span class="shiny-indicator ${isInitiallyShiny && pokemon.shiny_image_url && pokemon.shiny_image_url !== 'https://placehold.co/120x120/e0e0e0/333?text=Shiny+Missing' ? 'active' : ''}">✨</span>
        </div>
        <div class="pokemon-info">
            <h3 class="pokemon-name"><a href="${pokemonWikiUrl}" target="_blank" class="pokedex-link">#${pokemon.id} ${displayedNameOnCard}</a></h3>
            <div class="pokemon-meta-details">
                ${!isTeamMemberCard ? `<p class="pokemon-detail-item">${translations[currentLang].cardGeneration}: ${pokemon.generation !== null ? pokemon.generation : 'Unknown'}</p>` : ''}
                ${!isTeamMemberCard ? `<p class="pokemon-detail-item">${evolutionText}</p>` : ''}
                ${!isTeamMemberCard && pokemon.baseStatTotal !== undefined ? `<p class="pokemon-detail-item">${translations[currentLang].cardBST || 'BST'}: ${pokemon.baseStatTotal}</p>` : ''}
            </div>
            <div class="pokemon-types">${typeHtml}</div>
             ${!isTeamMemberCard && specialStatuses.length > 0 ? `<p class="pokemon-special-status">${specialStatuses.join(', ')}</p>` : ''}
        </div>
        ${!isTeamMemberCard ? `<i class="${teamActionIconClass} team-action-icon ${isInTeam ? 'in-team' : ''}" data-pokemon-id="${pokemon.id}" title="${teamActionIconTitle}"></i>` : ''}
    `;

    // Add event listeners after setting innerHTML
    const imgElement = card.querySelector('.pokemon-image img');
    if (imgElement) {
        imgElement.addEventListener('click', () => toggleShiny(imgElement, pokemon.id));
    }


    if (!isTeamMemberCard) {
        const lockIconEl = card.querySelector('.lock-icon');
        if (lockIconEl) {
            lockIconEl.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleLockPokemon(pokemon.id);
            });
        }
        const teamActionIconEl = card.querySelector('.team-action-icon');
        if (teamActionIconEl) {
            teamActionIconEl.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTeamMember(pokemon.id);
            });
        }
    } else {
        const removeIconEl = card.querySelector('.team-remove-on-card-icon');
        if (removeIconEl) {
            removeIconEl.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTeamMember(pokemon.id); // Same function handles removal
            });
        }
    }
    return card;
}


function handleNewGenerationRequest() {
    if (isLoading && loadingProgressContainer && loadingProgressContainer.style.display !== 'none') return;
    if (isLoading) {
        statusElement.textContent = translations[currentLang].loadingData;
        return;
    }
    if (pokemonData.length === 0) {
        statusElement.textContent = translations[currentLang].status_initial_prompt;
        return;
    }

    hasGeneratedAtLeastOnce = true;
    if (nameFilterInput) nameFilterInput.value = ""; // Clear name filter on new generation
    validateLockedPokemonIds(); // Ensure locked IDs are still valid

    let numToGenerate = parseInt(countInput.value) || 0;
    countForNewPokemons = numToGenerate; // Store requested count

    const filteredCandidates = filterPokemon();
    // Ensure we don't pick locked or already-in-team Pokémon for the *new* generation
    const availableForRandomOverall = filteredCandidates.filter(p =>
        !lockedPokemonIds.has(p.id) &&
        !currentTeam.some(member => member.id === p.id)
    );

    displayedPokemonList = []; // Clear the list of *newly* generated Pokémon

    if (availableForRandomOverall.length === 0 || numToGenerate === 0) {
        // If no candidates or 0 requested, just render locked/team and update status
        renderAllPokemon();
        return;
    }

    // More balanced generation across selected generations
    const selectedGensFromCheckboxes = Array.from(document.querySelectorAll('.gen-checkbox:checked')).map(cb => parseInt(cb.value));
    const pokemonBySelectedGeneration = new Map();
    selectedGensFromCheckboxes.forEach(gen => pokemonBySelectedGeneration.set(gen, []));

    // Populate map with available candidates
    availableForRandomOverall.forEach(p => {
        if (p.generation !== null && pokemonBySelectedGeneration.has(p.generation)) {
            pokemonBySelectedGeneration.get(p.generation).push(p);
        }
    });

    // Shuffle within each generation list
    pokemonBySelectedGeneration.forEach(list => list.sort(() => 0.5 - Math.random()));

    // Determine the order to pick generations from (randomized)
    let generationPickOrder = [...selectedGensFromCheckboxes].filter(gen => pokemonBySelectedGeneration.get(gen) && pokemonBySelectedGeneration.get(gen).length > 0)
        .sort(() => 0.5 - Math.random());

    // Pick one from each selected generation first (round-robin style)
    let pickedInRound = 0;
    while (numToGenerate > 0 && pickedInRound < generationPickOrder.length) {
        const currentGenIndex = pickedInRound % generationPickOrder.length;
        const genToPickFrom = generationPickOrder[currentGenIndex];
        const candidatesInGen = pokemonBySelectedGeneration.get(genToPickFrom);

        if (candidatesInGen && candidatesInGen.length > 0) {
            const pickedPokemon = candidatesInGen.pop(); // Take one from the shuffled list
            displayedPokemonList.push(pickedPokemon);
            numToGenerate--;
        } else {
            // Remove this generation from future rounds if empty
            generationPickOrder.splice(currentGenIndex, 1);
            // Adjust index if needed, but simpler to just continue loop
            if (generationPickOrder.length === 0) break; // No more gens with candidates
        }
        pickedInRound++;
    }


    // If more Pokémon are needed, pick randomly from all remaining candidates
    if (numToGenerate > 0) {
        let allRemainingCandidates = [];
        pokemonBySelectedGeneration.forEach(list => allRemainingCandidates.push(...list));

        if (allRemainingCandidates.length > 0) {
            allRemainingCandidates.sort(() => 0.5 - Math.random()); // Shuffle remaining
            const numToTakeFromRemaining = Math.min(numToGenerate, allRemainingCandidates.length);
            displayedPokemonList.push(...allRemainingCandidates.slice(0, numToTakeFromRemaining));
        }
    }

    renderAllPokemon(); // Render locked, team, and the newly generated list
}

function renderAllPokemon() {
    if (!lockedPokemonResultsContainer || !resultsContainer || !statusElement) return; // Ensure elements exist

    // --- Render Locked Pokémon ---
    lockedPokemonResultsContainer.innerHTML = "";
    let actualDisplayedLockedPokemons = [];
    if (lockedPokemonIds.size > 0) {
        lockedPokemonIds.forEach(id => {
            const pokemon = pokemonData.find(p => p.id === id);
            if (pokemon) {
                actualDisplayedLockedPokemons.push(pokemon);
            }
        });
        // Sort locked Pokémon consistently (e.g., by ID)
        actualDisplayedLockedPokemons.sort((a, b) => a.id - b.id).forEach(p => {
            lockedPokemonResultsContainer.appendChild(createPokemonCard(p));
        });
        lockedPokemonSectionContainer.style.display = 'block';
    } else {
        lockedPokemonSectionContainer.style.display = 'none';
    }

    // --- Render Generated Pokémon ---
    resultsContainer.innerHTML = ""; // Clear previous generated results

    // Update shiny status before sorting/filtering
    displayedPokemonList.forEach(pokemon => {
        pokemon.isCurrentlyShiny = shinyPokemonIds.has(pokemon.id);
    });

    sortPokemonList(displayedPokemonList); // Sort the generated list

    // Apply name filter
    const nameFilterValue = nameFilterInput.value.toLowerCase().trim();
    let finalFilteredList = displayedPokemonList;

    if (nameFilterValue !== "") {
        finalFilteredList = displayedPokemonList.filter(pokemon => {
            // Handle German names with prefixes for filtering
            let nameDe = pokemon.germanName ? pokemon.germanName.toLowerCase() : '';
            if (pokemon.isMega && nameDe && !nameDe.startsWith('mega-')) nameDe = `mega-${nameDe}`;
            if (pokemon.isAlolan && nameDe && !nameDe.startsWith('alola-')) nameDe = `alola-${nameDe}`;
            // Also check English name
            const nameEn = pokemon.name.toLowerCase();
            return nameDe.includes(nameFilterValue) || nameEn.includes(nameFilterValue);
        });
    }


    finalFilteredList.forEach(p => {
        resultsContainer.appendChild(createPokemonCard(p));
    });

    // --- Handle "No Results" Message ---
    if (finalFilteredList.length === 0 && hasGeneratedAtLeastOnce && pokemonData.length > 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results-message';
        if (displayedPokemonList.length > 0 && nameFilterValue !== "") {
            // Message when name filter clears results
            let baseMsg = translations[currentLang].noResultsInContainer;
            if (currentLang === 'de') baseMsg = baseMsg.replace("deinen aktuellen Filtern", `dem Namen "${nameFilterInput.value}" und deinen Filtern`);
            else baseMsg = baseMsg.replace("your current filters", `the name "${nameFilterInput.value}" and your filters`);
            noResultsDiv.textContent = baseMsg;
        } else {
            // Message when generation filters yield no results
            noResultsDiv.textContent = translations[currentLang].noResultsInContainer;
        }
        // Only add if the container is truly empty (no locked Pokémon either, though that's handled above)
        if (resultsContainer.innerHTML === "") { // Check if it's still empty after rendering attempts
            resultsContainer.appendChild(noResultsDiv);
        }
    }

    // Show/hide name filter input based on whether there are generated results
    nameFilterContainer.style.display = displayedPokemonList.length > 0 || (nameFilterInput && nameFilterInput.value !== "") ? 'block' : 'none';


    // --- Update Status Message ---
    updateStatusMessage();

    updateSortIcons();
    handleScroll(); // Update sticky elements visibility
}

function updateStatusMessage() {
    const numLocked = lockedPokemonIds.size; // Use the size of the Set
    const numGeneratedBeforeNameFilter = displayedPokemonList.length;
    const filteredCandidatesForStatus = filterPokemon();
    const numTotalPossibleNew = filteredCandidatesForStatus.filter(p => !lockedPokemonIds.has(p.id) && !currentTeam.some(member => member.id === p.id)).length;
    const countInputValue = parseInt(countInput.value) || 0;
    const nameFilterValue = nameFilterInput.value.trim();
    const numDisplayedAfterNameFilter = resultsContainer.querySelectorAll('.pokemon-card').length;


    if (isLoading) { statusElement.textContent = translations[currentLang].loadingData; }
    else if (pokemonData.length === 0) { statusElement.textContent = translations[currentLang].status_initial_prompt; }
    else if (!hasGeneratedAtLeastOnce) {
        // Initial state message, considering locked/team
        let initialMsgParts = [];
        if (numLocked > 0) {
            let lockedMsg = translations[currentLang].status_locked_only(numLocked);
            if (lockedMsg.endsWith('.')) lockedMsg = lockedMsg.slice(0, -1);
            initialMsgParts.push(lockedMsg);
        }
        if (currentTeam.length > 0) {
            const teamStatus = currentLang === 'de' ? `${currentTeam.length} im Team` : `${currentTeam.length} in Team`;
            initialMsgParts.push(teamStatus);
        }
        let combinedMsg = initialMsgParts.join('. ');
        if (initialMsgParts.length > 0) combinedMsg += ". ";
        combinedMsg += translations[currentLang].status_initial_prompt_append_generate || "Press 'Generate Pokémon!' to get new ones.";
        statusElement.textContent = combinedMsg;
    } else {
        // Post-generation status messages
        if (numLocked > 0 && countInputValue === 0 && numGeneratedBeforeNameFilter === 0) {
            statusElement.textContent = translations[currentLang].status_locked_only(numLocked);
        } else if (numLocked > 0 && numGeneratedBeforeNameFilter > 0) {
            statusElement.textContent = translations[currentLang].status_locked_and_generated(numLocked, numGeneratedBeforeNameFilter, numTotalPossibleNew);
        } else if (numLocked > 0 && numGeneratedBeforeNameFilter === 0 && countInputValue > 0) {
            statusElement.textContent = translations[currentLang].status_locked_no_new_match(numLocked);
        } else if (numLocked === 0 && numGeneratedBeforeNameFilter > 0) {
            statusElement.textContent = translations[currentLang].status_generated_only(numGeneratedBeforeNameFilter, numTotalPossibleNew);
        } else if (numLocked === 0 && numGeneratedBeforeNameFilter === 0 && countInputValue > 0) {
            // Check if *any* Pokémon match the filters, even if locked/teamed
            const anyMatchFilters = filteredCandidatesForStatus.length > 0;
            if (!anyMatchFilters) { // Absolutely no Pokémon match the base filters
                statusElement.textContent = translations[currentLang].status_no_pokemon_at_all;
            } else { // Pokémon match filters, but none are available for new generation
                statusElement.textContent = translations[currentLang].status_no_new_match;
            }
        } else if (numLocked === 0 && numGeneratedBeforeNameFilter === 0 && countInputValue === 0) {
            statusElement.textContent = translations[currentLang].status_initial_prompt; // Reset prompt if 0 requested and none generated/locked
        } else {
            // Default/fallback if other conditions didn't match - likely generated some
            statusElement.textContent = translations[currentLang].status_generated_only(numGeneratedBeforeNameFilter, numTotalPossibleNew);
        }

        // Append name filter info if it affected results
        if (nameFilterValue !== "" && numGeneratedBeforeNameFilter > 0 && numDisplayedAfterNameFilter < numGeneratedBeforeNameFilter) {
            const filterInfo = currentLang === 'de' ? ` (Gefiltert nach "${nameFilterValue}")` : ` (Filtered by "${nameFilterValue}")`;
            statusElement.textContent += filterInfo;
        } else if (nameFilterValue !== "" && numGeneratedBeforeNameFilter > 0 && numDisplayedAfterNameFilter === 0) {
            // If name filter resulted in zero displayed generated Pokémon
            const noMatchInfo = currentLang === 'de' ? ` (Keine Treffer für "${nameFilterValue}")` : ` (No matches for "${nameFilterValue}")`;
            statusElement.textContent += noMatchInfo;
        }
    }
}


function sortPokemonList(list) {
    if (!list || list.length === 0) return;
    const directionMultiplier = currentSortDirection === 'asc' ? 1 : -1;
    switch (currentSortCriteria) {
        case 'id': list.sort((a, b) => (a.id - b.id) * directionMultiplier); break;
        case 'name': list.sort((a, b) => {
            let nameA = currentLang === 'de' && a.germanName ? a.germanName : a.name;
            let nameB = currentLang === 'de' && b.germanName ? b.germanName : b.name;
            // Apply prefixes for sorting comparison
            if (currentLang === 'de') {
                if (a.isMega && nameA && !nameA.toLowerCase().startsWith('mega-')) nameA = `Mega-${nameA}`;
                if (a.isAlolan && nameA && !nameA.toLowerCase().startsWith('alola-')) nameA = `Alola-${nameA}`;
                if (b.isMega && nameB && !nameB.toLowerCase().startsWith('mega-')) nameB = `Mega-${nameB}`;
                if (b.isAlolan && nameB && !nameB.toLowerCase().startsWith('alola-')) nameB = `Alola-${nameB}`;
            } else { // Apply English prefixes if needed (though less common)
                if (a.isMega && !nameA.toLowerCase().startsWith('mega ')) nameA = `Mega ${nameA}`;
                if (a.isAlolan && !nameA.toLowerCase().startsWith('alolan ')) nameA = `Alolan ${nameA}`;
                if (b.isMega && !nameB.toLowerCase().startsWith('mega ')) nameB = `Mega ${nameB}`;
                if (b.isAlolan && !nameB.toLowerCase().startsWith('alolan ')) nameB = `Alolan ${nameB}`;
            }
            return nameA.localeCompare(nameB, currentLang) * directionMultiplier;
        }); break;
        case 'type': list.sort((a, b) => {
            const typeA = a.types.length > 0 ? (translations[currentLang]['type_' + a.types[0]] || a.types[0]) : '';
            const typeB = b.types.length > 0 ? (translations[currentLang]['type_' + b.types[0]] || b.types[0]) : '';
            return typeA.localeCompare(typeB, currentLang) * directionMultiplier;
        }); break;
        case 'bst': list.sort((a, b) => ((a.baseStatTotal || 0) - (b.baseStatTotal || 0)) * directionMultiplier); break;
        case 'shiny': list.sort((a, b) => ((b.isCurrentlyShiny ? 1 : 0) - (a.isCurrentlyShiny ? 1 : 0)) * directionMultiplier); break;
        case 'legendary': list.sort((a, b) => ((b.isLegendary ? 1 : 0) - (a.isLegendary ? 1 : 0)) * directionMultiplier); break;
        case 'mythical': list.sort((a, b) => ((b.isMythical ? 1 : 0) - (a.isMythical ? 1 : 0)) * directionMultiplier); break;
        case 'mega': list.sort((a, b) => ((b.isMega ? 1 : 0) - (a.isMega ? 1 : 0)) * directionMultiplier); break;
        case 'alolan': list.sort((a, b) => ((b.isAlolan ? 1 : 0) - (a.isAlolan ? 1 : 0)) * directionMultiplier); break;
        case 'random': for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; } break;
        default: list.sort((a, b) => a.id - b.id); // Fallback to ID sort
    }
}


function updateSortIcons() {
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.classList.remove('active');
        if (icon.dataset.sort === currentSortCriteria) icon.classList.add('active');
    });
    // Update direction indicator icon
    if (sortDirectionIcon) {
        if (currentSortCriteria === 'random') {
            sortDirectionIcon.className = 'fa-solid'; // No direction for random
        } else {
            sortDirectionIcon.className = `fa-solid ${currentSortDirection === 'asc' ? 'fa-arrow-up-short-wide' : 'fa-arrow-down-wide-short'}`;
        }
    }
}

function toggleShiny(imgElement, pokemonId) {
    const currentSrc = imgElement.src;
    const normalSrc = imgElement.dataset.normal;
    const shinySrc = imgElement.dataset.shiny;
    const imageContainer = imgElement.parentElement;
    const indicator = imageContainer.querySelector('.shiny-indicator');

    if (shinySrc && shinySrc.includes('http')) { // Check if shiny source is valid
        let isNowShiny = false;
        if (currentSrc === normalSrc || !currentSrc.includes('shiny')) { // If current is normal or failed/placeholder
            imgElement.src = shinySrc;
            if (indicator) indicator.classList.add('active');
            shinyPokemonIds.add(pokemonId);
            isNowShiny = true;
        } else { // If current is shiny
            imgElement.src = normalSrc;
            if (indicator) indicator.classList.remove('active');
            shinyPokemonIds.delete(pokemonId);
        }
        localStorage.setItem(SHINY_POKEMON_CACHE_KEY, JSON.stringify(Array.from(shinyPokemonIds)));

        // Update internal state for sorting
        const pokemonInList = displayedPokemonList.find(p => p.id === pokemonId);
        if (pokemonInList) {
            pokemonInList.isCurrentlyShiny = isNowShiny;
        }
        // Also update in the main data if needed, though less critical
        const mainDataPokemon = pokemonData.find(p => p.id === pokemonId);
        if (mainDataPokemon) {
            // We don't need a permanent shiny flag on pokemonData, shinyPokemonIds handles persistence
        }
    }

    // Re-render if sorting by shiny
    if (currentSortCriteria === 'shiny' && hasGeneratedAtLeastOnce) {
        renderAllPokemon();
    }
}


function toggleLockPokemon(pokemonId) {
    const pokemonToToggle = pokemonData.find(p => p.id === pokemonId);
    if (!pokemonToToggle) return;

    if (lockedPokemonIds.has(pokemonId)) {
        lockedPokemonIds.delete(pokemonId);
    } else {
        lockedPokemonIds.add(pokemonId);
        // Remove from displayed list if it was there
        const indexInDisplayed = displayedPokemonList.findIndex(p => p.id === pokemonId);
        if (indexInDisplayed > -1) {
            displayedPokemonList.splice(indexInDisplayed, 1);
        }
    }
    localStorage.setItem(LOCKED_POKEMON_CACHE_KEY, JSON.stringify(Array.from(lockedPokemonIds)));
    renderAllPokemon(); // Re-render to move card and update status/icons
}

function toggleTeamMember(pokemonId) {
    const pokemon = pokemonData.find(p => p.id === pokemonId);
    if (!pokemon) return;

    const teamIndex = currentTeam.findIndex(member => member.id === pokemonId);

    if (teamIndex > -1) { // Is in team -> remove
        currentTeam.splice(teamIndex, 1);
    } else { // Not in team -> add if space available
        if (currentTeam.length < MAX_TEAM_SIZE) {
            currentTeam.push(pokemon);
        } else {
            alert(translations[currentLang].teamFullMessage);
            return; // Don't proceed if team is full
        }
    }
    saveTeamState();
    renderTeamBuilder(); // Update team display and analysis
    renderAllPokemon(); // Update icons on generated/locked cards
}


function renderTeamBuilder() {
    if (!teamBuilderResultsContainer || !teamBuilderSectionContainer) return;
    teamBuilderResultsContainer.innerHTML = "";
    if (currentTeam.length > 0) {
        teamBuilderSectionContainer.style.display = 'block';
        currentTeam.forEach(pokemon => {
            teamBuilderResultsContainer.appendChild(createPokemonCard(pokemon, true)); // Pass true for team member style
        });
    } else {
        teamBuilderSectionContainer.style.display = 'none';
    }
    analyzeTeamTypes(); // Update analysis whenever team changes
}

function saveTeamState() {
    localStorage.setItem(TEAM_MEMBERS_CACHE_KEY, JSON.stringify(currentTeam.map(p => p.id)));
}

function loadTeamState() {
    const savedTeamIdsJSON = localStorage.getItem(TEAM_MEMBERS_CACHE_KEY);
    if (savedTeamIdsJSON) {
        try {
            const savedTeamIds = JSON.parse(savedTeamIdsJSON);
            if (pokemonData.length > 0) {
                // Map IDs back to full Pokémon objects from the loaded pokemonData
                currentTeam = savedTeamIds.map(id => pokemonData.find(p => p.id === id)).filter(p => p); // Filter out nulls if data changed
            } else {
                // Should ideally wait for pokemonData, but initialize empty if called too early
                currentTeam = [];
                console.warn("loadTeamState called before pokemonData was ready.");
            }
        } catch (e) {
            console.error("Error loading team state:", e);
            currentTeam = [];
            localStorage.removeItem(TEAM_MEMBERS_CACHE_KEY);
        }
    } else {
        currentTeam = []; // Initialize empty if no saved state
    }
}

function analyzeTeamTypes() {
    if (!teamAnalysisSimpleContainer || !teamAnalysisDetailedContainer || !toggleAnalysisViewBtn) return;

    teamAnalysisSimpleContainer.innerHTML = "";
    teamAnalysisDetailedContainer.innerHTML = ""; // Clear previous detailed view

    if (currentTeam.length === 0) {
        teamAnalysisSimpleContainer.innerHTML = `<i style="display: block; text-align: center;">${translations[currentLang].noTeamAnalysis || 'Add Pokémon to see team analysis.'}</i>`;
        toggleAnalysisViewBtn.style.display = 'none';
        teamAnalysisDetailedContainer.style.display = 'none';
        isDetailedAnalysisVisible = false; // Reset view state
        return;
    }

    toggleAnalysisViewBtn.style.display = 'inline-block'; // Show button if team exists

    // --- Type Effectiveness Calculation (using typeChart from pokedex-data.js) ---
    const allAttackingTypes = Object.keys(typeChart);
    let teamTypeEffectiveness = {}; // Stores counts for each attacking type { superEffective: N, notVeryEffective: N, noEffect: N, normalEffective: N }

    allAttackingTypes.forEach(attackingType => {
        teamTypeEffectiveness[attackingType] = { superEffective: 0, notVeryEffective: 0, noEffect: 0, normalEffective: 0 };
        currentTeam.forEach(pokemon => {
            let finalMultiplier = 1;
            let isImmune = false;
            pokemon.types.forEach(defensivePokemonType => {
                const defTypeData = typeChart[defensivePokemonType];
                if (defTypeData) {
                    if (defTypeData.defenseImmuneTo.includes(attackingType)) {
                        isImmune = true;
                        // multiplier calculation stops if immune
                    }
                    if (!isImmune) { // Only calculate multipliers if not immune
                        if (defTypeData.defenseWeakTo.includes(attackingType)) finalMultiplier *= 2;
                        else if (defTypeData.defenseResists.includes(attackingType)) finalMultiplier *= 0.5;
                    }
                }
            });

            // Categorize based on final multiplier
            if (isImmune) {
                teamTypeEffectiveness[attackingType].noEffect++;
            } else if (finalMultiplier >= 2) { // Includes 4x weakness
                teamTypeEffectiveness[attackingType].superEffective++;
            } else if (finalMultiplier <= 0.5 && finalMultiplier > 0) { // Includes 0.25x resistance
                teamTypeEffectiveness[attackingType].notVeryEffective++;
            } else if (finalMultiplier === 1) {
                teamTypeEffectiveness[attackingType].normalEffective++;
            }
        });
    });

    // --- Simple Analysis Logic ---
    const teamSize = currentTeam.length;
    let commonWeaknesses = [];
    let commonResistances = [];
    const significanceThreshold = Math.max(1, Math.ceil(teamSize / 2)); // At least half the team, minimum 1

    allAttackingTypes.forEach(attackingType => {
        const superEffectiveCount = teamTypeEffectiveness[attackingType].superEffective;
        const resistedOrImmuneCount = teamTypeEffectiveness[attackingType].notVeryEffective + teamTypeEffectiveness[attackingType].noEffect;

        // Weakness: More than half weak, and more weak than resistant/immune
        if (superEffectiveCount >= significanceThreshold && superEffectiveCount > resistedOrImmuneCount) {
            commonWeaknesses.push(attackingType);
        }
        // Resistance: More than half resistant/immune, and more resistant/immune than weak
        else if (resistedOrImmuneCount >= significanceThreshold && resistedOrImmuneCount > superEffectiveCount) {
            commonResistances.push(attackingType);
        }
    });

    // --- Render Simple Analysis ---
    let simpleAnalysisHTML = "";
    if (commonWeaknesses.length > 0) {
        simpleAnalysisHTML += `<div class="team-analysis-row"><span>${translations[currentLang].commonWeaknessesLabel} </span>`;
        commonWeaknesses.forEach(type => {
            const typeNameTranslated = translations[currentLang]['type_' + type] || capitalizeFirstLetter(type);
            simpleAnalysisHTML += `<span class="type-analysis-item" title="${typeNameTranslated}"><img src="${TYPE_ICON_BASE_URL}${type}.svg" class="type-icon" alt="${typeNameTranslated}"></span> `;
        });
        simpleAnalysisHTML += `</div>`;
    } else if (currentTeam.length > 0) {
        // Check if ANY significant weakness exists even if not common
        let anyWeaknessExists = Object.values(teamTypeEffectiveness).some(eff => eff.superEffective > 0 && eff.superEffective > (eff.notVeryEffective + eff.noEffect));
        if (anyWeaknessExists) {
            // simpleAnalysisHTML += `<div class="team-analysis-row"><span>${translations[currentLang].commonWeaknessesLabel} </span><i>${translations[currentLang].allWeaknessesBalanced}</i></div>`;
        }
    }


    if (commonResistances.length > 0) {
        simpleAnalysisHTML += `<div class="team-analysis-row"><span>${translations[currentLang].commonResistancesLabel} </span>`;
        commonResistances.forEach(type => {
            const typeNameTranslated = translations[currentLang]['type_' + type] || capitalizeFirstLetter(type);
            simpleAnalysisHTML += `<span class="type-analysis-item" title="${typeNameTranslated}"><img src="${TYPE_ICON_BASE_URL}${type}.svg" class="type-icon" alt="${typeNameTranslated}"></span> `;
        });
        simpleAnalysisHTML += `</div>`;
    } else if (currentTeam.length > 0) {
        // Check if ANY significant resistance exists
        let anyResistanceExists = Object.values(teamTypeEffectiveness).some(eff => (eff.notVeryEffective + eff.noEffect) > 0 && (eff.notVeryEffective + eff.noEffect) > eff.superEffective);
        if (anyResistanceExists && commonWeaknesses.length === 0) { // Avoid showing balanced if common weaknesses exist
            // simpleAnalysisHTML += `<div class="team-analysis-row"><span>${translations[currentLang].commonResistancesLabel} </span><i>${translations[currentLang].allResistancesBalanced}</i></div>`;
        }
    }


    if (simpleAnalysisHTML === "" && currentTeam.length > 0) {
        simpleAnalysisHTML = `<i style="display: block; text-align: center;">${translations[currentLang].noTeamAnalysis}</i>`;
    }
    teamAnalysisSimpleContainer.innerHTML = simpleAnalysisHTML;


    // --- Render Detailed Analysis Table ---
    const chartTitle = document.createElement('h3');
    chartTitle.id = 'team-analysis-chart-title';
    chartTitle.textContent = translations[currentLang].teamChartTitle || "Team Type Effectiveness";
    chartTitle.style.textAlign = "center";
    chartTitle.style.fontSize = "1.2em";
    chartTitle.style.marginBottom = "10px";
    teamAnalysisDetailedContainer.appendChild(chartTitle); // Add title first

    const table = document.createElement('table');
    table.id = 'team-analysis-chart';
    const thead = table.createTHead();
    const headerRow = thead.insertRow();

    // Header: Attacking Type Icon
    let th = document.createElement('th');
    th.textContent = translations[currentLang].attackingTypeHeader || "Atk. Type";
    th.classList.add('attacking-type-header');
    headerRow.appendChild(th);

    // Header: Pokémon Icons & Names
    currentTeam.forEach(pokemon => {
        th = document.createElement('th');
        th.classList.add('pokemon-header-cell');
        const img = document.createElement('img');
        // Use small icon sprite if available, fallback to default sprite/image
        img.src = pokemon.icon_url; // Updated to use pokemon.icon_url
        img.alt = pokemon.name;
        img.onerror = function() { // Fallback if sprite fails
            this.onerror = null; // prevent infinite loop
            this.src = pokemon.image_url || 'https://placehold.co/32x32/e0e0e0/333?text=?'; // Fallback to image_url or placeholder
        }
        th.appendChild(img);
        const nameSpan = document.createElement('span');
        nameSpan.textContent = currentLang === 'de' && pokemon.germanName ? pokemon.germanName : capitalizeFirstLetter(pokemon.name);
        th.appendChild(nameSpan);
        headerRow.appendChild(th);
    });

    // Header: Summary Columns
    th = document.createElement('th');
    th.textContent = translations[currentLang].totalWeakLabel || "Total Weak";
    th.classList.add('summary-col');
    headerRow.appendChild(th);
    th = document.createElement('th');
    th.textContent = translations[currentLang].totalResistLabel || "Total Resist";
    th.classList.add('summary-col');
    headerRow.appendChild(th);

    // --- Table Body ---
    const tbody = table.createTBody();
    allAttackingTypes.forEach(attackingType => {
        let hasAnyNotableEffectivenessThisRow = false;
        const effectivenessCellsData = []; // Store data for each cell in the row
        let totalWeakAgainstAttackingType = 0;
        let totalResistAgainstAttackingType = 0;

        // Calculate effectiveness for each Pokémon against this attacking type
        currentTeam.forEach(pokemon => {
            let finalMultiplier = 1;
            let isImmune = false;
            pokemon.types.forEach(defensivePokemonType => {
                const defTypeData = typeChart[defensivePokemonType];
                if (defTypeData) {
                    if (defTypeData.defenseImmuneTo.includes(attackingType)) isImmune = true;
                    if (!isImmune) {
                        if (defTypeData.defenseWeakTo.includes(attackingType)) finalMultiplier *= 2;
                        else if (defTypeData.defenseResists.includes(attackingType)) finalMultiplier *= 0.5;
                    }
                }
            });

            let cellData = { text: "", class: "" }; // Default: Normal effectiveness
            if (isImmune) { cellData = { text: "0x", class: 'effectiveness-0x' }; hasAnyNotableEffectivenessThisRow = true; totalResistAgainstAttackingType++; }
            else if (finalMultiplier >= 4) { cellData = { text: `4x`, class: 'effectiveness-4x' }; hasAnyNotableEffectivenessThisRow = true; totalWeakAgainstAttackingType++; }
            else if (finalMultiplier >= 2) { cellData = { text: `2x`, class: 'effectiveness-2x' }; hasAnyNotableEffectivenessThisRow = true; totalWeakAgainstAttackingType++; }
            else if (finalMultiplier === 0.5) { cellData = { text: `½x`, class: 'effectiveness-0_5x' }; hasAnyNotableEffectivenessThisRow = true; totalResistAgainstAttackingType++; }
            else if (finalMultiplier <= 0.25 && finalMultiplier > 0) { cellData = { text: `¼x`, class: 'effectiveness-0_25x' }; hasAnyNotableEffectivenessThisRow = true; totalResistAgainstAttackingType++; }
            // No else needed for finalMultiplier === 1

            effectivenessCellsData.push(cellData);
        });

        // Only add row if there's at least one non-normal effectiveness
        if (hasAnyNotableEffectivenessThisRow) {
            const row = tbody.insertRow();

            // Cell: Attacking Type Icon
            const typeCell = row.insertCell();
            typeCell.classList.add('type-icon-cell');
            const typeImg = document.createElement('img');
            typeImg.src = `${TYPE_ICON_BASE_URL}${attackingType}.svg`;
            const typeNameTranslated = translations[currentLang]['type_' + attackingType] || capitalizeFirstLetter(attackingType);
            typeImg.alt = typeNameTranslated;
            typeImg.classList.add('type-icon');
            typeImg.title = typeNameTranslated;
            typeCell.appendChild(typeImg);

            // Cells: Effectiveness against each Pokémon
            effectivenessCellsData.forEach(data => {
                const cell = row.insertCell();
                cell.textContent = data.text;
                if (data.class) cell.classList.add(data.class);
            });

            // Cells: Summary Columns
            const summaryWeakCell = row.insertCell();
            summaryWeakCell.classList.add('summary-col');
            if (totalWeakAgainstAttackingType > 0) {
                summaryWeakCell.textContent = totalWeakAgainstAttackingType;
                // Highlight summary cell if significantly weak
                if (totalWeakAgainstAttackingType >= significanceThreshold && totalWeakAgainstAttackingType > totalResistAgainstAttackingType) {
                    summaryWeakCell.classList.add('summary-weak');
                }
            }

            const summaryResistCell = row.insertCell();
            summaryResistCell.classList.add('summary-col');
            if (totalResistAgainstAttackingType > 0) {
                summaryResistCell.textContent = totalResistAgainstAttackingType;
                // Highlight summary cell if significantly resistant
                if (totalResistAgainstAttackingType >= significanceThreshold && totalResistAgainstAttackingType > totalWeakAgainstAttackingType) {
                    summaryResistCell.classList.add('summary-resist');
                }
            }
        }
    });

    teamAnalysisDetailedContainer.appendChild(table);
    updateAnalysisViewDisplay(); // Ensure correct view is shown initially/after update
}


function updateAnalysisViewDisplay() {
    if (!toggleAnalysisViewBtn || !teamAnalysisSimpleContainer || !teamAnalysisDetailedContainer) return;
    if (isDetailedAnalysisVisible) {
        teamAnalysisSimpleContainer.style.display = 'none';
        teamAnalysisDetailedContainer.style.display = 'block';
        toggleAnalysisViewBtn.textContent = translations[currentLang].toggleAnalysisSimple;
        toggleAnalysisViewBtn.setAttribute('data-i18n', 'toggleAnalysisSimple');
    } else {
        teamAnalysisSimpleContainer.style.display = 'flex'; // Use flex for simple view layout
        teamAnalysisDetailedContainer.style.display = 'none';
        toggleAnalysisViewBtn.textContent = translations[currentLang].toggleAnalysisDetail;
        toggleAnalysisViewBtn.setAttribute('data-i18n', 'toggleAnalysisDetail');
    }
}


function capitalizeFirstLetter(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

function initializeToggleAllIcons() {
    document.querySelectorAll('.toggle-all-icon').forEach(icon => {
        const groupClass = icon.dataset.group;
        if (!groupClass) return;
        icon.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent collapsible toggle if clicking icon
            const checkboxesInGroup = document.querySelectorAll(`.${groupClass}`);
            if (checkboxesInGroup.length === 0) return;
            const allCurrentlySelected = Array.from(checkboxesInGroup).every(cb => cb.checked);
            checkboxesInGroup.forEach(cb => { cb.checked = !allCurrentlySelected; });
            updateToggleIcon(groupClass); // Update this icon
            saveFilterState(); // Save changes
        });
        // Also add change listeners to individual checkboxes to update the toggle icon
        const checkboxesInGroup = document.querySelectorAll(`.${groupClass}`);
        checkboxesInGroup.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateToggleIcon(groupClass); // Update icon when any checkbox changes
                saveFilterState(); // Save changes
            });
        });
        updateToggleIcon(groupClass); // Initial update on load
    });
}

function setDefaultFiltersChecked() {
    const filterGroupsClasses = ['.gen-checkbox', '.type-checkbox', '.evo-position-checkbox', '.chain-length-checkbox', '.special-checkbox'];
    filterGroupsClasses.forEach(groupClass => {
        document.querySelectorAll(groupClass).forEach(checkbox => {
            // Only default to checked if no saved state exists
            if (!localStorage.getItem(FILTER_STATE_CACHE_KEY)) {
                // Default special checkboxes based on initial HTML state (checked)
                if (checkbox.classList.contains('special-checkbox')) {
                    checkbox.checked = document.getElementById(checkbox.id)?.checked ?? true;
                } else {
                    checkbox.checked = true; // Default others to checked
                }
            }
        });
    });
}

function saveFilterState() {
    const filterState = {};
    const filterCheckboxes = document.querySelectorAll(
        '.gen-checkbox, .type-checkbox, .evo-position-checkbox, .chain-length-checkbox, .special-checkbox'
    );
    filterCheckboxes.forEach(checkbox => {
        filterState[checkbox.id] = checkbox.checked;
    });

    const bstMinInput = document.getElementById('bstMin');
    const bstMaxInput = document.getElementById('bstMax');
    if (bstMinInput) filterState['bstMin'] = bstMinInput.value;
    if (bstMaxInput) filterState['bstMax'] = bstMaxInput.value;

    try {
        localStorage.setItem(FILTER_STATE_CACHE_KEY, JSON.stringify(filterState));
    } catch (e) {
        console.error("Error saving filter state to localStorage:", e);
    }
}

function loadFilterState() {
    const savedStateJSON = localStorage.getItem(FILTER_STATE_CACHE_KEY);
    if (savedStateJSON) {
        try {
            const savedState = JSON.parse(savedStateJSON);
            const allFilterCheckboxes = document.querySelectorAll(
                '.gen-checkbox, .type-checkbox, .evo-position-checkbox, .chain-length-checkbox, .special-checkbox'
            );
            allFilterCheckboxes.forEach(checkbox => {
                if (savedState.hasOwnProperty(checkbox.id)) {
                    checkbox.checked = savedState[checkbox.id];
                } else {
                    // If a filter exists in HTML but not in save, maybe default it?
                    // Example: Default new special filters to checked if not in old save
                    if (checkbox.classList.contains('special-checkbox') && checkbox.id.startsWith('include')) {
                        // Check initial HTML state as fallback for newly added filters
                        checkbox.checked = document.getElementById(checkbox.id)?.checked ?? true;
                    } else {
                        // Decide a default for older filters not found (e.g., true or initial HTML state)
                        checkbox.checked = document.getElementById(checkbox.id)?.checked ?? false;
                    }
                }
            });

            const bstMinInput = document.getElementById('bstMin');
            const bstMaxInput = document.getElementById('bstMax');
            if (bstMinInput && savedState.hasOwnProperty('bstMin')) {
                bstMinInput.value = savedState['bstMin'];
            }
            if (bstMaxInput && savedState.hasOwnProperty('bstMax')) {
                bstMaxInput.value = savedState['bstMax'];
            }

        } catch (e) {
            console.error("Error loading or applying filter state from localStorage:", e);
            setDefaultFiltersChecked(); // Fallback to defaults on error
            localStorage.removeItem(FILTER_STATE_CACHE_KEY);
        }
    } else {
        setDefaultFiltersChecked(); // Set defaults if no saved state
    }

    // Update toggle icons after loading state
    const filterGroups = new Set();
    document.querySelectorAll('.toggle-all-icon').forEach(icon => {
        if (icon.dataset.group) filterGroups.add(icon.dataset.group);
    });
    filterGroups.forEach(groupClass => updateToggleIcon(groupClass));
}

function initializeCollapsibles() {
    // Initialize state based on button text (or a saved preference)
    allFiltersExpanded = (toggleAllFiltersButton.getAttribute('data-i18n') === 'collapseAllLabel');

    document.querySelectorAll('.collapsible').forEach(collapsibleContainer => {
        const header = collapsibleContainer.querySelector('.control-group-header, .instructions-header');
        const content = collapsibleContainer.querySelector('.collapsible-content, .instructions-content');
        if (!header || !content) return;

        // Initial state based on container class (e.g., instructions start closed)
        const isInitiallyClosed = collapsibleContainer.classList.contains('is-closed');
        if (isInitiallyClosed) {
            content.style.maxHeight = '0';
        } else {
            // Set max-height explicitly for smooth opening transition on load if needed
            // Use scrollHeight only if it's meant to be open initially
            content.style.maxHeight = content.scrollHeight + "px";
        }


        header.addEventListener('click', function() {
            const isClosed = collapsibleContainer.classList.toggle('is-closed');
            // Recalculate scrollHeight before opening
            content.style.maxHeight = isClosed ? '0' : content.scrollHeight + "px";
        });
        // Ensure max-height transitions work
        content.style.transition = 'max-height 0.3s ease-out, padding-top 0.3s ease-out, padding-bottom 0.3s ease-out, margin-top 0.3s ease-out';
        content.style.overflow = 'hidden';
    });

    if (toggleAllFiltersButton) {
        toggleAllFiltersButton.addEventListener('click', function() {
            allFiltersExpanded = !allFiltersExpanded;
            this.textContent = translations[currentLang][allFiltersExpanded ? 'collapseAllLabel' : 'expandAllLabel'];
            this.setAttribute('data-i18n', allFiltersExpanded ? 'collapseAllLabel' : 'expandAllLabel');
            document.querySelectorAll('.control-group.collapsible').forEach(group => { // Only target filter groups
                const content = group.querySelector('.collapsible-content');
                const header = group.querySelector('.control-group-header'); // Need header too
                if (content && header) {
                    if (allFiltersExpanded) {
                        group.classList.remove('is-closed');
                        content.style.maxHeight = content.scrollHeight + "px";
                    } else {
                        group.classList.add('is-closed');
                        content.style.maxHeight = '0';
                    }
                }
            });
        });
        // Set initial text based on the default state (usually collapsed)
        toggleAllFiltersButton.textContent = translations[currentLang][allFiltersExpanded ? 'collapseAllLabel' : 'expandAllLabel'];
        toggleAllFiltersButton.setAttribute('data-i18n', allFiltersExpanded ? 'collapseAllLabel' : 'expandAllLabel');
    }
}


function handleScroll() {
    const showSticky = (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300);

    if (scrollToTopBtn) {
        scrollToTopBtn.style.display = showSticky ? "block" : "none";
    }

    if (controlsDiv && stickyGenerateBtn && mainGenerateBtn && sortingControls) {
        const controlsRect = controlsDiv.getBoundingClientRect();
        // Show sticky controls if the *bottom* of the main controls is above the viewport top (or close to it)
        const showTopControls = controlsRect.bottom < 50 && pokemonData.length > 0 && !isLoading;

        stickyGenerateBtn.style.display = showTopControls ? "block" : "none";
        sortingControls.style.display = showTopControls && displayedPokemonList.length > 0 ? "flex" : "none"; // Show sort only if generated results exist

        // Ensure button state reflects loading/data state
        const isDisabled = isLoading || pokemonData.length === 0;
        stickyGenerateBtn.disabled = isDisabled;
        mainGenerateBtn.disabled = isDisabled;
    }
}


// --- Event Listeners Setup ---

function setupEventListeners() {
    if (countInput) {
        countInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleNewGenerationRequest();
            }
        });
        // Save count value? Optional.
        // countInput.addEventListener('change', () => { localStorage.setItem('pokemonCount', countInput.value); });
    }

    if (mainGenerateBtn) mainGenerateBtn.addEventListener('click', handleNewGenerationRequest);
    if (stickyGenerateBtn) stickyGenerateBtn.addEventListener('click', handleNewGenerationRequest);
    if (scrollToTopBtn) scrollToTopBtn.addEventListener('click', () => { window.scrollTo({top: 0, behavior: 'smooth'}); });

    document.querySelectorAll('.language-switcher img').forEach(img => {
        img.addEventListener('click', function() {
            const newLang = this.dataset.lang;
            setLanguage(newLang); // Call the function from i18n.js
            localStorage.setItem('language', newLang);
        });
    });

    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);

    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const newSortCriteria = this.dataset.sort;
            if (newSortCriteria === currentSortCriteria && newSortCriteria !== 'random') {
                // Toggle direction if clicking the same sort criteria (excluding random)
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                // Switch to new criteria, default to ascending
                currentSortCriteria = newSortCriteria;
                currentSortDirection = 'asc';
            }
            renderAllPokemon(); // Re-render sorted list
        });
    });

if (clearCacheBtn) {
    clearCacheBtn.addEventListener('click', async () => {
        if (window.confirm(translations[currentLang].confirmClearCache)) {
            // Clear all items from localStorage for the current origin
            Object.keys(localStorage).forEach(key => {
                localStorage.removeItem(key);
            });
            // localStorage.removeItem('pokemonCount'); // This is already covered by the loop above

            if (dbInstance) {
                try {
                    await clearData(dbInstance, POKEMON_STORE_NAME, 'mainCache');
                    console.log("Pokémon data cleared from IndexedDB.");
                } catch (e) {
                    console.error("Error clearing Pokémon data from IndexedDB:", e);
                }
            } else {
                console.warn("DB instance not available for clearing cache.");
            }

            alert(translations[currentLang].cacheCleared);
            window.location.reload();
        }
    });
}

    if (toggleAnalysisViewBtn) {
        toggleAnalysisViewBtn.addEventListener('click', () => {
            isDetailedAnalysisVisible = !isDetailedAnalysisVisible;
            updateAnalysisViewDisplay();
        });
    }

    if (nameFilterInput) {
        nameFilterInput.addEventListener('input', () => {
            renderAllPokemon(); // Re-render generated list with name filter applied
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Listen for changes on BST inputs to save state
    const bstMinInput = document.getElementById('bstMin');
    const bstMaxInput = document.getElementById('bstMax');
    if (bstMinInput) bstMinInput.addEventListener('input', saveFilterState);
    if (bstMaxInput) bstMaxInput.addEventListener('input', saveFilterState);

    // Ensure special filter changes are saved
    document.querySelectorAll('.special-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', saveFilterState);
    });
}

// --- Initialization ---
// Run initialization code after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Preferences (Dark Mode, Language)
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDarkMode = savedDarkMode === 'enabled';
    if (isDarkMode) document.body.classList.add('dark-mode');
    updateDarkModeIcon(isDarkMode);

    const savedLang = localStorage.getItem('language') || 'de'; // Default to German
    setLanguage(translations[savedLang] ? savedLang : 'de'); // Set initial language

    // 2. Load Persistent Data (Locked IDs, Shiny IDs)
    const savedLockedIds = localStorage.getItem(LOCKED_POKEMON_CACHE_KEY);
    if (savedLockedIds) {
        try {
            // Ensure IDs are numbers
            lockedPokemonIds = new Set(JSON.parse(savedLockedIds).map(id => parseInt(id)).filter(id => !isNaN(id)));
        } catch (e) {
            console.error("Error loading locked Pokémon IDs:", e);
            lockedPokemonIds = new Set();
        }
    }
    const savedShinyIds = localStorage.getItem(SHINY_POKEMON_CACHE_KEY);
    if (savedShinyIds) {
        try {
            // Ensure IDs are numbers
            shinyPokemonIds = new Set(JSON.parse(savedShinyIds).map(id => parseInt(id)).filter(id => !isNaN(id)));
        } catch (e) {
            console.error("Error loading shiny Pokémon IDs:", e);
            shinyPokemonIds = new Set();
        }
    }

    // 3. Load Filter State
    loadFilterState(); // Load filters *before* fetching data if filters might affect initial display somehow

    // 4. Initialize UI Components
    initializeToggleAllIcons();
    initializeCollapsibles();
    updateSortIcons(); // Set initial sort icon state

    // 5. Setup Event Listeners
    setupEventListeners();

    // 6. Initialize DB, then Fetch Core Data, then load dependent data and render
    try {
        dbInstance = await initDB();
        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize database:", error);
        // Application can still proceed but caching will not work.
        // Potentially show a user-facing message if DB is critical.
    }

    // Fetch data after DB initialization attempt
    fetchPokemonDataFromAPI().then(() => {
        loadTeamState(); // Load team state *after* pokemonData is available
        renderTeamBuilder(); // Render initial team
        renderAllPokemon(); // Render initial locked Pokémon and status message
    });

    // 7. Set initial count input value (optional)
     const savedCount = localStorage.getItem('pokemonCount');
     if (savedCount && countInput) {
         countInput.value = savedCount;
    }
});
