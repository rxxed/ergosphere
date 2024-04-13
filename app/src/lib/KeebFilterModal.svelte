<script>
    /** Event sent to close the modal. */
    export let onClose = () => {};
    export let onApplyFilters = () => {};

    /** List of all possible filter options */
    export let filterOptions = [];
    export let keyboardLabels = [];
    export let selectedFilterOptions = [];
    export let selectedFilters = {};

    /**
     * Used to determine if we need to show a select dropdown or a number range as input
     * @param filterName
     */
    function hasNumericOptions(filterName) {
        return typeof filterOptions[filterName][0] === "number";
    }

    function applyFilters() {
        removeDeselectedFiltersIfAny();
        selectedFilterOptions.forEach((filterName) => {
            if (hasNumericOptions(filterName)) {
                const min = document.querySelector(
                    `input[name="selectedFilters-${filterName}-min"]`,
                )?.value;
                const max = document.querySelector(
                    `input[name="selectedFilters-${filterName}-max"]`,
                )?.value;

                selectedFilters[filterName] = {
                    min: min ? parseInt(min, 10) : undefined,
                    max: max ? parseInt(max, 10) : undefined,
                };
            } else {
                const filterValue = document.querySelector(
                    `select[name="selectedFilters-${filterName}"]`,
                )?.value;
                selectedFilters[filterName] = filterValue;
            }
        });
        onApplyFilters(selectedFilters);
        onClose();
    }

    /**
     * Keep only the filters that are in the `selectedFilterOptions` array.
     * This function will remove deselected filters if there are any.
     */
    function removeDeselectedFiltersIfAny() {
        Object.keys(selectedFilters).forEach(
            (key) =>
                selectedFilterOptions.includes(key) ||
                delete selectedFilters[key],
        );
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal" on:click|self={onClose}>
    <div class="modal-content">
        {#if selectedFilterOptions.length >= 1}
            <h2>Choose filter values</h2>
            {#each selectedFilterOptions as filterName}
                <p>
                    <label for={filterName}>{keyboardLabels[filterName]}</label>
                    {#if hasNumericOptions(filterName)}
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
                    {:else}
                        <select
                            name={`selectedFilters-${filterName}`}
                            id="selected-filters"
                        >
                            {#each filterOptions[filterName] as opt}
                                <option
                                    value={opt}
                                    selected={selectedFilters[filterName] ===
                                        opt}
                                >
                                    {opt}
                                </option>
                            {/each}
                        </select>
                    {/if}
                </p>
            {/each}
            <button class="filter-apply-btn" on:click={applyFilters}>
                Apply Filters
            </button>
        {/if}
        <h2>Select options to filter</h2>
        <button on:click={onClose} class="close-button">&times;</button>
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
