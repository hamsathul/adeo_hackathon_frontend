'use client';

import React, { useState } from 'react';
import { Bot, Search, Image, MapPin, Map, Newspaper, Book, FileText, X, Bookmark, ChevronUp, ChevronDown, Minimize2, Maximize2 } from 'lucide-react';
import Header from '@/app/admin/_components/header';
import Sidebar from '@/app/admin/_components/sidebar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';
import Chatbot from '@/components/custom/chatbot';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';

// Define search types and their corresponding icons
const searchTypes = [
  { name: 'Search', icon: Search },
  { name: 'Images', icon: Image },
  { name: 'Places', icon: MapPin },
  { name: 'Maps', icon: Map },
  { name: 'News', icon: Newspaper },
  { name: 'Scholar', icon: Book },
  { name: 'Patents', icon: FileText },
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
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [summarizedContent, setSummarizedContent] = useState<{ [key: number]: string }>({})
  const [minimizedSummaries, setMinimizedSummaries] = useState<{ [key: number]: boolean }>({})
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;
  
  const toggleExpand = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index)
  }

  const handleSummarize = async (index: number) => {
    // Simulating an API call to summarize the content
    // In a real application, you would call your AI service here
    const summary = `This is a simulated summary of the content for card ${index + 1}. 
                     In a real application, this would be generated by an AI service 
                     based on the full content of the card.`
    setSummarizedContent(prev => ({
      ...prev,
      [index]: summary
    }))
    setMinimizedSummaries(prev => ({
      ...prev,
      [index]: false
    }))
  }

  const toggleMinimize = (index: number) => {
    setMinimizedSummaries(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`rounded-3xl ${item.bgColor} p-6 relative transition-all duration-300 hover:shadow-lg`}
        >
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="bg-white text-sm font-medium px-4 py-2 rounded-full">
              {item.date}
            </div>
            <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          {/* Content Section */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">{item.category}</div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-gray-700 leading-relaxed">
              {expandedCard === index ? item.description : `${item.description.slice(0, 100)}...`}
            </p>
          </div>

          {/* Tags Section */}
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

          {/* Footer */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => handleSummarize(index)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              {text.summarize}
            </Button>
            <button 
              onClick={() => toggleExpand(index)}
              className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              {text.details}
              {expandedCard === index ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Expanded Content */}
          {expandedCard === index && (
            <Dialog open={expandedCard === index} onOpenChange={() => setExpandedCard(null)}>
              <DialogContent className={`${item.bgColor} max-w-2xl`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-white text-sm font-medium px-4 py-2 rounded-full">
                      {item.date}
                    </div>
                    <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">{item.category}</div>
                    <DialogTitle className="text-2xl font-bold mb-4">{item.title}</DialogTitle>
                    <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>
                    
                    {/* Summarized content */}
                    {summarizedContent[index] && (
                      <div className="bg-white/80 rounded-xl p-4 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            {text.summary}
                          </h4>
                          <Button
                            onClick={() => toggleMinimize(index)}
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            aria-label={minimizedSummaries[index] ? "Expand summary" : "Minimize summary"}
                          >
                            {minimizedSummaries[index] ? (
                              <Maximize2 className="w-4 h-4" />
                            ) : (
                              <Minimize2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        {!minimizedSummaries[index] && (
                          <p className="text-sm text-gray-700">
                            {summarizedContent[index]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string, tagIndex: number) => (
                      <span 
                        key={tagIndex}
                        className="bg-white px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSummarize(index)}
                    variant="outline"
                    size="sm"
                    className="mt-4 flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    {text.summarize}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      ))}
    </div>
  )
}

// Function to transform sampleResults into StylishCards' expected format
const transformResultsForCards = (results: Array<any>, type: string): Array<any> => {
  return results.map((result, index) => {
    let transformed: any = {
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      title: '',
      description: '',
      tags: [],
      bgColor: '',
      category: type,
    };

    switch(type) {
      case 'Search':
        transformed.title = result.title;
        transformed.description = result.description;
        transformed.tags = ['Search Result'];
        break;
      case 'Images':
        transformed.title = result.title;
        transformed.description = result.alt;
        transformed.tags = ['Image'];
        break;
      case 'Places':
        transformed.title = result.name;
        transformed.description = `${result.address} - ${result.description}`;
        transformed.tags = [`Rating: ${result.rating}`];
        break;
      // Add more cases for other search types as needed
      default:
        transformed.title = result.title || 'Untitled';
        transformed.description = result.description || '';
        transformed.tags = ['General'];
    }

    // Assign pastel background colors in a rotating manner
    const colors = ['bg-[#F0F7FF]', 'bg-[#FFF0F3]', 'bg-[#F3F0FF]'];
    transformed.bgColor = colors[index % colors.length];

    return transformed;
  });
};

// Main SearchEngine component
const SearchEngine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<keyof typeof sampleResults>>(new Set(['Search']));
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
  const getRelevantResults = (): Array<any> => {
    const results: Array<any> = [];
    selectedTypes.forEach((type) => {
      if (sampleResults[type]) {
        results.push(...sampleResults[type]);
      }
    });

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
      if (sampleResults[type]) {
      transformedResults.push(...transformResultsForCards(sampleResults[type], type));
      }
    });

    // Optionally, filter based on searchQuery here
    if (searchQuery.trim() !== '') {
      transformedResults = transformedResults.filter((item: TransformedResult) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return transformedResults;
    };

    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <header className="flex justify-end p-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            {/* You can add an icon here, e.g., Menu icon */}
          </button>
        </header>
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <main className="container mx-auto px-4 max-w-6xl">
          {/* Search Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-8">{text.searchEngine}</h1>
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
  
          {/* Results Area */}
          <div className="flex-1">
            {searchQuery && getRelevantResults().length > 0 ? (
              <StylishCards items={getRelevantResults()} />
            ) : searchQuery ? (
              <p className="text-center text-gray-500">{text.noresult}</p>
            ) : (
              <p className="text-center text-gray-500">{text.enterSearch}</p>
            )}
            {/* AI Assistant Button */}
          <div className="fixed bottom-4 right-4">
            <div
              className={`relative rounded-full bg-primary text-primary-foreground p-3 cursor-pointer transition-all duration-300 ease-in-out ${isHovered ? 'w-36' : 'w-12'}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setShowChatbot(true)}
            >
              <Bot className="w-8 h-8" />
              {isHovered && (
                <span className="absolute left-12 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                  {text.ai}
                </span>
              )}
            </div>
          </div>
          {/* Chatbot component */}
          <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
          </div>
        </main>
      </div>
    );
  };
  
  export default SearchEngine;