<script>
    import { onMount } from 'svelte'
    import yaml from 'js-yaml';
    import '../styles/global.css';
    import KeebSearch from '../lib/KeebSearch.svelte';
    import KeebHeader from '../lib/KeebHeader.svelte';
    import KeebCard from '../lib/KeebCard.svelte';
    import KeebModal from '../lib/KeebModal.svelte';

    let keyboards = [];
    let selectedKeyboard = null;
    $: filteredKeyboards = keyboards;

    onMount(async () => {
        try {
            const response = await fetch('/keyboards.yaml');
            const yamlData = await response.text();
            const data = yaml.load(yamlData);
            keyboards = data.keyboards;
            console.log(keyboards);
        } catch (error) {
            console.error('Error loading YAML file:', error);
        }
    });

    function handleKeyboardClick(keyboard) {
        selectedKeyboard = keyboard;
    }

    function handleModalClose() {
        selectedKeyboard = null;
    }

    function handleSearchInputChange(event) {
        console.log("on search: ", event.target.value);
        filteredKeyboards = filterKeyboardsBySearch(event.target.value);
        console.log("filtered: ", filteredKeyboards);
        console.log("keyboards: ", keyboards);
    }

    function filterKeyboardsBySearch(searchTerm) {
        return keyboards.filter(keeb => keeb['Keyboard Name'].toLowerCase().includes(searchTerm.toLowerCase()));
        /*return Object.keys(keyboards).filter(key =>
            keyboards[key]["Keyboard Name"].toLowerCase().includes(searchTerm.toLowerCase())
        )*/
        /*    .reduce((result, key) => {
            result[key] = keyboards[key];
            return result;
        }, {});*/
    }
</script>


<div class="header-container">
    <KeebHeader />
</div>
<div class="search-container">
    <KeebSearch numberOfKeyboards={keyboards.length} onSearchInput={handleSearchInputChange} />
</div>

<div class="card-container">
{#each filteredKeyboards as keyboard}
    <KeebCard {keyboard} onKeyboardClick={handleKeyboardClick} />
{/each}
</div>

{#if selectedKeyboard}
    <KeebModal {selectedKeyboard} onClose={handleModalClose} />
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
