<script>
    import { onMount } from 'svelte';
    import yaml from 'js-yaml';
    import '../../../styles/global.css';
    import KeebHeader from '../../../lib/KeebHeader.svelte';

    export let data;
    let keyboard = {};
    let imageUrl = '';
    let sourceLink = '';

    onMount(async () => {
        try {
            const response = await fetch('/keyboards.yaml');
            const yamlData = await response.text();
            const parsedData = yaml.load(yamlData);
            console.log("slug: ", data.slug);
            keyboard = parsedData.keyboards.find(kb => kb['Keyboard Name'] === data.slug);
            keyboard = parsedData.keyboards.find(kb => kb['Route'] === data.slug);
            if (keyboard) {
                imageUrl = keyboard['Image URL'];
                sourceLink = keyboard['Source Link'];
                // Don't display the following details
                delete keyboard['Image URL'];
                delete keyboard['Source Link'];
                delete keyboard['Route'];
                //({ 'Image URL': imageUrl, 'Source Link': sourceLink, ...keyboard } = keyboard);
            }
        } catch (error) {
            console.error('Error loading YAML file:', error);
        }
    });
    //export let selectedKeyboard = {};
    //delete selectedKeyboard.imgUrl;
    //export let onClose = () => {};

    //let { 'Image URL': imageUrl, 'Source Link': sourceLink, ...keyboard } = selectedKeyboard;
</script>

<div class="header-container">
    <KeebHeader />
</div>

{#if keyboard}
    <!--<div class="modal" on:click|self={onClose}>-->
    <div class="keeb-details">
        <!--<button on:click={onClose} class="close-button">&times;</button>-->
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
                    <strong>{attribute[0]}</strong>
                    <span class="attribute-divider"></span>
                    <span>{attribute[1]}<br></span>
                </div>
            {/each}
        </div>
    </div>
{:else}
    <p>Loading keyboard details...</p>
{/if}

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

    .keeb-details {
        margin: auto;
        max-width: 60%;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        position: relative;
    }

    .attribute-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }

    .attribute-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .attribute-divider {
        flex-grow: 1;
        border-bottom: 1px solid #ccc;
        margin: 5px;
    }

    .img-container {
        text-align: center;
        margin-bottom: 20px;
        padding-top: 20px;
    }

    .img-container img {
        margin: auto;
        max-width: 500px;
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

    .header-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 1092px) {
        .keeb-details {
            max-width: 100%;
            width: 100%;
        }
    }

    @media (max-width: 600px) {
        .keeb-details {
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
