'use client';

import React, { useState } from 'react';
import { Bot, Search, Image, MapPin, Map, Newspaper, Book, FileText, X, Bookmark, Minimize2, Maximize2 } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';
import { Layout } from '@/components/common/Layout';
import axios from 'axios';

// Define search types and their corresponding icons
const searchTypes = [
  { name: 'search', icon: Search },
  { name: 'images', icon: Image },
  { name: 'places', icon: MapPin },
  { name: 'maps', icon: Map },
  { name: 'news', icon: Newspaper },
  { name: 'scholar', icon: Book },
  { name: 'patents', icon: FileText },
];

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
  // Add other search types as needed
};

// Reusable StylishCards component
const StylishCards = ({ items }: { items: Array<any> }) => {
	const [expandedCard, setExpandedCard] = useState<number | null>(null);
	const [summarizedContent, setSummarizedContent] = useState<{ [key: number]: string }>({});
	const [minimizedSummaries, setMinimizedSummaries] = useState<{ [key: number]: boolean }>({});
	const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
	const { isArabic } = useLanguageStore();
	const text = isArabic ? translations.ar : translations.en;

	const toggleExpand = (index: number) => {
		setExpandedCard(expandedCard === index ? null : index);
	};

	const handleSummarize = async (index: number, content: string) => {
		setIsLoading(prev => ({ ...prev, [index]: true }));
		try {
		  const response = await axios.post('http://localhost:8000/api/v1/searchanalysis/search', {
			query: content
		  });
		  setSummarizedContent(prev => ({
			...prev,
			[index]: response.data.results.analysis
		  }));
		  setMinimizedSummaries(prev => ({
			...prev,
			[index]: false
		  }));
		} catch (error) {
		  console.error('Search analysis failed:', error);
		} finally {
		  setIsLoading(prev => ({ ...prev, [index]: false }));
		}
	  };
	
	  const toggleMinimize = (index: number) => {
		setMinimizedSummaries(prev => ({
		  ...prev,
		  [index]: !prev[index]
		}));
	  };
	
	  const groupedItems = items.reduce((acc: { [key: string]: Array<any> }, item) => {
		const category = item.category || 'Other';
		if (!acc[category]) acc[category] = [];
		acc[category].push(item);
		return acc;
	  }, {});
	

	return (
		<div className="space-y-8">
		  {Object.entries(groupedItems).map(([category, categoryItems]) => (
			<div key={category} className="mb-8">
			  <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
			  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{categoryItems.map((item, index) => (
							<div 
								key={index} 
								className={`rounded-3xl ${item.bgColor} p-6 relative transition-all duration-300 hover:shadow-lg`}
							>
								{/* Card Header */}
								<div className="flex justify-between items-start mb-6">
									<div className="bg-white text-sm font-medium px-4 py-2 rounded-full">
										{item.date}
									</div>
									<button className="p-2 hover:bg-white/50 rounded-full transition-colors">
										<Bookmark className="w-5 h-5" />
									</button>
								</div>

								{/* Card Content */}
								<div className="mb-6">
									<h3 className="text-xl font-bold mb-3">{item.title}</h3>
									<p className="text-gray-700 leading-relaxed">
										{item.description}
									</p>
								</div>

								{/* Tags */}
								<div className="flex flex-wrap gap-2 mb-6">
									{item.tags.map((tag: string, tagIndex: number) => (
										<span 
											key={tagIndex}
											className="bg-white px-3 py-1 rounded-full text-sm"
										>
											{tag}
										</span>
									))}
								</div>

								{summarizedContent[index] && !minimizedSummaries[index] && (
  <div className="mt-4 p-4 bg-white/50 rounded-lg space-y-4">
    <div>
      <h4 className="font-semibold mb-2">{text.summary}</h4>
      <p className="text-sm">{summarizedContent[index].summary}</p>
    </div>
    <div>
      <h4 className="font-semibold mb-2">{text.keyPoints}</h4>
      <ul className="list-disc list-inside text-sm">
        {summarizedContent[index].key_points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
    <div>
      <h4 className="font-semibold mb-2">{text.trends}</h4>
      <ul className="list-disc list-inside text-sm">
        {summarizedContent[index].trends.map((trend, i) => (
          <li key={i}>{trend}</li>
        ))}
      </ul>
    </div>
  </div>
)}

                {/* Footer */}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={() => handleSummarize(index, item.description)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={isLoading[index]}
                  >
                    {isLoading[index] ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    {text.summarize}
                  </Button>
                  
                  {summarizedContent[index] && (
                    <Button
                      onClick={() => toggleMinimize(index)}
                      variant="ghost"
                      size="sm"
                    >
                      {minimizedSummaries[index] ? <Maximize2 /> : <Minimize2 />}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Function to transform sampleResults into StylishCards' expected format
const transformResultsForCards = (results: any, type: string): Array<any> => {
	const cards = [];
   
	switch(type) {
	  case 'search':
		// Knowledge Graph
		if (results.knowledgeGraph) {
		  cards.push({
			date: new Date().toLocaleDateString('en-GB'),
			title: results.knowledgeGraph.title,
			description: results.knowledgeGraph.description,
			tags: Object.entries(results.knowledgeGraph.attributes || {})
			  .map(([key, value]) => `${key}: ${value}`),
			bgColor: getBgColor(0),
			category: 'Knowledge Graph'
		  });
		}
   
		// Organic Results 
		if (results.organic) {
		  results.organic.forEach((result: any, index: number) => {
			cards.push({
			  date: new Date().toLocaleDateString('en-GB'),  
			  title: result.title,
			  description: result.snippet,
			  tags: result.sitelinks?.map((link: any) => link.title) || [],
			  bgColor: getBgColor(index + 1),
			  category: 'Search Results'
			});
		  });
		}
   
		// Images
		if (results.images) {
		  results.images.forEach((image: any, index: number) => {
			cards.push({
			  date: new Date().toLocaleDateString('en-GB'),
			  title: image.title,
			  description: `Image from ${image.link}`,
			  tags: ['Image'],
			  bgColor: getBgColor(index),
			  category: 'Images'
			});
		  });
		}
   
		// People Also Ask
		if (results.peopleAlsoAsk) {
		  results.peopleAlsoAsk.forEach((item: any, index: number) => {
			cards.push({
			  date: new Date().toLocaleDateString('en-GB'),
			  title: item.question,
			  description: item.snippet,
			  tags: ['FAQ'],
			  bgColor: getBgColor(index),
			  category: 'People Also Ask'
			});
		  });
		}
   
		// Related Searches
		if (results.relatedSearches) {
		  results.relatedSearches.forEach((search: any, index: number) => {
			cards.push({
			  date: new Date().toLocaleDateString('en-GB'),
			  title: search.query,
			  description: `Related search query`,
			  tags: ['Related'],
			  bgColor: getBgColor(index),
			  category: 'Related Searches'
			});
		  });
		}
   
		break;
	}
   
	return cards;
   };

const getBgColor = (index: number): string => {
	const colors = ['bg-[#E8E5DC]', 'bg-[#EAEAEA]', 'bg-[#BC9C9C]'];
	return colors[index % colors.length];
};

const server_url = process.env.NEXT_PUBLIC_BACKEND_URL;

// Main SearchEngine component
const SearchEngine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<keyof typeof sampleResults>>(new Set(['search']));
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const { isArabic } = useLanguageStore();
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const text = isArabic ? translations.ar : translations.en;

  const searchAPI = async (query: string, options: string[]) => {
	try {
	  const response = await axios.post(`${server_url}/search/`, { query, options });
	  return response.data.results;

	} catch (error) {
	  console.error('Error fetching search results:', error);
	  return null;
	}
  };

  const toggleSearchType = (type: keyof typeof sampleResults) => {
    const newSelectedTypes = new Set<keyof typeof sampleResults>(selectedTypes);
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

  // Gather all relevant filters based on selected search types
  const getRelevantFilters = () => {
    const allFilters = new Set<string>();
    selectedTypes.forEach(type => {
      // Assuming you have defined additionalFilters, else adjust accordingly
      // For demonstration, using sampleFilters or similar
      // Example:
      // additionalFilters[type]?.forEach(filter => allFilters.add(filter));
    });
    return Array.from(allFilters);
  };

  // Get all relevant results based on search query and selected types
  const getRelevantResults = async (): Promise<any[]> => {
    const options = Array.from(selectedTypes);
    const results = await searchAPI(searchQuery, options);
    if (!results) {
      return [];
    }

    // Transform results to match StylishCards format
    let transformedResults: Array<any> = [];
    // Define interfaces for the transformed results
    interface TransformedResult {
      date: string;
      title: string;
      description: string;
      tags: string[];
      bgColor: string;
      category: string;
    }

    selectedTypes.forEach((type) => {
      if (results[type]) {
        transformedResults.push(...transformResultsForCards(results[type], type));
      }
    });

    // Optionally, filter based on searchQuery here
    if (searchQuery.trim() !== '') {
      transformedResults = transformedResults.filter((item: TransformedResult) => 
        item.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag: string) => tag?.toLowerCase().includes(searchQuery?.toLowerCase()))
      );
    }

    return transformedResults;
  };

	const handleSearch = async () => {
		setIsLoading(true);
		const results = await getRelevantResults();
		setSearchResults(results);
		setIsLoading(false);
	  };

  return (
    <Layout>
      <div className="min-h-screen bg-white text-gray-900">
      <main className="container mx-auto px-4 max-w-6xl">
        {/* Logo Section */}
        <div className="flex justify-center items-center py-4">
          <img 
            src="/samah-svg.svg" 
            alt="Samah Logo" 
            className="w-48 h-auto"
          />
        </div>
        {/* Search Section */}
        <div className="text-center py-4">

          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search anything..."
              className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2"
      onClick={handleSearch}
      >
              <Search className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Search Types */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {searchTypes.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => toggleSearchType(name as keyof typeof sampleResults)}
                className={`flex items-center px-4 py-2 rounded-full ${
                  selectedTypes.has(name as keyof typeof sampleResults)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                } hover:opacity-90`}
              >
                <Icon size={16} className="mr-2" />
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Filters Display */}
        {selectedFilters.size > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from(selectedFilters).map((filter) => (
              <div
                key={filter}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {filter}
                <button
                  onClick={() => toggleFilter(filter)}
                  className="ml-2 hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

{/* // Results Area */}
    <div className="flex-1">
    {isLoading ? (
      <p className="text-center text-gray-500">Loading...</p>
      ) : searchResults.length > 0 ? (
      <StylishCards items={searchResults} />
      ) : searchQuery ? (
      <p className="text-center text-gray-500">{text.noresult}</p>
      ) : (
      <p className="text-center text-gray-500">{text.enterSearch}</p>
      )}
        </div>
      </main>
    </div>
    </Layout>
  );
};

export default SearchEngine;