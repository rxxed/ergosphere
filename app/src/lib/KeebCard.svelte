<script>
  export let keyboard = {};
</script>

<a href="/board/{keyboard.route}">
  <div class="card">
    <div class="card-title">{keyboard.keyboard_name}</div>
    <div class="image-container">
      <img src={keyboard.img_url} alt="An image of {keyboard.keyboard_name}" />
    </div>
    <div class="card-content">
      <div class="card-footer">
        <span>Number of Keys</span>: {keyboard.number_of_keys}
        <br />
        <span>By</span>: {keyboard.by}
      </div>
    </div>
  </div>
</a>

<style>
  .card-title {
    text-align: center;
    margin: 10px;
    font-size: 1.25rem;
  }

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    justify-content: center;
  }

  .card {
    border: 1px solid;
    margin: 10px;
    padding: 10px;
    border-radius: 18px;
    box-shadow: 5px 5px rgba(252, 224, 239, 1.0), 6px 6px 0 0 #000;
    min-width: 150px;
    max-width: 300px;
    display: flex;
    flex: 1 1 200px;
    flex-direction: column;
    background-color: #FEFEFE !important;
    transition: transform 0.3s ease;
  }

  .card:hover {
    cursor: pointer;
    transform: scale(1.03);
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    height: 100%;
    min-height: 200px;
  }

  .card-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .card-footer {
    margin-top: auto;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 5px;
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
