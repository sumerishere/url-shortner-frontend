import { useState } from 'react';
import * as parse5 from 'parse5';

const DomAnalyzer = () => {
  const [inputCode, setInputCode] = useState('');
  const [domTree, setDomTree] = useState(null);
  const [error, setError] = useState(null);

  // Recursive function to render DOM tree
  const renderDOMTree = (node, depth = 0) => {
    if (!node) return null;

    // More comprehensive color gradient for different depths
    const colorClasses = [
      'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 
      'bg-green-50', 'bg-green-100', 'bg-green-200',
      'bg-purple-50', 'bg-purple-100', 'bg-purple-200'
    ];

    const nodeColor = colorClasses[depth % colorClasses.length];

    // Handle text nodes
    if (node.nodeName === '#text' && node.value && node.value.trim()) {
      return (
        <div 
          key={`text-${Math.random()}`} 
          className={`ml-${depth * 4} my-1 p-2 rounded ${nodeColor} text-gray-700`}
        >
          Text: &quot;{node.value.trim()}&quot;
        </div>
      );
    }

    // Handle element nodes
    if (node.nodeName && node.nodeName !== '#document') {
      return (
        <div 
          key={`tag-${Math.random()}`} 
          className={`ml-${depth * 4} my-1 p-2 rounded ${nodeColor} flex flex-col`}
        >
          <div className="flex items-center">
            <div className="mr-2 font-bold text-gray-800">
              &lt;{node.nodeName}&gt;
            </div>
            {node.attrs && node.attrs.length > 0 && (
              <div className="flex">
                {node.attrs.map((attr) => (
                  <span 
                    key={attr.name} 
                    className="text-sm text-gray-600 mr-2 bg-gray-100 px-1 rounded"
                  >
                    {attr.name}=&quot;{attr.value}&quot;
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Recursively render children */}
          {node.childNodes && node.childNodes.length > 0 && (
            <div className="pl-4">
              {node.childNodes.map(child => renderDOMTree(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Render document root children
    if (node.nodeName === '#document') {
      return node.childNodes.map(child => renderDOMTree(child, depth));
    }

    return null;
  };

  const analyzeDOM = () => {
    try {
      // Reset previous errors
      setError(null);

      // Parse the document using parse5
      const parsedDOM = parse5.parse(inputCode);

      // Set the parsed DOM
      setDomTree(parsedDOM);
    } catch (error) {
      console.error('DOM Parsing Error:', error);
      setError('Invalid HTML or parsing error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Side - Input Container */}
      <div className="w-1/2 p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          HTML/DOM Analyzer
        </h2>
        
        <div className="mb-4">
          <textarea
            className="w-full h-96 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste your HTML or React code here..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
        </div>
        
        <button 
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          onClick={analyzeDOM}
        >
          Analyze DOM
        </button>

        {/* Error Handling */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Right Side - Output Container */}
      <div className="w-1/2 p-6 bg-gray-50">
        <h3 className="text-xl font-bold mb-4 text-center">
          DOM Hierarchy Visualization
        </h3>

        {/* DOM Visualization Section */}
        <div className="bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-100px)] overflow-auto">
          {domTree ? (
            renderDOMTree(domTree)
          ) : (
            <div className="text-center text-gray-500">
              {`Paste HTML and click "Analyze DOM" to see the structure`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DomAnalyzer;