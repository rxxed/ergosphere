<script>
    export let selectedKeyboard = {};
    delete selectedKeyboard.imgUrl;
    export let onClose = () => {};

    let { 'Image URL': imageUrl, 'Source Link': sourceLink, ...keyboard } = selectedKeyboard;
</script>

<div class="modal" on:click|self={onClose}>
    <div class="modal-content">
        <button on:click={onClose} class="close-button">&times;</button>
        <div class="header-and-link">
            <h2>{keyboard['Keyboard Name']}</h2>
            <a href={sourceLink} class="sourcelink">Link to Source</a>
        </div>
        <div class="img-container">
            <img src={imageUrl} />
        </div>
        <div class="attribute-list">
            {#each Object.entries(keyboard) as attribute}
                <div class="attribute-item">
                    <strong>{attribute[0]}</strong> {attribute[1]}<br>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .header-and-link {
        text-align: center;
    }

    .sourcelink {
        color: #0076C1;
        transition: color 0.3s;
    }

    .sourcelink:hover {
        color: #4C58B3;
    }

    strong {
        font-weight: bold;
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
        justify-content: space-between;
    }

    .img-container {
        text-align: center;
        margin-bottom: 20px;
        padding-top: 20px;
    }

    .img-container img {
        margin: auto;
        max-width: 60%;
        max-height: auto;
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
