<script>
    export let numberOfKeyboards = 0;
    export let onSearchInput = () => {};

    let searchTimeoutId;

    function debounceSearch(event) {
        clearTimeout(searchTimeoutId);
        searchTimeoutId = setTimeout(() => {
            onSearchInput(event);
        }, 300);
    }
</script>

<input placeholder="Search {numberOfKeyboards} keyboards..." on:input={debounceSearch} />

<style>
    input {
        width: 400px;
        height: 30px;
        padding: 8px 16px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 10px;
        outline: none;
    }
</style>
