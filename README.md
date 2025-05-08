# Pokémon Generator ✨

A dynamic web application that generates random Pokémon based on user-defined filters, fetching data live from the PokeAPI. Features include Pokémon locking, sorting, shiny toggling, and multi-language support.

**[🚀 Launch the Pokémon Generator Application](https://cschaf.github.io/pokemon-generator/index.html)**

<!-- Optional: Add a screenshot or GIF here -->
<!-- ![Pokémon Generator Screenshot](link_to_screenshot.png) -->

## Project Description

This project is a feature-rich, web-based Pokémon Generator designed for fans and developers alike. It allows users to explore the world of Pokémon by generating customized lists based on a variety of criteria, including:

*   **Generation:** Select specific Pokémon generations (1-9).
*   **Type:** Filter by one or more of the 18 Pokémon types.
*   **Evolution:** Filter by position in the evolution chain (Basic, Stage 1, Stage 2) and the total length of the chain (1, 2, or 3 stages).
*   **Special Categories:** Include or exclude Legendary and Mythical Pokémon.

The application fetches Pokémon data and images dynamically from the PokeAPI, ensuring up-to-date information. Key interactive features include:

*   **Locking:** Persistently "lock" favorite Pokémon, which are then displayed in a separate, dedicated section and excluded from subsequent random generations. Locked Pokémon cards are displayed in a more compact format.
*   **Sorting:** Sort the *newly generated* Pokémon list by Pokédex ID, Name (alphabetical), or primary Type. Random sorting is also available.
*   **Shiny Toggle:** Click on any Pokémon's image to instantly toggle between its normal and shiny artwork (if available).
*   **External Links:** Click on a Pokémon's name or Pokédex number to view its detailed page on [Pokémon Database](https://pokemondb.net/pokedex/).

The interface is designed to be modern, intuitive, and responsive, working well on both desktop and mobile devices. It includes user experience enhancements like a dark mode toggle, language selection (German and English), lazy loading for images, sticky navigation elements for easy access on long pages, and a "scroll to top" button.

## Key Features

*   **⚙️ Customizable Generation:** Specify the exact number of *new* random Pokémon to generate.
*   **🔬 Extensive Filtering:**
    *   By Generation (1-9).
    *   By Type (multi-select).
    *   By Evolution Stage (position in chain).
    *   By Evolution Chain Length.
    *   Inclusion/Exclusion of Legendary & Mythical Pokémon.
    *   Collapsible filter sections for a cleaner interface.
    *   "Select/Deselect All" options for Generation and Type filters.
*   **🔒 Pokémon Locking:**
    *   Click the lock icon on a card to save it.
    *   Locked Pokémon appear in a separate section at the top.
    *   Locked Pokémon persist across browser sessions (using `localStorage`).
    *   Locked cards use a compact layout to save space.
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

## Technology Stack

*   **HTML5:** Structure and content.
*   **CSS3:** Styling, layout (including Flexbox and Grid), responsiveness, and dark mode theming.
*   **JavaScript (Vanilla):** DOM manipulation, API fetching (`fetch`), event handling, filtering logic, sorting, `localStorage` management.
*   **PokeAPI (v2):** Source for all Pokémon data and sprite URLs.
*   **Font Awesome:** Icons for UI elements (theme toggle, locks, sorting, etc.).
*   **Google Fonts:** `Inter` font for the UI text.
*   **Flagcdn.com:** Source for language switcher flag icons.
*   **partywhale/pokemon-type-icons:** Source for Pokémon type icons used in filters and cards.

## How to Use

1.  **Access the App:**
    *   Visit the live demo: **[Pokémon Generator](https://cschaf.github.io/pokemon-generator/index.html)**
    *   *Alternatively:* Clone this repository (`git clone https://github.com/CSchaf/pokemon-generator.git`) and open `index.html` locally in your browser.
2.  **Set Filters:**
    *   Use the input field to specify the **Number of new Pokémon to generate**.
    *   Expand the collapsible filter sections (Generation, Types, Evolution, etc.).
    *   Check/uncheck the boxes to define your desired criteria. Use the "Select/Deselect All" icons within filter groups for convenience.
3.  **Generate:** Click the main "Generate Pokémon!" button (or the sticky one that appears when scrolling).
4.  **View Results:**
    *   **Locked Pokémon** (if any) will appear first in their own compact section.
    *   **Newly Generated Pokémon** will appear below, sorted according to the current sort selection (default is by ID).
5.  **Interact with Cards:**
    *   Click a Pokémon's image to toggle its **Shiny** form.
    *   Click the **Pokédex number or name** to open its Pokémon Database page in a new tab.
    *   Click the **lock/unlock icon** in the top-left corner of a card to add/remove it from the persistent Locked Pokémon list.
6.  **Sort Results:** When scrolled down, use the sorting icons (next to the sticky Generate button) to re-order the *newly generated* Pokémon. The direction arrow indicates ascending/descending order. Random shuffle is also available.
7.  **UI Options:**
    *   Use the **moon/sun icon** in the top-right to toggle Dark Mode.
    *   Click the **flag icons** to switch between German and English interface text.
    *   Use the **arrow button** in the bottom-right (appears on scroll) to quickly return to the top of the page.

## Development Notes

*   This project's code, including feature implementation and refinements, was developed iteratively with the assistance of **Gemini**, a large language model from Google, based on user prompts and requirements.
*   Focus was placed on using vanilla JavaScript for core functionality.
*   Browser caching is relied upon for Pokémon sprites and type icons; no complex manual image caching is implemented.
*   `localStorage` is used for persisting Dark Mode preference, Language preference, and the list of Locked Pokémon IDs.

## Data Source & Attributions

*   All Pokémon data and sprite images are provided by the **[PokeAPI (pokeapi.co)](https://pokeapi.co/)**.
*   Pokémon type icons are provided by **[partywhale/pokemon-type-icons](https://github.com/partywhale/pokemon-type-icons)** on GitHub.
*   Flag icons are provided by **[Flagcdn.com](https://flagcdn.com/)**.

## Copyright and Disclaimer

*   Pokémon and all associated names, characters, and images are trademarks and copyrights of © Nintendo, Creatures Inc., Game Freak Inc. This project uses data and assets under fair use principles for non-commercial, educational, and fan purposes.
*   This project is a fan-made application and is not affiliated with, sponsored, or endorsed by Nintendo, Game Freak, or The Pokémon Company.

## License

The code for this generator is licensed under the MIT License. See the [LICENSE](LICENSE) file in the repository root for the full text. Assets used (like Pokémon data/images and type icons) are subject to their respective sources' licenses and terms.
