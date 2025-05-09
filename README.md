# Pokémon Generator ✨

A dynamic web application that generates random Pokémon based on user-defined filters, fetching data live from the PokeAPI. Features include a persistent Team Builder, Pokémon locking, advanced sorting, shiny toggling, and multi-language support.

**[🚀 Launch the Pokémon Generator Application](https://cschaf.github.io/pokemon-generator/index.html)**

## Project Description

This project is a feature-rich, web-based Pokémon Generator designed for fans and developers alike. It allows users to explore the world of Pokémon by generating customized lists based on a variety of criteria, including:

*   **Generation:** Select specific Pokémon generations (1-9).
*   **Type:** Filter by one or more of the 18 Pokémon types.
*   **Evolution:** Filter by position in the evolution chain (Basic, Stage 1, Stage 2) and the total length of the chain (1, 2, or 3 stages).
*   **Special Categories:** Include or exclude Legendary and Mythical Pokémon.

The application fetches Pokémon data and images dynamically from the PokeAPI, ensuring up-to-date information. Key interactive features include:

*   **Team Builder:** Select up to 6 Pokémon to form a team. The team is displayed in a dedicated section, persists across sessions, and includes a basic type-weakness/resistance analysis.
*   **Locking:** Persistently "lock" favorite Pokémon, which are then displayed in a separate, dedicated section and excluded from subsequent random generations. Locked Pokémon cards are displayed in a more compact format.
*   **Sorting:** Sort the *newly generated* Pokémon list by Pokédex ID, Name (alphabetical), or primary Type. Random sorting is also available.
*   **Shiny Toggle:** Click on any Pokémon's image to instantly toggle between its normal and shiny artwork (if available).
*   **External Links:** Click on a Pokémon's name or Pokédex number to view its detailed page on [Pokémon Database](https://pokemondb.net/pokedex/).

The interface is designed to be modern, intuitive, and responsive, working well on both desktop and mobile devices. It includes user experience enhancements like a dark mode toggle, language selection (German and English), lazy loading for images, sticky navigation elements for easy access on long pages, a "scroll to top" button, and persistent filter settings.

If you enjoy this tool and would like to support its development, you can:
[Support me via PayPal.Me](https://paypal.me/DEIN_PAYPALME_LINK_ODER_NAME) <!-- Ersetze DEIN_PAYPALME_LINK_ODER_NAME -->

## Key Features

*   **⚙️ Customizable Generation:** Specify the exact number of *new* random Pokémon to generate.
*   **🔬 Extensive Filtering:**
    *   By Generation (1-9).
    *   By Type (multi-select).
    *   By Evolution Stage (position in chain).
    *   By Evolution Chain Length.
    *   Inclusion/Exclusion of Legendary & Mythical Pokémon.
    *   Collapsible filter sections for a cleaner interface.
    *   "Select/Deselect All" options for Generation, Type, Evolution Stage, and Chain Length filters.
    *   **Persistent Filters:** Your selected filter settings are saved and restored across browser sessions.
*   **🤝 Team Builder:**
    *   Add/Remove Pokémon to a persistent team (max 6 members) using icons on each card.
    *   Dedicated team display section with compact Pokémon cards.
    *   Basic team type weakness and resistance analysis displayed using type icons.
    *   Team composition persists across browser sessions.
*   **🔒 Pokémon Locking:**
    *   Click the lock icon on a card to save it.
    *   Locked Pokémon appear in a separate section at the top.
    *   Locked Pokémon persist across browser sessions.
    *   Locked cards use a compact layout.
*   **🔄 Sorting:** Sort the *generated* (non-locked) Pokémon list by:
    *   Pokédex ID (Ascending/Descending)
    *   Name (Alphabetical, Ascending/Descending)
    *   Primary Type (Alphabetical, Ascending/Descending)
    *   Random Shuffle
*   **✨ Shiny Toggle:** Click Pokémon images to view shiny sprites.
*   **🔗 External Links:** Quick access to detailed Pokémon info on Pokémon Database.
*   **🌓 UI Enhancements:**
    *   Dark Mode support.
    *   Language switching (German/English) with persistent preference.
    *   Fully responsive design for desktop, tablet, and mobile.
    *   Sticky "Generate" button and sorting controls appear when scrolling down.
    *   "Scroll to Top" button for easy navigation.
    *   Lazy loading for Pokémon images for improved performance.
    *   Clear status messages indicating generation results and filter effects.
    *   Informative "No Results" message directly in the results area if filters yield no matches.
    *   Button to clear all app-specific data from `localStorage` (cache, settings, locked Pokémon, team).

## Technology Stack

*   **HTML5:** Structure and content.
*   **CSS3:** Styling, layout (including Flexbox and Grid), responsiveness, and dark mode theming.
*   **JavaScript (Vanilla):** DOM manipulation, API fetching (`fetch`), event handling, filtering logic, sorting, `localStorage` management.
*   **PokeAPI (v2):** Primary source for all Pokémon data (details, species, evolution chains, sprites).
*   **Font Awesome:** Icons for UI elements (theme toggle, locks, sorting, collapsible sections, team actions, etc.).
*   **Google Fonts:** `Inter` font for the UI text.
*   **Flagcdn.com:** Source for language switcher flag icons.
*   **partywhale/pokemon-type-icons:** Source for Pokémon type icons used in filters, cards, and team analysis.

## How to Use

1.  **Access the App:**
    *   Visit the live demo: **[Pokémon Generator](https://cschaf.github.io/pokemon-generator/index.html)**
    *   *Alternatively:* Clone this repository (`git clone https://github.com/CSchaf/pokemon-generator.git`) and open `index.html` locally in your browser.
2.  **Set Filters:**
    *   Use the input field to specify the **Number of new Pokémon to generate**.
    *   Expand the collapsible filter sections (Generation, Types, Evolution, etc.).
    *   Check/uncheck the boxes to define your desired criteria. Use the "Select/Deselect All" icons within filter groups for convenience. Your filter choices will be saved for your next visit.
3.  **Generate:** Click the main "Generate Pokémon!" button (or the sticky one that appears when scrolling).
4.  **View Results:**
    *   **Locked Pokémon** (if any) will appear first in their own compact section.
    *   **Current Team** (if any) will be displayed in its dedicated section, also with compact cards and type analysis.
    *   **Newly Generated Pokémon** will appear below, sorted according to the current sort selection (default is by ID).
5.  **Interact with Cards:**
    *   Click a Pokémon's image to toggle its **Shiny** form.
    *   Click the **Pokédex number or name** to open its Pokémon Database page in a new tab.
    *   Click the **lock/unlock icon** (top-left of a card in the "Generated" or "Locked" list) to add/remove it from the persistent Locked Pokémon list.
    *   Click the **plus/minus icon** (bottom-right of a card in the "Generated" or "Locked" list) to add/remove the Pokémon from your Team.
    *   Click the **'X' icon** (top-right of a card in the "Current Team" list) to remove it directly from the team.
6.  **Sort Results:** When scrolled down, use the sorting icons (next to the sticky Generate button) to re-order the *newly generated* Pokémon. The direction arrow indicates ascending/descending order. Random shuffle is also available.
7.  **UI Options:**
    *   Use the **moon/sun icon** in the top-right to toggle Dark Mode.
    *   Click the **flag icons** to switch between German and English interface text.
    *   Use the **arrow button** in the bottom-right (appears on scroll) to quickly return to the top of the page.
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
    *   The main Pokémon data cache (`pokemonGeneratorCache_v4`)
*   The application includes a check for incomplete Pokémon data cache and will attempt to refresh if the cached data seems too small.

## Data Sources, Credits & Attributions

This project utilizes several excellent free resources:

*   **Primary Data & Sprites:** All Pokémon data (names, types, evolution details, Pokédex numbers, generation info, legendary/mythical status) and Pokémon sprite images (normal and shiny) are fetched from the **[PokeAPI (v2)](https://pokeapi.co/)**. This is an incredible, free, and open RESTful API.
*   **Type Icons:** The distinctive Pokémon type icons used throughout the application (in filters, on Pokémon cards, and in the team analysis) are provided by **[partywhale/pokemon-type-icons on GitHub](https://github.com/partywhale/pokemon-type-icons)**. These are licensed under the MIT License.
*   **Flag Icons:** Language switcher flag icons (German and US flags) are sourced from **[Flag Cdn API (flagcdn.com)](https://flagcdn.com/)**. These are provided under a permissive license (likely public domain or similar, but always good to verify their terms for specific use cases).
*   **UI Icons:** General user interface icons (dark mode toggle, lock, sort arrows, collapsible chevrons, team add/remove, etc.) are from **[Font Awesome (Free version)](https://fontawesome.com/)**.
*   **Font:** The `Inter` typeface used for the application's text is from **[Google Fonts](https://fonts.google.com/specimen/Inter)**.
## Copyright and Disclaimer

*   Pokémon and all associated names, characters, and images are trademarks and copyrights of © Nintendo, Creatures Inc., Game Freak Inc., and The Pokémon Company International.
*   This project is a fan-made application created for personal, non-commercial, and educational purposes. It is not affiliated with, sponsored, or endorsed by Nintendo, Creatures Inc., Game Freak Inc., or The Pokémon Company International.
*   All assets used from third-party sources (PokeAPI, partywhale/pokemon-type-icons, Flagcdn.com, Font Awesome, Google Fonts) are used in accordance with their respective licenses and terms of service. Users of this project's code should also respect these licenses.
*   Should you choose to support the development of this tool via the provided PayPal.Me link (or similar platforms), this serves as an appreciation for the development time and effort invested in this fan project and does not constitute a purchase of Pokémon-related content or licenses.

## Support the Project

If you enjoy using the Pokémon Generator and would like to support its continued development and upkeep, you can send a small donation:

[Support me via PayPal.Me](https://paypal.me/cschaf)

Your support is greatly appreciated!

## License

The code for this Pokémon Generator application itself is licensed under the MIT License. See the `LICENSE` file in the repository root for the full text if you have one (if not, you can state "This project is open source under the MIT License.").
The assets it utilizes (Pokémon data, images, type icons, flag icons, UI icons, fonts) are subject to the terms and licenses of their respective creators and providers, as detailed in the "Data Sources, Credits & Attributions" section.
