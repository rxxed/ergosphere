<script>
    import { onMount } from 'svelte'
    import yaml from 'js-yaml';
    import '../styles/global.css';
    import KeebSearch from '../lib/KeebSearch.svelte';
    import KeebHeader from '../lib/KeebHeader.svelte';
    import KeebCard from '../lib/KeebCard.svelte';
    import KeebDetailsModal from '../lib/KeebDetailsModal.svelte';
    import KeebFilterModal from '../lib/KeebFilterModal.svelte';

    let keyboards = [];
    let selectedKeyboard = null;
    let selectedFilters = [];
    let showFilterModal = false;
    $: filteredKeyboards = keyboards;

    onMount(async () => {
        try {
            const response = await fetch('/keyboards.yaml');
            const yamlData = await response.text();
            const data = yaml.load(yamlData);
            keyboards = data.keyboards;
        } catch (error) {
            console.error('Error loading YAML file:', error);
        }
    });

    function handleKeyboardClick(keyboard) {
        selectedKeyboard = keyboard;
    }

    function handleDetailsModalClose() {
        selectedKeyboard = null;
    }

    function handleFilterModalClose() {
        showFilterModal = false;
    }

    function handleSearchInputChange(event) {
        filteredKeyboards = filterKeyboardsBySearch(event.target.value);
    }

    function filterKeyboardsBySearch(searchTerm) {
        return keyboards.filter(keeb => keeb['Keyboard Name'].toLowerCase().includes(searchTerm.toLowerCase()));
    }

    function filterKeyboards() {
        return keyboards.filter(keeb => {
            for (const [filterKey, filterValue] of Object.entries(selectedFilters)) {
                if (keeb.hasOwnProperty(filterKey)) {
                    if (keeb[filterKey] !== filterValue)
                        return false;
                }
            }
            return true;
        })
    }

    function handleFilterApplication(event) {
        selectedFilters = event;
        filteredKeyboards = filterKeyboards(selectedFilters);
    }

    /** Clear all filters, reset keyboard cards to pre-filter state */
    function clearFilters() {
        selectedFilters = {};
        handleFilterApplication(selectedFilters);
    }
</script>


<div class="header-container">
    <KeebHeader />
</div>
<div class="search-container">
    <KeebSearch numberOfKeyboards={keyboards.length} onSearchInput={handleSearchInputChange} />
</div>

<button class="advanced-filter" on:click={() => showFilterModal = true}>Advanced Filtering</button>
{#if Object.keys(selectedFilters).length >= 1}
    <button class="advanced-filter" on:click={clearFilters}>Clear Filters</button>
{/if}

{#if showFilterModal}
    <KeebFilterModal
        onClose={handleFilterModalClose}
        onApplyFilters={handleFilterApplication}
        selectedFilters={selectedFilters}
        selectedFilterOptions={Object.keys(selectedFilters)}
    />
{/if}

<div class="card-container">
{#each filteredKeyboards as keyboard}
    <KeebCard {keyboard} onKeyboardClick={handleKeyboardClick} />
{/each}
</div>

{#if selectedKeyboard}
    <KeebDetailsModal {selectedKeyboard} onClose={handleDetailsModalClose} />
{/if}

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
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        justify-items: center;
        width: 70%;
        margin: auto;
    }

    .advanced-filter {
        display: flex;
        margin: 10px;
        margin-left: auto;
        margin-right: auto;
        padding: 8px;
        background-color: inherit;
        text-decoration: underline;
        cursor: pointer;
        border: none;
    }

    @media (max-width: 1200px) {
        .card-container {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
    }

    @media (max-width: 900px) {
        .card-container {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
