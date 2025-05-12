# Pokémon Generator ✨

A dynamic, filterable Pokémon generator and team builder web application. Fetch data live from the PokeAPI, generate random Pokémon based on extensive criteria, build and analyze teams, lock favorites, and more.

**[🚀 Launch the Pokémon Generator Application](https://cschaf.github.io/pokemon-generator/index.html)**

## Project Description

This project is a feature-rich, web-based Pokémon Generator designed for fans and developers alike. It allows users to explore the world of Pokémon by generating customized lists based on a variety of criteria, including:

*   **Generation:** Select specific Pokémon generations (1-9).
*   **Type:** Filter by one or more of the 18 Pokémon types.
*   **Evolution:** Filter by position in the evolution chain (Basic, Stage 1, Stage 2) and the total length of the chain (1, 2, or 3 stages).
*   **Special Categories:** Include or exclude Legendary, Mythical, Mega, and Alolan Pokémon forms.
*   **Base Stat Total (BST):** Filter Pokémon within a specific BST range.

The application fetches Pokémon data and images dynamically from the PokeAPI, ensuring up-to-date information. Key interactive features include:

*   **Team Builder:** Select up to 6 Pokémon to form a team. The team is displayed in a dedicated section, persists across sessions, and includes both a simple and detailed type-effectiveness analysis (Weaknesses & Resistances).
*   **Locking:** Persistently "lock" favorite Pokémon. Locked Pokémon are displayed separately in a compact format and excluded from subsequent random generations.
*   **Sorting:** Sort the *newly generated* Pokémon list by Pokédex ID, Name, primary Type, Base Stat Total (BST), Shiny status, Legendary, Mythical, Mega, Alolan, or shuffle randomly.
*   **Shiny Toggle:** Click on any Pokémon's image to instantly toggle between its normal and shiny artwork (if available).
*   **Name Filtering:** Quickly filter the *currently generated* list by Pokémon name (English or German).
*   **External Links:** Click on a Pokémon's name or Pokédex number to view its detailed page on [PokéWiki (German)](https://www.pokewiki.de/).

The interface is designed to be modern, intuitive, and responsive, working well on both desktop and mobile devices. It includes user experience enhancements like a dark mode toggle, language selection (German and English), lazy loading for images, sticky navigation elements, a "scroll to top" button, and persistent user preferences (filters, locked Pokémon, team, language, theme).

## Key Features

*   **⚙️ Customizable Generation:** Specify the exact number of *new* random Pokémon to generate (0 is possible).
*   **🔬 Extensive Filtering:**
    *   By Generation (1-9).
    *   By Type (multi-select).
    *   By Evolution Stage (position in chain: Basic, Stage 1, Stage 2).
    *   By Evolution Chain Length (total stages: 1, 2, 3).
    *   Inclusion/Exclusion of Legendary, Mythical, Mega, and Alolan forms.
    *   By Base Stat Total (BST) range (Min/Max).
    *   Name filtering for generated results.
    *   Collapsible filter sections with "Select/Deselect All" options.
    *   **Persistent Filters:** Settings are saved and restored across sessions using `localStorage`.
*   **🤝 Team Builder:**
    *   Add/Remove Pokémon to a persistent team (max 6 members) using icons on cards.
    *   Dedicated team display section with compact Pokémon cards.
    *   Simple team type weakness/resistance summary using icons.
    *   Detailed type effectiveness analysis table (toggleable view).
    *   Team composition persists across browser sessions.
*   **🔒 Pokémon Locking:**
    *   Click the lock icon on a card to persistently save it.
    *   Locked Pokémon appear in a separate compact section at the top.
    *   Locked list persists across browser sessions.
*   **🔄 Advanced Sorting:** Sort the *generated* (non-locked) Pokémon list by:
    *   Pokédex ID (#) (Asc/Desc)
    *   Name (A-Z) (Asc/Desc, respects current language)
    *   Primary Type (Leaf Icon) (Asc/Desc, respects current language)
    *   Base Stat Total (BST) (Gauge Icon) (Asc/Desc)
    *   Shiny Status (Sparkles Icon) (Shiny first/last)
    *   Legendary Status (Rocket Icon) (Legendary first/last)
    *   Mythical Status (Feather Icon) (Mythical first/last)
    *   Mega Status (Gem Icon) (Mega first/last)
    *   Alolan Status (Beach Umbrella Icon) (Alolan first/last)
    *   Random Shuffle (Shuffle Icon)
*   **✨ Shiny Toggle:** Click Pokémon images to view shiny sprites; status persists visually.
*   **🔗 External Links:** Quick access to detailed Pokémon info on PokéWiki (German).
*   **🌓 UI Enhancements:**
    *   Dark Mode support (persistent).
    *   Language switching (German/English) with persistent preference.
    *   Fully responsive design for desktop, tablet, and mobile.
    *   Sticky "Generate" button and sorting controls appear when scrolling.
    *   "Scroll to Top" button.
    *   Lazy loading for Pokémon images.
    *   Clear status messages indicating generation results, filter effects, and loading state.
    *   Informative "No Results" message.
    *   Button to clear all app-specific data from `localStorage`.
*   ** PWA Ready:** Includes a Manifest file and Service Worker for offline capabilities and installability.

## Technology Stack

*   **HTML5:** Structure and content (`index.html`).
*   **CSS3:** Styling, layout (Flexbox/Grid), responsiveness, dark mode (`css/style.css`).
*   **JavaScript (Vanilla):** Core logic, DOM manipulation, API fetching (`fetch`), event handling, filtering, sorting, `localStorage` management (`js/app.js`, `js/i18n.js`, `js/pokedex-data.js`).
*   **PokeAPI (v2):** Source for Pokémon data and sprites.
*   **Font Awesome:** UI Icons.
*   **Google Fonts:** `Inter` font.
*   **Flagcdn.com:** Language switcher flag icons.
*   **partywhale/pokemon-type-icons:** Pokémon type icons.
*   **Service Worker:** For PWA offline capabilities (`sw.js`).
*   **Web App Manifest:** For PWA installability (`manifest.json`).

## File Structure
```
pokemon-generator/
├── css/
│ └── style.css # All CSS styles
├── js/
│ ├── app.js # Main application logic, event listeners, rendering
│ ├── i18n.js # Translations object and language functions
│ └── pokedex-data.js # Static data (typeChart, constants, cache keys)
├── icons/
│ ├── icon-192.png # PWA Icon 192x192
│ └── icon-512.png # PWA Icon 512x512
├── index.html # Main HTML structure
├── manifest.json # PWA Manifest
├── sw.js # Service Worker
├── README.md # This Readme file
└── favicon.ico # Favicon
```
## How to Use

1.  **Access the App:**
    *   Visit the live demo: **[Pokémon Generator](https://cschaf.github.io/pokemon-generator/index.html)**
    *   *Alternatively:* Clone this repository (`git clone https://github.com/CSchaf/pokemon-generator.git`), navigate into the directory, and open `index.html` locally in your browser (or serve it using a simple local server).
2.  **Set Filters:**
    *   Use the input field to specify the **Number of new Pokémon to generate**.
    *   Expand the collapsible filter sections (Generation, Types, Evolution, Special, BST).
    *   Check/uncheck boxes and enter BST values to define criteria. Use the "Select/Deselect All" icons (<i class="fa-solid fa-square-check"></i> / <i class="fa-solid fa-square-minus"></i>) for convenience. Filters persist.
3.  **Generate:** Click the main "Generate Pokémon!" button (or the sticky one that appears top-right when scrolling).
4.  **View Results:**
    *   **Locked Pokémon** (if any) appear first in a compact section.
    *   **Current Team** (if any) is displayed next, with compact cards and type analysis below. Click the analysis toggle button for the detailed table view.
    *   **Newly Generated Pokémon** appear below the team section, sorted by the current criteria (default: ID).
    *   Use the **Name Filter** input (appears above generated results) to quickly search within the generated list.
5.  **Interact with Cards:**
    *   Click a Pokémon's image to toggle its **Shiny** form.
    *   Click the **Pokédex number or name** to open its PokéWiki page in a new tab.
    *   Click the **lock/unlock icon** (<i class="fa-solid fa-unlock"></i> / <i class="fa-solid fa-lock"></i> top-left) on generated or locked cards to manage the persistent Locked list.
    *   Click the **plus/minus icon** (<i class="fa-solid fa-plus"></i> / <i class="fa-solid fa-minus"></i> bottom-right) on generated or locked cards to manage your Team.
    *   Click the **'X' icon** (<i class="fa-solid fa-times-circle"></i> top-right) on cards *within the Team section* to remove them directly.
6.  **Sort Results:** When scrolled down, use the sorting icons (next to the sticky Generate button) to re-order the *newly generated* Pokémon list. Click an icon to sort by that criteria (ascending/default), click again to reverse the order (descending, indicated by <i class="fa-solid fa-arrow-up-short-wide"></i> / <i class="fa-solid fa-arrow-down-wide-short"></i>). Random (<i class="fa-solid fa-shuffle"></i>) only shuffles.
7.  **UI Options:**
    *   Use the **moon/sun icon** (<i class="fa-solid fa-moon"></i> / <i class="fa-solid fa-sun"></i> top-right) to toggle Dark Mode.
    *   Click the **flag icons** (<img src='https://flagcdn.com/de.svg' alt='DE' style='width:1em;height:auto;vertical-align:middle;'> / <img src='https://flagcdn.com/us.svg' alt='EN' style='width:1em;height:auto;vertical-align:middle;'>) to switch languages.
    *   Use the **arrow button** (<i class="fa-solid fa-arrow-up"></i> bottom-right, appears on scroll) to return to the top.
    *   Use the **"Alle App-Daten löschen" / "Clear All App Data"** button at the bottom to reset all stored preferences and cached data.

## Development Notes

*   This project's code, including feature implementation and refinements, was developed iteratively with the assistance of **Gemini**, a large language model from Google, based on user prompts and requirements.
*   Focus was placed on using vanilla JavaScript for core functionality.
*   `localStorage` is used for persisting:
    *   Dark Mode preference (`darkMode`)
    *   Language preference (`language`)
    *   List of Locked Pokémon IDs (`lockedPokemonIds_v1`)
    *   Selected filter states (`pokemonGeneratorFilterState_v1`)
    *   Current team member IDs (`pokemonTeamMembers_v1`)
    *   List of Pokémon IDs displayed as Shiny (`shinyPokemonIds_v1`)
    *   The main Pokémon data cache (`pokemonGeneratorCache_v5`) - *Note: Cache key version may increment.*
*   The application includes validation for cached data and will attempt to refresh from the API if the cache seems incomplete or outdated.

## Data Sources, Credits & Attributions

This project utilizes several excellent free resources:

*   **Primary Data & Sprites:** All Pokémon data (names, types, stats, evolution, generation, species details) and Pokémon sprite images (normal and shiny official artwork) are fetched from the **[PokeAPI (v2)](https://pokeapi.co/)**.
*   **Type Icons:** Pokémon type icons are provided by **[partywhale/pokemon-type-icons on GitHub](https://github.com/partywhale/pokemon-type-icons)** (MIT License).
*   **Flag Icons:** Language switcher flag icons are sourced from **[Flag Cdn API (flagcdn.com)](https://flagcdn.com/)**.
*   **UI Icons:** General UI icons are from **[Font Awesome (Free version)](https://fontawesome.com/)**.
*   **Font:** The `Inter` typeface is from **[Google Fonts](https://fonts.google.com/specimen/Inter)**.
*   **Reference Links:** Generated Pokémon link to their respective pages on **[PokéWiki (German)](https://www.pokewiki.de/)**.

## Copyright and Disclaimer

*   Pokémon and all associated names, characters, and images are trademarks and copyrights of © Nintendo, Creatures Inc., Game Freak Inc., and The Pokémon Company International.
*   This project is a fan-made application created for personal, non-commercial, and educational purposes. It is not affiliated with, sponsored, or endorsed by Nintendo, Creatures Inc., Game Freak Inc., or The Pokémon Company International.
*   All assets used from third-party sources are used in accordance with their respective licenses and terms of service. Users of this project's code should also respect these licenses.
*   Support provided via the PayPal.Me link serves as an appreciation for the development effort and does not constitute a purchase of Pokémon-related content or licenses.

## Support the Project

If you enjoy using the Pokémon Generator and would like to support its continued development and upkeep, you can send a small donation:

[Support me via PayPal.Me](https://paypal.me/cschaf)

Your support is greatly appreciated!

## License

The code for this Pokémon Generator application itself is licensed under the **MIT License**.
(You may want to add a `LICENSE` file with the MIT license text to your repository root).

The assets it utilizes (Pokémon data, images, type icons, flag icons, UI icons, fonts) are subject to the terms and licenses of their respective creators and providers, as detailed in the "Data Sources, Credits & Attributions" section.
