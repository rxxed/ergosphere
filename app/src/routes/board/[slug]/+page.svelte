<script>
    import { onMount } from "svelte";
    import yaml from "js-yaml";

    import "../../../styles/global.css";
    import KeebHeader from "../../../lib/KeebHeader.svelte";

    export let data;

    let keyboard = {};
    let keyboardLabels = {};
    let imageUrl = "";
    let sourceLink = "";

    onMount(async () => {
        try {
            let response = await fetch("/keyboards.yaml");
            let yamlData = await response.text();
            let parsedData = yaml.load(yamlData);
            keyboard = parsedData.keyboards.find(
                (kb) => kb.route === data.slug,
            );
            if (keyboard) {
                imageUrl = keyboard.img_url;
                sourceLink = keyboard.link;
                // Don't display the following details
                delete keyboard.img_url;
                delete keyboard.link;
                delete keyboard.route;
            }

            response = await fetch("/datamodel.yaml");
            yamlData = await response.text();
            parsedData = yaml.load(yamlData);
            keyboardLabels = parsedData.labels[0];
            console.log(keyboardLabels);
        } catch (error) {
            console.error("Error loading YAML file:", error);
        }
    });
</script>

<div class="header-container">
    <KeebHeader />
</div>

{#if sourceLink}
    <div class="keeb-details">
        <div class="header-and-link">
            <div class="keeb-title">{keyboard.keyboard_name}</div>
            <a href={sourceLink} class="sourcelink">Link to Source</a>
        </div>
        <div class="img-container">
            <img src={imageUrl} alt="An image of {keyboard.keyboard_name}" />
        </div>
        <div class="attribute-list">
            {#each Object.entries(keyboard) as attribute}
                <div class="attribute-item">
                    <span>{keyboardLabels[attribute[0]]}</span>
                    <!-- <span class="attribute-divider"></span> -->
                    <span>{attribute[1]}<br /></span>
                </div>
            {/each}
        </div>
        <em class="help-text">See anything missing/wrong? Please raise an issue/PR <a href="https://github.com/rxxed/ergosphere">here</a>.</em>
    </div>
{:else}
    <p style="text-align: center; margin-top: 10px;">
        Loading keyboard details...
    </p>
{/if}

<style>
    .header-and-link {
        text-align: center;
    }

    .sourcelink {
        color: #0076c1;
        transition: color 0.3s;
    }

    .sourcelink:hover {
        color: #4c58b3;
    }

    .keeb-details {
        margin: auto;
        max-width: 60%;
        width: 100%;
        height: 100%;
        margin-bottom: 10px;
        position: relative;
        border-radius: 18px;
    }

    .keeb-title {
        text-align: center;
        margin: 10px;
        font-size: 1.25rem;
    }

    .help-text {
       text-align: center;
       padding: 0 20px;
    }

    .attribute-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 5px;
        padding: 20px;
    }

    .attribute-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #000;
        padding: 20px;
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
        background-color: #fefefe !important;
        border: 1px solid #000;
        border-radius: 18px;
    }

    .header-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 1200px) {
        .keeb-details {
            max-width: 70%;
            width: 100%;
        }
    }

    @media (max-width: 1092px) {
        .keeb-details {
            max-width: 100%;
            width: 100%;
        }
    }

    @media (max-width: 700px) {
        .attribute-list {
            grid-template-columns: 1fr;
        }

        .img-container img {
            max-width: 80%;
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
        }
    }
</style>
