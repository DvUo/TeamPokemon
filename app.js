// Pokémon Team Builder Application
// Separated from index.html for better code organization

// Global state for team management
let pokemonTeam = [];
const MAX_TEAM_SIZE = 6;

/**
 * Checks if a Pokémon is legendary
 * @param {string} pokemonName - The name of the Pokémon to check
 * @returns {Promise<boolean>} - Whether the Pokémon is legendary
 */
async function isLegendary(pokemonName) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        return response.data.is_legendary;
    } catch (error) {
        console.error('Error checking legendary status:', error);
        return false;
    }
}

/**
 * Creates a card element for a Pokémon in the team
 * @param {Object} pokemonData - The Pokémon data from the API
 * @returns {HTMLDivElement} - The created card element
 */
function createPokemonCard(pokemonData) {
    const { name, sprites, types, stats } = pokemonData;
    
    // Create card container
    const card = document.createElement('div');
    card.classList.add('card');
    
    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('button', 'DeleteButton');
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `Remove ${name} from team`);
    deleteButton.onclick = () => deleteCard(card, name);
    card.appendChild(deleteButton);
    
    // Create Pokémon name heading
    const nameHeading = document.createElement('h2');
    nameHeading.textContent = name;
    card.appendChild(nameHeading);
    
    // Create image section
    const imgSection = document.createElement('div');
    imgSection.id = 'imageteam';
    const img = document.createElement('img');
    img.src = sprites.front_default;
    img.alt = name;
    img.title = name;
    imgSection.appendChild(img);
    card.appendChild(imgSection);
    
    // Create description section with types and stats
    const description = document.createElement('div');
    description.classList.add('descriptionteam');
    const ul = document.createElement('ul');
    ul.id = 'description-pokemon';
    
    // Add type information
    const typeText = types.length === 1 
        ? `Type: ${types[0].type.name}`
        : `Types: ${types[0].type.name} / ${types[1].type.name}`;
    const typeLi = document.createElement('li');
    typeLi.textContent = typeText;
    ul.appendChild(typeLi);
    
    // Add stats
    stats.forEach(stat => {
        const statLi = document.createElement('li');
        statLi.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        ul.appendChild(statLi);
    });
    
    description.appendChild(ul);
    card.appendChild(description);
    
    return card;
}

/**
 * Adds a Pokémon to the team based on user input
 */
async function EquipoPokemon() {
    try {
        const input = document.getElementById('pokemonInput');
        const pokemonName = input.value.toLowerCase().trim();
        
        if (!pokemonName) {
            alert('Please enter a Pokémon name or ID');
            return;
        }
        
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokemonData = response.data;
        
        // Clear input field
        input.value = '';
        
        // Check if team is full
        if (pokemonTeam.length >= MAX_TEAM_SIZE) {
            alert('Your team is already complete (max 6 Pokémon)');
            return;
        }
        
        // Check if Pokémon is already in team
        if (pokemonTeam.includes(pokemonData.name)) {
            alert(`${pokemonData.name} is already in your team!`);
            return;
        }
        
        // Create and add card to DOM
        const card = createPokemonCard(pokemonData);
        const container = document.querySelector('.container-cards');
        container.appendChild(card);
        
        // Update team state
        pokemonTeam.push(pokemonData.name);
        
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        alert('Pokémon not found. Please check the name or ID and try again.');
    }
}

/**
 * Deletes a card from the team
 * @param {HTMLElement} card - The card element to remove
 * @param {string} name - The name of the Pokémon
 */
function deleteCard(card, name) {
    try {
        const index = pokemonTeam.indexOf(name);
        
        if (index !== -1) {
            pokemonTeam.splice(index, 1);
            card.remove();
        }
    } catch (error) {
        console.error('Error deleting card:', error);
    }
}

/**
 * Displays a random Pokémon with its stats
 */
async function Pokemonrandom() {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    const shinyChance = Math.floor(Math.random() * 1000);
    
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const pokemon = response.data;
        
        // Determine if shiny (1 in 1000 chance)
        const isShiny = shinyChance === 1;
        const imageUrl = isShiny && pokemon.sprites.front_shiny 
            ? pokemon.sprites.front_shiny 
            : pokemon.sprites.front_default;
        
        // Get DOM elements
        const imgSection = document.getElementById('img-name');
        const statsList = document.getElementById('stats-list');
        const nameElement = document.getElementById('namepokemon');
        
        // Clear previous content
        imgSection.innerHTML = '';
        statsList.innerHTML = '';
        
        // Check if legendary
        const legendaryStatus = await isLegendary(pokemon.name);
        
        // Update name element with appropriate styling
        nameElement.className = legendaryStatus ? 'legendary' : 'not-legendary';
        nameElement.textContent = pokemon.name;
        
        // Set image section class for shiny animation
        imgSection.className = isShiny ? 'shiny' : 'not-shiny';
        
        // Create and add image
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = pokemon.name;
        img.title = pokemon.name;
        imgSection.appendChild(img);
        
        // Display stats
        pokemon.stats.forEach(stat => {
            const li = document.createElement('li');
            li.textContent = `${stat.stat.name}: ${stat.base_stat}`;
            statsList.appendChild(li);
        });
        
    } catch (error) {
        console.error('Error fetching random Pokémon:', error);
        alert('Error loading Pokémon. Please try again.');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Optional: Load a random Pokémon on page load
    // Pokemonrandom();
});
