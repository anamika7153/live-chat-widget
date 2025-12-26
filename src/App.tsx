import ChatWidget from './components/chat/ChatWidget';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo page content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ShopEase Support
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to ShopEase! Click the chat button in the bottom right corner
            to talk with our AI support assistant.
          </p>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Need help? Try asking about:
            </h2>
            <ul className="text-left text-gray-600 space-y-2">
              <li>• Shipping times and international delivery</li>
              <li>• Return and refund policies</li>
              <li>• Payment methods we accept</li>
              <li>• Product warranties</li>
              <li>• Order tracking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
