import { useState, useEffect } from 'react';
import { ChefHat, Plus, X, Search, Heart, Loader2 } from 'lucide-react';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { IngredientInput } from './components/IngredientInput';
import { mockRecipes } from './data/mockRecipes';

// NOTE: Spoonacular API requires a free API key from https://spoonacular.com/food-api
// For this demo, we're using mock data. Replace with real API calls once you have a key.
const API_KEY = 'YOUR_SPOONACULAR_API_KEY_HERE';

interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  likes: number;
}

interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  extendedIngredients: { name: string; amount: number; unit: string }[];
}

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>(['chicken', 'rice']);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetails | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorite-recipes');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorite-recipes', JSON.stringify(favorites));
  }, [favorites]);

  const addIngredient = (ingredient: string) => {
    if (ingredient.trim() && !ingredients.includes(ingredient.toLowerCase())) {
      setIngredients([...ingredients, ingredient.toLowerCase()]);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0) return;

    setLoading(true);

    try {
      // MOCK DATA - In production, replace with:
      // const response = await fetch(
      //   `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&number=12&apiKey=${API_KEY}`
      // );
      // const data = await response.json();
      // setRecipes(data);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRecipes(mockRecipes);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (recipeId: number) => {
    // MOCK DATA - In production, replace with:
    // const response = await fetch(
    //   `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
    // );
    // const data = await response.json();
    // setSelectedRecipe(data);

    const mockDetails: RecipeDetails = {
      id: recipeId,
      title: recipes.find((r) => r.id === recipeId)?.title || 'Recipe',
      image: recipes.find((r) => r.id === recipeId)?.image || '',
      readyInMinutes: 45,
      servings: 4,
      summary:
        'This delicious recipe combines fresh ingredients with aromatic spices to create a memorable meal perfect for any occasion.',
      instructions:
        '1. Prepare all ingredients by washing and chopping them.\n2. Heat oil in a large pan over medium heat.\n3. Add aromatics and cook until fragrant.\n4. Add main ingredients and cook until done.\n5. Season to taste and serve hot.',
      extendedIngredients: [
        { name: 'Main ingredient', amount: 500, unit: 'g' },
        { name: 'Olive oil', amount: 2, unit: 'tbsp' },
        { name: 'Garlic', amount: 3, unit: 'cloves' },
        { name: 'Salt and pepper', amount: 1, unit: 'to taste' },
      ],
    };

    setSelectedRecipe(mockDetails);
  };

  const toggleFavorite = (recipeId: number) => {
    setFavorites((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const displayedRecipes = showFavorites
    ? recipes.filter((r) => favorites.includes(r.id))
    : recipes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <ChefHat className="w-10 h-10 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800">Recipe Finder</h1>
          </div>

          {/* Ingredient input */}
          <IngredientInput onAddIngredient={addIngredient} />

          {/* Ingredient tags */}
          {ingredients.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  Your ingredients ({ingredients.length}):
                </p>
                <button
                  onClick={() => setIngredients([])}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(index)}
                      className="hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Search button */}
          <button
            onClick={searchRecipes}
            disabled={ingredients.length === 0 || loading}
            className="mt-4 w-full sm:w-auto px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Searching...' : 'Find Recipes'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filter buttons */}
        {recipes.length > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setShowFavorites(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showFavorites
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Recipes ({recipes.length})
            </button>
            <button
              onClick={() => setShowFavorites(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                showFavorites
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavorites ? 'fill-white' : ''}`} />
              Favorites ({favorites.length})
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-orange-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Finding recipes...</p>
          </div>
        )}

        {/* Recipes grid */}
        {!loading && displayedRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => fetchRecipeDetails(recipe.id)}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && recipes.length === 0 && (
          <div className="text-center py-20">
            <ChefHat className="w-24 h-24 text-orange-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What's in your fridge?
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add ingredients you have at home and discover delicious recipes you can make
              right now!
            </p>

            <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Try these combinations:</h3>
              <div className="space-y-2">
                {[
                  ['chicken', 'rice', 'broccoli'],
                  ['pasta', 'tomato', 'basil'],
                  ['beef', 'potato', 'carrot'],
                  ['salmon', 'lemon', 'dill'],
                ].map((combo, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIngredients(combo);
                    }}
                    className="w-full text-left px-4 py-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    {combo.join(', ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No favorites */}
        {!loading && showFavorites && displayedRecipes.length === 0 && recipes.length > 0 && (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No favorites yet</h2>
            <p className="text-gray-600">Click the heart icon on recipes to save them here!</p>
          </div>
        )}
      </main>

      {/* Recipe details modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        isFavorite={selectedRecipe ? favorites.includes(selectedRecipe.id) : false}
        onToggleFavorite={() => selectedRecipe && toggleFavorite(selectedRecipe.id)}
      />
    </div>
  );
}