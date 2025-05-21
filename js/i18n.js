const translations = {
    de: {
        appTitle: "Pokémon Generator",
        instructionsTitle: "Anleitung",
        instructionsIntro: "Willkommen beim Pokémon Generator! Hier kannst du zufällige Pokémon basierend auf deinen Filtern entdecken.",
        usageTitle: "So funktioniert's:",
        usageStep1: "<strong>Filter wählen:</strong> Öffne die Filterbereiche (Generation, Typen, etc.) und wähle deine Kriterien aus. Nutze die <i class='fa-solid fa-square-check'></i> / <i class='fa-solid fa-square-minus'></i> Icons, um schnell alle Optionen einer Gruppe an-/abzuwählen.",
        usageStep2: "<strong>Anzahl festlegen:</strong> Gib an, wie viele <strong>neue</strong> Pokémon generiert werden sollen (0 ist möglich, um nur gesperrte anzuzeigen). Du kannst auch die Enter-Taste drücken, um die Generierung zu starten.",
        usageStep3: "<strong>Generieren:</strong> Klicke auf den \"Pokémon generieren!\" Knopf (oder den kleineren, der beim Scrollen oben rechts erscheint).",
        usageStep4: "<strong>Erkunden:</strong><ul><li>Klicke auf ein Pokémon-Bild, um zwischen der normalen und der <i class='fa-solid fa-star' style='color: var(--shiny-color);'></i> Shiny-Form zu wechseln (falls verfügbar).</li><li>Klicke auf die Pokédex-Nummer oder den Namen, um die Detailseite auf PokéWiki in einem neuen Tab zu öffnen.</li><li>Klicke auf das <i class='fa-solid fa-unlock'></i> / <i class='fa-solid fa-lock'></i> Symbol oben links auf einer Karte (in der generierten oder gesperrten Liste), um dieses Pokémon zu sperren oder zu entsperren. Gesperrte Pokémon erscheinen oben in einem separaten Bereich und werden bei der nächsten Generierung nicht neu ausgewählt.</li><li>Klicke auf das <i class='fa-solid fa-plus'></i> / <i class='fa-solid fa-minus'></i> Symbol unten rechts auf einer Karte (in der generierten oder gesperrten Liste), um es zu deinem Team hinzuzufügen oder daraus zu entfernen (max. 6 Pokémon).</li><li>Klicke auf das <i class='fa-solid fa-times-circle'></i> Symbol oben rechts auf einer Karte im 'Aktuelles Team'-Bereich, um ein Pokémon direkt aus dem Team zu entfernen.</li></ul>",
        usageStep5: "<strong>Sortieren:</strong> Wenn du nach unten scrollst, erscheint neben dem \"Generieren\"-Knopf eine Sortierleiste. Klicke auf <i class='fa-solid fa-hashtag'></i> (ID), <i class='fa-solid fa-arrow-down-a-z'></i> (Name), <i class='fa-solid fa-leaf'></i> (Typ), <i class='fa-solid fa-gauge-high'></i> (BST), <i class='fa-solid fa-star'></i> (Shiny), <i class='fa-solid fa-rocket'></i> (Legendär), <i class='fa-solid fa-feather'></i> (Mysteriös), <i class='fa-solid fa-gem'></i> (Mega), <i class='fa-solid fa-umbrella-beach'></i> (Alola) oder <i class='fa-solid fa-shuffle'></i> (Zufall), um die <strong>neu generierten</strong> Pokémon zu sortieren. Erneutes Klicken (außer bei Zufall) kehrt die Richtung um (<i class='fa-solid fa-arrow-up-short-wide'></i> / <i class='fa-solid fa-arrow-down-wide-short'></i>).",
        usageStep6: "<strong>Ansicht anpassen:</strong> Nutze die Icons oben rechts für den <i class='fa-solid fa-moon'></i> / <i class='fa-solid fa-sun'></i> Dark Mode oder den Sprachwechsel (<img src='https://flagcdn.com/de.svg' alt='DE' style='width:1em;height:auto;vertical-align:middle;'> / <img src='https://flagcdn.com/us.svg' alt='EN' style='width:1em;height:auto;vertical-align:middle;'>).",
        usageStep7: "Mit dem <i class='fa-solid fa-arrow-up'></i> Knopf unten rechts gelangst du schnell wieder nach oben.",
        countLabel: "Anzahl neuer Pokémon zum Generieren:",
        generationLabel: "Generation:",
        typesLabel: "Typen:",
        typesLabelShort: "Typ",
        tooltipSelectAll: "Alle auswählen",
        tooltipDeselectAll: "Alle abwählen",
        tooltipLock: "Pokémon sperren",
        tooltipUnlock: "Pokémon entsperren",
        tooltipSortById: "Nach ID sortieren",
        tooltipSortByName: "Nach Name sortieren",
        tooltipSortByType: "Nach Typ sortieren",
        tooltipSortByBST: "Nach BST sortieren",
        tooltipSortByShiny: "Nach Shiny sortieren",
        tooltipSortByLegendary: "Nach Legendär sortieren",
        tooltipSortByMythical: "Nach Mysteriös sortieren",
        tooltipSortByMega: "Nach Mega sortieren",
        tooltipSortByAlolan: "Nach Alola-Form sortieren",
        tooltipSortByRandom: "Zufällig sortieren",
        lockedPokemonSectionTitle: "Gesperrte Pokémon",
        expandAllLabel: "Alle ausklappen",
        collapseAllLabel: "Alle einklappen",
        gen1_label: "Gen 1 (Kanto)", gen2_label: "Gen 2 (Johto)", gen3_label: "Gen 3 (Hoenn)", gen4_label: "Gen 4 (Sinnoh)", gen5_label: "Gen 5 (Einall)", gen6_label: "Gen 6 (Kalos)", gen7_label: "Gen 7 (Alola)", gen8_label: "Gen 8 (Galar)", gen9_label: "Gen 9 (Paldea)",
        type_normal: "Normal", type_fire: "Feuer", type_water: "Wasser", type_electric: "Elektro", type_grass: "Pflanze", type_ice: "Eis", type_fighting: "Kampf", type_poison: "Gift", type_ground: "Boden", type_flying: "Flug", type_psychic: "Psycho", type_bug: "Käfer", type_rock: "Gestein", type_ghost: "Geist", type_dragon: "Drache", type_dark: "Unlicht", type_steel: "Stahl", type_fairy: "Fee",
        evolutionPositionLabel: "Evolution (Position in Kette):",
        evo_basic: "Grundform", evo_stage1: "Erste Entwicklung", evo_stage2: "Zweite Entwicklung",
        evolutionChainLengthLabel: "Anzahl Entwicklungstufen (Gesamtlänge der Reihe):",
        chain_length1: "Keine Entwicklung (1 Stufe)", chain_length2: "Eine Entwicklung (2 Stufen)", chain_length3: "Zwei Entwicklungen (3 Stufen)",
        specialPokemonLabel: "Spezielle Pokémon:",
        includeLegendaryLabel: "Legendäres Pokémon", includeMythicalLabel: "Mysteriöses Pokémon", includeMegaLabel: "Mega Pokémon", includeAlolanLabel: "Alola Pokémon",
        bstLabel: "Basiswertsumme (BST):",
        bstMinLabel: "Min. BST:",
        bstMaxLabel: "Max. BST:",
        bstMinPlaceholder: "z.B. 100",
        bstMaxPlaceholder: "z.B. 600",
        cardBST: "BST",
        generateButton: "Pokémon generieren!",
        loadingData: "Lade Pokémon-Daten von der PokeAPI...",
        loadedFromCache: "Pokémon-Daten aus Cache geladen!",
        progressText: (loaded, total) => `${loaded} / ${total} Pokémon verarbeitet`,
        loadingError: "Fehler beim Laden der Pokémon-Daten:",
        status_locked_only: (locked) => `${locked} Pokémon gesperrt. Es wurden keine neuen Pokémon angefordert.`,
        status_locked_and_generated: (locked, generated, totalPossible) => `${locked} Pokémon gesperrt. ${generated} von ${totalPossible} passenden neuen Pokémon generiert.`,
        status_locked_no_new_match: (locked) => `${locked} Pokémon gesperrt. Keine weiteren neuen Pokémon entsprechen den Filtern.`,
        status_generated_only: (generated, totalPossible) => `${generated} von ${totalPossible} passenden neuen Pokémon generiert.`,
        status_no_new_match: "Keine neuen Pokémon entsprechen deinen Filtern.",
        status_no_pokemon_at_all: "Keine Pokémon (gesperrt oder neu) entsprechen deinen Filtern.",
        status_initial_prompt: "Wähle Filter und generiere Pokémon!",
        status_initial_prompt_append_generate: "Drücke 'Pokémon generieren!', um neue zu erhalten.",
        noResultsInContainer: "Keine Pokémon entsprechen deinen aktuellen Filtern. Versuche, sie anzupassen!",
        nameFilterLabel: "Generierte Pokémon nach Namen filtern:",
        cardGeneration: "Generation", cardEvolution: "Entwicklung", cardEvolutionNoEvo: "(Keine Entwicklung)", cardEvolutionStage: "Stufe", cardTotalStages: "Stufen gesamt:",
        darkModeToggle: "Dark Mode umschalten",
        attributionText: 'Daten und Bilder bereitgestellt von der <a href="https://pokeapi.co/" target="_blank">PokeAPI</a>.<br>Pokémon © 2025 Nintendo, Creatures Inc., Game Freak Inc. Alle Rechte vorbehalten. Alle Bilder der Pokémon-Typen wurden von <a href="https://github.com/partywhale/pokemon-type-icons/" target="_blank">partywhale</a> bereitgestellt.',
        clearCacheButton: "Alle App-Daten löschen",
        confirmClearCache: "Möchtest du wirklich alle lokal gespeicherten Daten dieser App (Cache, Einstellungen, etc.) löschen? Die Seite wird danach neu geladen.",
        cacheCleared: "Alle lokalen Daten gelöscht. Die Seite wird neu geladen.",
        quotaExceededError: "Speicherlimit erreicht. Pokémon-Daten konnten nicht vollständig offline gespeichert werden. Einige Funktionen sind möglicherweise beeinträchtigt.",
        teamBuilderSectionTitle: "Aktuelles Team",
        addToTeamTooltip: "Zum Team hinzufügen",
        removeFromTeamTooltip: "Aus Team entfernen",
        removeFromTeamOnTeamCardTooltip: "Aus Team entfernen",
        teamFullMessage: "Dein Team ist voll (max. 6 Pokémon)!",
        commonWeaknessesLabel: "Häufige Schwächen:",
        commonResistancesLabel: "Häufige Resistenzen:",
        noTeamAnalysis: "Keine signifikanten gemeinsamen Schwächen oder Resistenzen für mehrere Teammitglieder gefunden.",
        allWeaknessesBalanced: "Alle Schwächen sind gut im Team ausbalanciert.",
        allResistancesBalanced: "Alle Resistenzen sind gut im Team ausbalanciert.",
        toggleAnalysisDetail: "Detailansicht anzeigen",
        toggleAnalysisSimple: "Einfache Ansicht anzeigen",
        teamChartTitle: "Typen-Effektivität des Teams",
        attackingTypeHeader: "Angriffstyp",
        totalWeakLabel: "Ges. Anfällig",
        totalResistLabel: "Ges. Resistent"
    },
    en: {
        appTitle: "Pokémon Generator",
        instructionsTitle: "Instructions",
        instructionsIntro: "Welcome to the Pokémon Generator! Discover random Pokémon based on your selected filters.",
        usageTitle: "How it works:",
        usageStep1: "<strong>Select Filters:</strong> Expand the filter sections (Generation, Types, etc.) and choose your criteria. Use the <i class='fa-solid fa-square-check'></i> / <i class='fa-solid fa-square-minus'></i> icons to quickly select/deselect all options in a group.",
        usageStep2: "<strong>Set Count:</strong> Enter how many <strong>new</strong> Pokémon you want to generate (0 is possible to only show locked Pokémon). You can also press Enter to start generation.",
        usageStep3: "<strong>Generate:</strong> Click the \"Generate Pokémon!\" button (or the smaller one that appears top-right when scrolling).",
        usageStep4: "<strong>Explore:</strong><ul><li>Click a Pokémon's image to toggle between its normal and <i class='fa-solid fa-star' style='color: var(--shiny-color);'></i> Shiny form (if available).</li><li>Click the Pokédex number or name to open its detail page on PokéWiki in a new tab.</li><li>Click the <i class='fa-solid fa-unlock'></i> / <i class='fa-solid fa-lock'></i> icon on the top-left of a card (in the generated or locked list) to lock or unlock that Pokémon. Locked Pokémon appear in a separate section above and won't be randomly generated again.</li><li>Click the <i class='fa-solid fa-plus'></i> / <i class='fa-solid fa-minus'></i> icon on the bottom-right of a card (in the generated or locked list) to add or remove it from your team (max 6 Pokémon).</li><li>Click the <i class='fa-solid fa-times-circle'></i> icon on the top-right of a card in the 'Current Team' section to remove a Pokémon directly from the team.</li></ul>",
        usageStep5: "<strong>Sort:</strong> When you scroll down, a sort bar appears next to the Generate button. Click <i class='fa-solid fa-hashtag'></i> (ID), <i class='fa-solid fa-arrow-down-a-z'></i> (Name), <i class='fa-solid fa-leaf'></i> (Type), <i class='fa-solid fa-gauge-high'></i> (BST), <i class='fa-solid fa-star'></i> (Shiny), <i class='fa-solid fa-rocket'></i> (Legendary), <i class='fa-solid fa-feather'></i> (Mythical), <i class='fa-solid fa-gem'></i> (Mega), <i class='fa-solid fa-umbrella-beach'></i> (Alolan), or <i class='fa-solid fa-shuffle'></i> (Random) to sort the <strong>newly generated</strong> Pokémon. Clicking again (except for Random) reverses the direction (<i class='fa-solid fa-arrow-up-short-wide'></i> / <i class='fa-solid fa-arrow-down-wide-short'></i>).",
        usageStep6: "<strong>Customize View:</strong> Use the icons in the top-right for <i class='fa-solid fa-moon'></i> / <i class='fa-solid fa-sun'></i> Dark Mode or language switching (<img src='https://flagcdn.com/de.svg' alt='DE' style='width:1em;height:auto;vertical-align:middle;'> / <img src='https://flagcdn.com/us.svg' alt='EN' style='width:1em;height:auto;vertical-align:middle;'>).",
        usageStep7: "Use the <i class='fa-solid fa-arrow-up'></i> button in the bottom-right to quickly scroll back to the top.",
        countLabel: "Number of new Pokémon to generate:",
        generationLabel: "Generation:",
        typesLabel: "Types:",
        typesLabelShort: "Type",
        tooltipSelectAll: "Select All",
        tooltipDeselectAll: "Deselect All",
        tooltipLock: "Lock Pokémon",
        tooltipUnlock: "Unlock Pokémon",
        tooltipSortById: "Sort by ID",
        tooltipSortByName: "Sort by Name",
        tooltipSortByType: "Sort by Type",
        tooltipSortByBST: "Sort by BST",
        tooltipSortByShiny: "Sort by Shiny",
        tooltipSortByLegendary: "Sort by Legendary",
        tooltipSortByMythical: "Sort by Mythical",
        tooltipSortByMega: "Sort by Mega",
        tooltipSortByAlolan: "Sort by Alolan Form",
        tooltipSortByRandom: "Sort Randomly",
        lockedPokemonSectionTitle: "Locked Pokémon",
        expandAllLabel: "Expand All",
        collapseAllLabel: "Collapse All",
        gen1_label: "Gen 1 (Kanto)", gen2_label: "Gen 2 (Johto)", gen3_label: "Gen 3 (Hoenn)", gen4_label: "Gen 4 (Sinnoh)", gen5_label: "Gen 5 (Unova)", gen6_label: "Gen 6 (Kalos)", gen7_label: "Gen 7 (Alola)", gen8_label: "Gen 8 (Galar)", gen9_label: "Gen 9 (Paldea)",
        type_normal: "Normal", type_fire: "Fire", type_water: "Water", type_electric: "Electric", type_grass: "Grass", type_ice: "Ice", type_fighting: "Fighting", type_poison: "Poison", type_ground: "Ground", type_flying: "Flying", type_psychic: "Psychic", type_bug: "Bug", type_rock: "Rock", type_ghost: "Ghost", type_dragon: "Dragon", type_dark: "Dark", type_steel: "Steel", type_fairy: "Fairy",
        evolutionPositionLabel: "Evolution (Position in chain):",
        evo_basic: "Basic Form", evo_stage1: "First Evolution", evo_stage2: "Second Evolution",
        evolutionChainLengthLabel: "Number of Evolution Stages (Total chain length):",
        chain_length1: "No Evolution (1 Stage)", chain_length2: "One Evolution (2 Stages)", chain_length3: "Two Evolutions (3 Stages)",
        specialPokemonLabel: "Special Pokémon:",
        includeLegendaryLabel: "Legendary Pokémon", includeMythicalLabel: "Mythical Pokémon", includeMegaLabel: "Mega Pokémon", includeAlolanLabel: "Alolan Pokémon",
        bstLabel: "Base Stat Total (BST):",
        bstMinLabel: "Min BST:",
        bstMaxLabel: "Max BST:",
        bstMinPlaceholder: "e.g. 100",
        bstMaxPlaceholder: "e.g. 600",
        cardBST: "BST",
        generateButton: "Generate Pokémon!",
        loadingData: "Loading Pokémon data from PokeAPI...",
        loadedFromCache: "Pokémon data loaded from cache!",
        progressText: (loaded, total) => `${loaded} / ${total} Pokémon processed`,
        loadingError: "Error loading Pokémon data:",
        status_locked_only: (locked) => `${locked} Pokémon locked. No new Pokémon requested.`,
        status_locked_and_generated: (locked, generated, totalPossible) => `${locked} Pokémon locked. ${generated} of ${totalPossible} matching new Pokémon generated.`,
        status_locked_no_new_match: (locked) => `${locked} Pokémon locked. No additional new Pokémon match filters.`,
        status_generated_only: (generated, totalPossible) => `${generated} of ${totalPossible} matching new Pokémon generated.`,
        status_no_new_match: "No new Pokémon match your filters.",
        status_no_pokemon_at_all: "No Pokémon (locked or new) match your filters.",
        status_initial_prompt: "Select filters and generate Pokémon!",
        status_initial_prompt_append_generate: "Press 'Generate Pokémon!' to get new ones.",
        noResultsInContainer: "No Pokémon match your current filters. Try adjusting them!",
        nameFilterLabel: "Filter generated Pokémon by name:",
        cardGeneration: "Generation", cardEvolution: "Evolution", cardEvolutionNoEvo: "(No evolution)", cardEvolutionStage: "Stage", cardTotalStages: "Total stages:",
        darkModeToggle: "Toggle Dark Mode",
        attributionText: 'Data and images provided by the <a href="https://pokeapi.co/" target="_blank">PokeAPI</a>.<br>Pokémon © 2025 Nintendo, Creatures Inc., Game Freak Inc. All Rights Reserved. The images for all Pokémon types are provided by <a href="https://github.com/partywhale/pokemon-type-icons/" target="_blank">partywhale</a>.',
        clearCacheButton: "Clear All App Data",
        confirmClearCache: "Are you sure you want to delete all locally stored data for this app (cache, settings, etc.)? The page will reload afterwards.",
        cacheCleared: "All local data cleared. The page will reload.",
        quotaExceededError: "Storage limit reached. Pokémon data could not be fully saved offline. Some features might be affected.",
        teamBuilderSectionTitle: "Current Team",
        addToTeamTooltip: "Add to Team",
        removeFromTeamTooltip: "Remove from Team",
        removeFromTeamOnTeamCardTooltip: "Remove from Team",
        teamFullMessage: "Your team is full (max 6 Pokémon)!",
        commonWeaknessesLabel: "Common Weaknesses:",
        commonResistancesLabel: "Common Resistances:",
        noTeamAnalysis: "No significant common weaknesses or resistances found for multiple team members.",
        allWeaknessesBalanced: "All weaknesses are well-balanced within the team.",
        allResistancesBalanced: "All resistances are well-balanced within the team.",
        toggleAnalysisDetail: "Show Detailed View",
        toggleAnalysisSimple: "Show Simple View",
        teamChartTitle: "Team Type Effectiveness",
        attackingTypeHeader: "Attacking Type",
        totalWeakLabel: "Total Weak",
        totalResistLabel: "Total Resist"
    }
};

