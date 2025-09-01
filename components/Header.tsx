import { Brain, BarChart3, Zap, Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                AI Model Hub
              </h1>
              <p className="text-sm text-gray-600">
                Compare, analyze, and choose the best AI models
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#models" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <BarChart3 className="h-5 w-5" />
              <span>Models</span>
            </a>
            <a href="#compare" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Zap className="h-5 w-5" />
              <span>Compare</span>
            </a>
            <a href="#benchmarks" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Shield className="h-5 w-5" />
              <span>Benchmarks</span>
            </a>
          </nav>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="btn-primary">
              Get Started
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden mt-4">
          <button className="w-full btn-secondary">
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}