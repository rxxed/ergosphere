<script>
    export let keyboard = {};
    export let onKeyboardClick = () => {};

    function handleClick() {
        onKeyboardClick(keyboard);
    }
</script>

<div class="card" on:click={handleClick}>
    <h3>{keyboard['Keyboard Name']}</h3>
    <img src={keyboard['Image URL']}>
    <div class="card-content">
        <div class="card-footer">
            <strong>Number of Keys</strong>: {keyboard['Number of Keys']}<br>
            <strong>Switch Type</strong>: {keyboard['Switch Type']}
        </div>
    </div>
</div>

<style>
    h3 {
        text-align: center;
    }

    .card {
        border: 1px solid;
        margin: 10px;
        padding: 10px;
        border-radius: 18px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex: 1 1 200px;
        flex-direction: column;
        min-width: 150px;
        margin: 10px;
        max-width: 300px;
    }

    .card:hover {
        cursor: pointer;
    }

    .card:hover h3 {
        text-decoration: underline;
        text-decoration-thickness: 2px;
    }

    .card-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .card-footer {
        margin-top: auto;
    }

    img {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    @media (max-width: 1200px) {
        .card {
            max-width: 250px;
        }
    }

    @media (max-width: 900px) {
        .card {
            max-width: 80%;
        }
    }
</style>
