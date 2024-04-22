<script>
    import { onMount } from "svelte";
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import yaml from "js-yaml";

    import "../styles/global.css";
    import KeebHeader from "../lib/KeebHeader.svelte";
    import KeebSearch from "../lib/KeebSearch.svelte";
    import KeebCard from "../lib/KeebCard.svelte";
    import KeebFilterModal from "../lib/KeebFilterModal.svelte";
    import { filterStore } from './stores.js';

    /** Keyboard list fetched from the keyboards.yaml file. */
    let loadedKeyboards = [];
    let displayedKeyboards = [];
    let keyboardLabels = [];
    let showFilterModal = false;
    let itemsPerPage = 12;

    let filterOptions = [];
    let selectedFilters = {};

    // update store when filters change
    $: filterStore.set({ filterOptions, selectedFilters });

    /** URL param for current page indication */
    $: currentPage = parseInt($page.url.searchParams.get('page') || '1');
    $: paginatedKeyboards = displayedKeyboards.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    onMount(async () => {
        try {
            filterStore.subscribe(value => {
                filterOptions = value.filterOptions;
                selectedFilters = value.selectedFilters;
                // filter again with the selectedFilters from the store
                displayedKeyboards = filterKeyboards(selectedFilters);
            })

            let response = await fetch("/keyboards.yaml");
            let yamlData = await response.text();
            let data = yaml.load(yamlData);
            loadedKeyboards = data.keyboards;
            displayedKeyboards = loadedKeyboards;

            response = await fetch("/datamodel.yaml");
            yamlData = await response.text();
            data = yaml.load(yamlData);
            filterOptions = data.filter_options[0];
            keyboardLabels = data.labels[0]
        } catch (error) {
            console.error("Error loading YAML file:", error);
        }
    });

    function closeFilterModal() {
        showFilterModal = false;
    }

    function handleSearchInputChange(event) {
        const searchText = event.target.value;
        displayedKeyboards = searchKeyboards(searchText);
    }

    /**
     * Returns keyboards that have searchTerm as a substring of the keyboard name.
     * @param searchTerm
     */
    function searchKeyboards(searchTerm) {
        return loadedKeyboards.filter((keeb) =>
            keeb.keyboard_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        );
    }

    /**
     * Returns what's left of the `loadedKeyboards` list after applying the filters in `selectedFilters`.
     */
    function filterKeyboards() {
        /** Array of arrays representing each selectedFilters' key-value pairs */
        const selectedFilterPairs = Object.entries(selectedFilters);
        return loadedKeyboards.filter((keeb) =>
            selectedFilterPairs.every(([filterKey, filterValue]) => {
              switch (filterValue.type) {
              case "range":
                return keeb[filterKey].some((numKeys) =>
                  isValueInRange(numKeys, filterValue.min, filterValue.max)
                );
                break;
              case "singleselect":
                return keeb[filterKey].includes(filterValue.value);
                break;
              case "multiselect":
                return filterValue.values.some(val => keeb[filterKey].includes(val))
                break;
              }
            }),
        );
    }

    function isValueInRange(val, min, max) {
        return val >= min && val <= max;
    }

    /**
     * Applies the given filters by updating selectedFilters and filtering the keyboard list.
     * @param {object} newFilters - The new filter list to apply [{filter1: value1}, {filter2: value2}]
     */
    function applyFilters(newFilters) {
        selectedFilters = newFilters;
        displayedKeyboards = filterKeyboards(selectedFilters);
        goBackToPage1();
    }

    /**
     * Clear all filters, reset keyboard cards to pre-filter state.
     */
    function clearFilters() {
        applyFilters({});
    }

    function goBackToPage1() {
        goto('?page=1');
    }
</script>

<div class="header-container">
    <KeebHeader />
</div>

<div class="search-container">
    <KeebSearch
        numberOfKeyboards={loadedKeyboards.length}
        onSearchInput={handleSearchInputChange}
    />
</div>

<div class="filter-button-container">
    <button class="filter-button" on:click={() => (showFilterModal = true)}>
        Click here to filter
    </button>
</div>
{#if selectedFilters && Object.keys(selectedFilters).length >= 1}
    <div class="filter-button-container">
        Showing {displayedKeyboards.length} out of {loadedKeyboards.length} keyboards.
        <button class="filter-button" on:click={clearFilters}>Clear Filters</button>
    </div>
{/if}

{#if showFilterModal}
    <KeebFilterModal
        sendCloseModalEvent={closeFilterModal}
        onApplyFilters={applyFilters}
        {selectedFilters}
        {filterOptions}
        {keyboardLabels}
        selectedFilterOptions={selectedFilters ? Object.keys(selectedFilters) : []}
    />
{/if}

<div class="card-container">
    {#each paginatedKeyboards as keyboard}
        <KeebCard {keyboard} />
    {/each}
</div>

<div class="pagination">
    <a href="?page=1" class:disabled={currentPage === 1}>
        &lt;&lt;
    </a>
    <a href="?page={currentPage - 1}" class:disabled={currentPage === 1}>
        &lt;
    </a>
    <span>{currentPage} / {Math.ceil(displayedKeyboards.length / itemsPerPage)}</span>
    <a href="?page={currentPage + 1}" class:disabled={currentPage === Math.ceil(displayedKeyboards.length / itemsPerPage)}>
        &gt;
    </a>
    <a href="?page={Math.ceil(displayedKeyboards.length / itemsPerPage)}" class:disabled={currentPage === Math.ceil(displayedKeyboards.length / itemsPerPage)}>
        &gt;&gt;
    </a>
</div>

<style>
    .search-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
    }

    .header-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
    }

    .card-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        justify-items: center;
        width: 75%;
        margin: auto;
    }

    .filter-button {
        background-color: inherit;
        text-decoration: underline;
        cursor: pointer;
        border: none;
        font-size: 1rem;
    }

    .filter-button-container {
        display: flex;
        margin: 10px;
        padding: 8px;
        justify-content: center;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .pagination a {
        margin: 5px;
        padding: 5px 10px;
        background-color: #fefefe;
        border: none;
        cursor: pointer;
        border: 1px solid #000;
        border-radius: 10px;
        text-decoration: none;
        color: inherit;
    }

    .pagination a:hover {
        background-color: #f0f0f0;
    }

    .pagination .disabled {
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.5;
    }

    @media (max-width: 1200px) {
        .card-container {
            width: 100%;
        }
    }

    @media (max-width: 900px) {
        .card-container {
            grid-template-columns: repeat(3, 1fr);
            width: 100%;
        }
    }

    @media (max-width: 720px) {
        .card-container {
            grid-template-columns: repeat(2, 1fr);
            width: 100%;
        }
    }

    @media (max-width: 600px) {
        .card-container {
            grid-template-columns: 1fr;
            width: 100%;
        }
    }
</style>
