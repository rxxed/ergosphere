<script>
    import { onMount } from 'svelte';
    import yaml from 'js-yaml';

    export let onClose = () => {};
    export let onApplyFilters = () => {};
    let keyboard = {'foo': 123, 'bar': 456};

    let filterOptions = [];
    export let selectedFilterOptions = [];
    export let selectedFilters = {};


    onMount(async () => {
        try {
            const response = await fetch('/dataModel.yaml');
            const yamlData = await response.text();
            const data = yaml.load(yamlData);
            filterOptions = data['Filter Options'][0];
        } catch (error) {
            console.error('Error loading YAML file:', error);
        }
    });

    /** Used to determine if we need to show a select dropdown or a number range as input */
    function hasNumericOptions(filterName) {
        return false;
        //return typeof filterOptions[filterName][0] === 'number';
    }

    function applyFilters() {
        selectedFilterOptions.forEach(filterName => {
            const filterValue = document.querySelector(`select[name="selectedFilters-${filterName}"]`)?.value;
            if (filterValue === 'true' || filterValue === 'false')
                selectedFilters[filterName] = filterValue === 'true'; // convert filterValue to boolean
            else
                selectedFilters[filterName] = filterValue;
        })
        onApplyFilters(selectedFilters);
        onClose();
    }
</script>

<div class="modal" on:click|self={onClose}>
    <div class="modal-content">
        {#if selectedFilterOptions.length >= 1 && Object.keys(filterOptions).length >= 1 }
            <h2>Select values</h2>
            {#each selectedFilterOptions as filterName}
                <p>
                <label for={filterName}>{filterName}</label>
                {#if hasNumericOptions(filterName)}
                    <input type="number" /> <!--TODO-->
                {:else}
                <select name={`selectedFilters-${filterName}`} id="selected-filters">
                    {#each filterOptions[filterName] as opt}
                        <option value="{opt}">{opt}</option>
                    {/each}
                </select>
                {/if}
                </p>
            {/each}
            <br />
            <button class="filter-apply-btn" on:click={applyFilters}>Apply Filters</button>
        {/if}
        <h2>Select options to filter</h2>
        <button on:click={onClose} class="close-button">&times;</button>
        <form class="attribute-list">
            {#each Object.entries(filterOptions) as attribute}
                <div class="attribute-item">
                    <label>
                        <input type=checkbox name={attribute[0]} value={attribute[0]} bind:group={selectedFilterOptions} />
                        {attribute[0]}<br>
                    </label>
                </div>
            {/each}
        </form>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
    }

    .modal-content {
        padding: 20px;
        border-radius: 5px;
        max-width: 800px;
        width: 70%;
        height: 70%;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .attribute-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }

    .attribute-item {
        display: flex;
        justify-content: flex-start;
    }

    .attribute-item:hover {
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }

    select {
        font-size: 1rem;
        padding: 5px;
    }

    label:hover, input[type="checkbox"]:hover {
        cursor: pointer;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 40px;
        background: none;
        border: none;
        cursor: pointer;
    }

    .filter-apply-btn {
        text-align: center;
    }

    @media (max-width: 700px) {
        .attribute-list {
            grid-template-columns: 1fr;
            padding: 0 80px;
        }

        .img-container img {
            max-width: 80%;
        }
    }

    @media (max-width: 900px) {
        .modal-content {
            width: 90%;
        }
    }

    @media (max-width: 600px) {
        .modal-content {
            max-width: 100%;
            width: 100%;
            height: 100%;
            border-radius: 0;
        }

        .attribute-list {
            grid-template-columns: 1fr;
            padding: 0;
        }

        .close-button {
            top: 20px;
        }
    }
</style>
