<script>
    export let sendCloseModalEvent = () => {};
    export let onApplyFilters = () => {};

    /** List of all possible filter options */
    export let filterOptions = [];
    export let keyboardLabels = [];
    export let selectedFilterOptions = [];
    export let selectedFilters = {};

    function getValueBySelector(selector) {
      return document.querySelector(selector)?.value; 
    }

    function getValueBySelectorAsInt(selector) {
      const value = getValueBySelector(selector);
      return value ? parseInt(value, 10) : undefined;
    }

    function getValueBySelectorAsArray(selector) {
      const values = Array.from(document.querySelector(selector).selectedOptions);
      return values.map(val => val.value);
    }

    function applyFilters() {
      removeDeselectedFiltersIfAny();
      selectedFilterOptions.forEach((filterName) => {
        const baseSelector = `selectedFilters-${filterName}`;
        switch(filterOptions[filterName].type) {
        case 'range':
          selectedFilters[filterName] = {
            type: 'range',
            min: getValueBySelectorAsInt(`input[name=${baseSelector}-min]`),
            max: getValueBySelectorAsInt(`input[name=${baseSelector}-max]`),
          };
          break;
        case 'singleselect':
          selectedFilters[filterName] = {
            type: 'singleselect',
            value: getValueBySelector(`select[name=${baseSelector}]`),
          };
          break;
        case 'multiselect':
          selectedFilters[filterName] = {
            type: 'multiselect',
            values: getValueBySelectorAsArray(`select[name=${baseSelector}]`),
          }
        }
      });
      onApplyFilters(selectedFilters);
      sendCloseModalEvent();
    }

    /**
     * Keep only the filters that are in the `selectedFilterOptions` array.
     * This function will remove deselected filters if there are any.
     */
    function removeDeselectedFiltersIfAny() {
      Object.keys(selectedFilters).forEach((key) =>
        selectedFilterOptions.includes(key) || delete selectedFilters[key],
      );
    }
</script>

<div class="modal" on:click|self={sendCloseModalEvent}>
    <div class="modal-content">
        {#if selectedFilterOptions.length >= 1}
            <h2>Choose filter values</h2>
            {#each selectedFilterOptions as filterName}
                <span class="filter-name">{keyboardLabels[filterName]}:</span>
                {#if filterOptions[filterName].type === 'range'}
                    <div class="range-input">
                        <input
                            type="number"
                            name={`selectedFilters-${filterName}-min`}
                            placeholder="Min"
                            value={selectedFilters[filterName]?.min || ""}
                        />
                        <span>to</span>
                        <input
                            type="number"
                            name={`selectedFilters-${filterName}-max`}
                            placeholder="Max"
                            value={selectedFilters[filterName]?.max || ""}
                        />
                    </div>
                {:else if filterOptions[filterName].type === 'singleselect'}
                    <select name={`selectedFilters-${filterName}`} id="selected-filters">
                        {#each filterOptions[filterName].value as opt}
                            <option value={opt} selected={selectedFilters[filterName]?.value === opt}>{opt}</option>
                        {/each}
                    </select>
                {:else if filterOptions[filterName].type === 'multiselect'}
                    <br /><br />
                    <select name={`selectedFilters-${filterName}`} multiple>
                        {#each filterOptions[filterName].value as opt}
                            <option value={opt} selected={selectedFilters[filterName]?.values?.includes(opt)}>{opt}</option>
                        {/each}
                    </select>
                {/if}
                <br/><br/>
            {/each}

            <button class="filter-apply-btn" on:click={applyFilters}>
                Apply Filters
            </button>
        {/if}

        <h2>Select options to filter</h2>
        <button on:click={sendCloseModalEvent} class="close-button">&times;</button>
        <form class="attribute-list">
            {#each Object.entries(filterOptions) as attribute}
                <div class="attribute-item">
                    <label>
                        <input
                            type="checkbox"
                            name={attribute[0]}
                            value={attribute[0]}
                            bind:group={selectedFilterOptions}
                        />
                        {keyboardLabels[attribute[0]]}<br />
                    </label>
                </div>
            {/each}
        </form>
    </div>
</div>

<style>
    h2 {
        font-weight: lighter;
    }

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

    .filter-name {
    }

    .modal-content {
        padding: 20px;
        max-width: 800px;
        width: 70%;
        height: 70%;
        overflow-y: auto;
        position: relative;
        border-radius: 18px;
        background-color: #FEFEFE !important;
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

    label:hover,
    input[type="checkbox"]:hover {
        cursor: pointer;
    }

    input[type="number"] {
        margin-top: 5px;
        padding: 5px;
        font-size: 1rem;
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
        padding: 5px;
        font-size: 1rem;
        border-radius: 5px;
        border: 1px solid;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background-color: inherit
    }

    .filter-apply-btn:hover {
        cursor: pointer;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 700px) {
        .attribute-list {
            grid-template-columns: 1fr;
            padding: 0 80px;
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
