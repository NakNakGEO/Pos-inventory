import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useSuppliers } from '../hooks/useSuppliers';
import { useCategories } from '../hooks/useCategories';

const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const { categories } = useCategories();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    const results = [
      ...products.filter(p => p.name.toLowerCase().includes(term.toLowerCase())).map(p => ({ ...p, type: 'product' })),
      ...suppliers.filter(s => s.name.toLowerCase().includes(term.toLowerCase())).map(s => ({ ...s, type: 'supplier' })),
      ...categories.filter(c => c.name.toLowerCase().includes(term.toLowerCase())).map(c => ({ ...c, type: 'category' }))
    ];

    setSearchResults(results.slice(0, 5));
  };

  const handleResultClick = (result: any) => {
    setSearchTerm('');
    setSearchResults([]);
    switch (result.type) {
      case 'product':
        navigate('/products', { state: { highlightId: result.id } });
        break;
      case 'supplier':
        navigate('/suppliers', { state: { highlightId: result.id } });
        break;
      case 'category':
        navigate('/categories', { state: { highlightId: result.id } });
        break;
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-full shadow-md">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full py-2 pl-4 pr-10 rounded-full focus:outline-none"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
      </div>
      {searchResults.length > 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleResultClick(result)}
            >
              <p className="font-semibold">{result.name}</p>
              <p className="text-sm text-gray-500 capitalize">{result.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;