let currentLang = 'de'; // Default language

function setLanguage(lang) {
    // Make sure the app.js has access to this function or is defined within its scope
    // Or use events to communicate language change if structured differently.
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key] && typeof translations[lang][key] !== 'function') {
            if (key.startsWith('usageStep') || key === "attributionText" || key === "instructionsIntro") {
                element.innerHTML = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (translations[lang] && translations[lang][key]) {
            element.title = translations[lang][key];
        }
    });

    // Update elements managed directly by app.js (or call a function in app.js to do it)
    // This requires app.js functions to be accessible or restructuring
    // Example: If updateToggleIcon is defined in app.js and globally accessible:
    if (typeof updateToggleIcon === 'function') {
        document.querySelectorAll('.toggle-all-icon').forEach(icon => {
            if (icon.dataset.group) updateToggleIcon(icon.dataset.group);
        });
    }
    if (typeof updateAnalysisViewDisplay === 'function' && typeof toggleAnalysisViewBtn !== 'undefined' && currentTeam.length > 0 && toggleAnalysisViewBtn) {
        updateAnalysisViewDisplay();
    }
    if (typeof renderAllPokemon === 'function' && typeof pokemonData !== 'undefined' && pokemonData.length > 0 && typeof isLoading !== 'undefined' && !isLoading) {
        renderAllPokemon(); // Re-render cards for name/type updates
    }
    if (typeof renderTeamBuilder === 'function' && typeof currentTeam !== 'undefined') {
        renderTeamBuilder(); // Re-render team cards for name/type updates
    }
    // Update document title
    document.title = translations[lang].appTitle;

    // Update language switcher active state
    document.querySelectorAll('.language-switcher img').forEach(img => {
        img.classList.toggle('active', img.dataset.lang === lang);
    });

    // Update toggle all filters button text
    const toggleAllFiltersButton = document.getElementById('toggleAllFiltersBtn');
    if (toggleAllFiltersButton && typeof allFiltersExpanded !== 'undefined') {
        toggleAllFiltersButton.textContent = translations[currentLang][allFiltersExpanded ? 'collapseAllLabel' : 'expandAllLabel'];
        toggleAllFiltersButton.setAttribute('data-i18n', allFiltersExpanded ? 'collapseAllLabel' : 'expandAllLabel');
    }

    // Update initial status message if needed
    const statusElement = document.getElementById('status');
    if (statusElement && typeof hasGeneratedAtLeastOnce !== 'undefined' && !hasGeneratedAtLeastOnce && typeof pokemonData !== 'undefined' && pokemonData.length === 0) {
        statusElement.textContent = translations[currentLang].status_initial_prompt;
    } else if (statusElement && typeof isLoading !== 'undefined' && isLoading) {
        statusElement.textContent = translations[currentLang].loadingData;
        const loadingProgressTextElement = document.getElementById('loading-progress-text');
        if (loadingProgressTextElement && loadingProgressTextElement.textContent.includes('/')) {
            // Try to preserve numbers if progress text is visible
            const parts = loadingProgressTextElement.textContent.split('/');
            if (parts.length === 2) {
                const loaded = parseInt(parts[0].trim());
                const total = parseInt(parts[1].split(' ')[0].trim());
                if (!isNaN(loaded) && !isNaN(total)) {
                    loadingProgressTextElement.textContent = translations[currentLang].progressText(loaded, total);
                }
            }
        }
    }
}
