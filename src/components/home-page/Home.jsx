import { useState } from 'react';

const HomePage = () => {

  const [url, setUrl] = useState('');
  const [shortenedData, setShortenedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Base URL for your backend
  const BACKEND_BASE_URL = 'http://localhost:8080';
  const SHORT_URL = "http://localhost:8080/url/redirect/";

  const handleSubmit = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/url/shorten?actualUrl=${encodeURIComponent(url)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      
      // Replace short.ly with your actual backend URL for the shortened link
      const shortUrl = SHORT_URL+data.shortUrl;
      console.log("get backend url",shortUrl);
      
      setShortenedData({
        actualUrl: data.actualUrl,
        shortUrl: shortUrl
      });
    } catch (err) {
      setError(err.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };
  
  // Rest of your component remains the same
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Shortener</h1>
          <p className="text-gray-600">Shorten your long URLs into compact, shareable links</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Your URL</h2>
          <div className="flex gap-4">
            <input
              type="url"
              placeholder="https://example.com/your-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-medium 
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                } transition-colors`}
            >
              {loading ? 'Processing...' : 'Get URL'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {shortenedData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-blue-600" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">Your Shortened URL</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500 mb-1">Original URL:</p>
                <p className="text-gray-900 break-all">{shortenedData.actualUrl}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Shortened URL:</p>
                <a 
                  href={shortenedData.shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 break-all hover:underline"
                >
                  {shortenedData.shortUrl}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;