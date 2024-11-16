import React, { useState } from 'react';
import { Search, Image, MapPin, Map, Star, Newspaper, Book, FileText, Sun, Moon, X } from 'lucide-react';

const categories = [
  "Technology", "Health", "Education", "Business", 
  "Arts", "Science", "Sports", "Entertainment"
];

const searchTypes = [
  { name: 'Search', icon: Search },
  { name: 'Images', icon: Image },
  { name: 'Places', icon: MapPin },
  { name: 'Maps', icon: Map },
  { name: 'Reviews', icon: Star },
  { name: 'News', icon: Newspaper },
  { name: 'Scholar', icon: Book },
  { name: 'Patents', icon: FileText },
];

// Additional filters for each search type
const additionalFilters = {
  Search: ['Latest', 'Most Relevant', 'Most Cited'],
  Images: ['Photos', 'Illustrations', 'Vector Graphics', 'GIFs'],
  Places: ['Open Now', 'Highly Rated', 'Price Range', 'Distance'],
  Maps: ['Traffic', 'Transit', 'Bike', 'Terrain'],
  Reviews: ['5 Star', '4+ Star', 'Recent', 'Verified'],
  News: ['Latest', 'Local', 'International', 'Business'],
  Scholar: ['Articles', 'Books', 'Conference Papers', 'Citations'],
  Patents: ['Active', 'Expired', 'Pending', 'International'],
};

// Sample results for different search types
const sampleResults = {
  Search: [
    { title: "Understanding AI Technologies", url: "#", description: "Comprehensive guide to artificial intelligence and its applications in modern technology." },
    { title: "Machine Learning Basics", url: "#", description: "Learn the fundamentals of machine learning and how it's transforming industries." },
  ],
  Images: [
    { url: "/api/placeholder/200/200", alt: "AI Technology", title: "AI Visualization" },
    { url: "/api/placeholder/200/200", alt: "Machine Learning", title: "ML Diagram" },
  ],
  Places: [
    { name: "Tech Hub", rating: 4.5, address: "123 Innovation St", description: "Leading technology center" },
    { name: "AI Research Lab", rating: 4.8, address: "456 Science Ave", description: "Cutting-edge research facility" },
  ],
};

const SearchEngine = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<keyof typeof additionalFilters>>(new Set(['Search']));
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

interface SearchType {
    name: string;
    icon: React.ComponentType;
}

interface ImageResult {
    url: string;
    alt: string;
    title: string;
}

interface PlaceResult {
    name: string;
    rating: number;
    address: string;
    description: string;
}

interface SearchResult {
    title: string;
    url: string;
    description: string;
}

const toggleSearchType = (type: keyof typeof additionalFilters) => {
    const newSelectedTypes = new Set<keyof typeof additionalFilters>(selectedTypes);
    if (newSelectedTypes.has(type)) {
        if (newSelectedTypes.size > 1) { // Ensure at least one type is always selected
            newSelectedTypes.delete(type);
        }
    } else {
        newSelectedTypes.add(type);
    }
    setSelectedTypes(newSelectedTypes);
};

const toggleFilter = (filter: string) => {
    const newFilters = new Set<string>(selectedFilters);
    if (newFilters.has(filter)) {
        newFilters.delete(filter);
    } else {
        newFilters.add(filter);
    }
    setSelectedFilters(newFilters);
};

  // Get all relevant filters based on selected search types
  const getRelevantFilters = () => {
    const allFilters = new Set();
    selectedTypes.forEach(type => {
      additionalFilters[type]?.forEach(filter => allFilters.add(filter));
    });
    return Array.from(allFilters);
  };

  // Results component based on search type
  const ResultsDisplay = ({ types }: { types: Set<string> }) => {
    return (
      <div className="space-y-8">
        {Array.from(types).map(type => (
          <div key={type} className="border-b pb-8">
            <h2 className="text-xl font-bold mb-4">{type} Results</h2>
            {type === 'Images' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleResults.Images.map((image, index) => (
                  <div key={index} className="rounded overflow-hidden shadow-lg">
                    <img src={image.url} alt={image.alt} className="w-full h-48 object-cover" />
                    <div className="p-2 text-sm">{image.title}</div>
                  </div>
                ))}
              </div>
            )}
            {type === 'Places' && (
              <div className="space-y-4">
                {sampleResults.Places.map((place, index) => (
                  <div key={index} className="border rounded p-4 shadow-sm">
                    <h3 className="font-bold">{place.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} />
                      <span className="ml-1">{place.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{place.address}</p>
                    <p className="mt-2">{place.description}</p>
                  </div>
                ))}
              </div>
            )}
            {type === 'Search' && (
              <div className="space-y-4">
                {sampleResults.Search.map((result, index) => (
                  <div key={index} className="border-b pb-4">
                    <h3 className="text-blue-600 hover:underline cursor-pointer">
                      {result.title}
                    </h3>
                    <p className="text-sm text-gray-600">{result.url}</p>
                    <p className="mt-1">{result.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className="flex justify-end p-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-6xl">
        {/* Search Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-8">Search Engine</h1>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Search Types and Filters */}
        <div className="mb-8">
          {/* Search Types */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {searchTypes.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => toggleSearchType(name as keyof typeof additionalFilters)}
                className={`flex items-center px-4 py-2 rounded-full ${
                  selectedTypes.has(name as keyof typeof additionalFilters)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                } hover:opacity-90`}
              >
                <Icon size={16} className="mr-2" />
                {name}
              </button>
            ))}
          </div>

          {/* Filter Toggle Button */}
          <div className="text-center">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {showFilterPanel ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="font-bold mb-3">Refine Results</h3>
              <div className="flex flex-wrap gap-2">
                {getRelevantFilters().map((filter) => (
                  <button
                    key={filter as string}
                    onClick={() => toggleFilter(filter as string)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedFilters.has(filter as string)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-700'
                    } hover:opacity-90`}
                  >
                    {filter as string}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Filters Display */}
        {selectedFilters.size > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from(selectedFilters).map((filter) => (
              <div
                key={filter}
                className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                {filter}
                <button
                  onClick={() => toggleFilter(filter)}
                  className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Categories Sidebar */}
          <aside className="hidden md:block w-48 space-y-2">
            <h2 className="font-bold mb-4">Categories</h2>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`block w-full text-left px-3 py-2 rounded ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            {searchQuery && <ResultsDisplay types={selectedTypes} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchEngine;