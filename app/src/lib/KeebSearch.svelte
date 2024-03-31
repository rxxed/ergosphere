<script>
    export let numberOfKeyboards = 0;
    export let onSearchInput = () => {};
</script>

<input placeholder="Search {numberOfKeyboards} keyboards..." on:input={onSearchInput} />

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
