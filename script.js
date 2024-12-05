// Mock Recipe Data
const recipes = [
    {
        id: '1',
        title: 'Vegetarian Pasta Primavera',
        description: 'A light and fresh pasta dish loaded with spring vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
        prepTime: '30 min',
        cuisine: 'Italian',
        diet: 'Vegetarian',
        ingredients: [
            '1 pound pasta',
            'Mixed vegetables',
            'Olive oil',
            'Garlic',
            'Parmesan cheese'
        ],
        instructions: [
            'Boil pasta according to package instructions',
            'Sauté vegetables in olive oil',
            'Combine pasta and vegetables',
            'Top with parmesan cheese'
        ]
    },
    {
        id: '2',
        title: 'Asian Stir-Fry Bowl',
        description: 'Quick and healthy stir-fried vegetables with tofu',
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
        prepTime: '25 min',
        cuisine: 'Asian',
        diet: 'Vegan',
        ingredients: [
            'Tofu',
            'Mixed vegetables',
            'Soy sauce',
            'Ginger',
            'Rice'
        ],
        instructions: [
            'Press and cube tofu',
            'Cook rice',
            'Stir-fry vegetables',
            'Add sauce and combine'
        ]
    }
];

// Initialize Lucide icons
lucide.createIcons();

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function navigateToRecipeList() {
    showPage('recipe-list');
    renderRecipeList(recipes);
}

function navigateToRecipeDetail(recipeId) {
    showPage('recipe-detail');
    renderRecipeDetail(recipeId);
}

// Recipe List Rendering
function createRecipeCard(recipe) {
    return `
        <div class="recipe-card">
            <img src="${recipe.imageUrl}" alt="${recipe.title}">
            <div class="recipe-card-content">
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
                <div class="recipe-info">
                    <div class="recipe-info-item">
                        <i data-lucide="clock"></i>
                        <span>${recipe.prepTime}</span>
                    </div>
                    <div class="recipe-info-item">
                        <i data-lucide="chef-hat"></i>
                        <span>${recipe.cuisine}</span>
                    </div>
                </div>
                <button class="view-recipe-btn" onclick="navigateToRecipeDetail('${recipe.id}')">
                    View Details
                </button>
            </div>
        </div>
    `;
}

function renderRecipeList(recipes) {
    const recipeGrid = document.getElementById('recipe-grid');
    recipeGrid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
    lucide.createIcons();
}

// Recipe Detail Rendering
function renderRecipeDetail(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const detailContent = document.querySelector('.recipe-detail-content');
    detailContent.innerHTML = `
        <img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-detail-image">
        <div class="recipe-detail-info">
            <div class="recipe-detail-header">
                <h1>${recipe.title}</h1>
                <div class="recipe-meta">
                    <div class="recipe-info-item">
                        <i data-lucide="clock"></i>
                        <span>${recipe.prepTime}</span>
                    </div>
                    <div class="recipe-info-item">
                        <i data-lucide="chef-hat"></i>
                        <span>${recipe.cuisine}</span>
                    </div>
                </div>
            </div>

            <div class="ingredients-section">
                <h2>Ingredients</h2>
                <ul class="ingredients-list">
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>

            <div class="instructions-section">
                <h2>Instructions</h2>
                <ol class="instructions-list">
                    ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// Search and Filter Functionality
function filterRecipes(filters) {
    return recipes.filter(recipe => {
        const matchesCuisine = !filters.cuisine || recipe.cuisine === filters.cuisine;
        const matchesDiet = !filters.diet || recipe.diet === filters.diet;
        const matchesTime = !filters.time || matchesTimeFilter(recipe.prepTime, filters.time);
        const matchesSearch = !filters.search || 
            recipe.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            recipe.description.toLowerCase().includes(filters.search.toLowerCase());
        
        return matchesCuisine && matchesDiet && matchesTime && matchesSearch;
    });
}

function matchesTimeFilter(prepTime, timeFilter) {
    const minutes = parseInt(prepTime);
    switch(timeFilter) {
        case '<30': return minutes < 30;
        case '30-60': return minutes >= 30 && minutes <= 60;
        case '>60': return minutes > 60;
        default: return true;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize home page
    showPage('home');

    // Search form submissions
    document.querySelectorAll('.search-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchQuery = e.target.querySelector('input').value;
            const filteredRecipes = filterRecipes({ search: searchQuery });
            navigateToRecipeList();
            renderRecipeList(filteredRecipes);
        });
    });

    // Filter changes
    const filters = document.querySelectorAll('.filters select');
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            const filterValues = {
                cuisine: document.getElementById('cuisine-filter').value,
                time: document.getElementById('time-filter').value,
                diet: document.getElementById('diet-filter').value
            };
            const filteredRecipes = filterRecipes(filterValues);
            renderRecipeList(filteredRecipes);
        });
    });
});