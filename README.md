# AI Fiesta 🎉

A powerful web application that allows you to compare responses from multiple AI models side by side. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Multi-Model Comparison**: Compare responses from 8+ popular AI models including GPT-4, Claude, Gemini, and more
- **Side-by-Side View**: See all responses in a clean, organized grid layout
- **Best Response Selection**: Mark and highlight the best response
- **Copy Functionality**: Easily copy any response to your clipboard
- **Real-time Loading**: Watch responses come in as they're generated
- **Chat-like Interface**: Modern sidebar layout with chat history and model toggles
- **Model Toggle Switches**: Easy model selection with visual toggle switches in the header
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark Mode Support**: Automatic dark/light mode switching

## Supported AI Models

- **OpenAI**: GPT-4o, GPT-4o Mini
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro 1.5
- **Meta**: Llama 3.1 405B
- **DeepSeek**: DeepSeek Chat
- **Mistral AI**: Mistral 7B

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aifiesta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Get an OpenRouter API Key**
   - Visit [OpenRouter](https://openrouter.ai/)
   - Sign up for an account
   - Generate an API key
   - Add credits to your account (required for API usage)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Select Models**: Toggle AI models on/off using the switches in the header (up to 8 at once)
2. **Enter Prompt**: Type your question or prompt in the chat input at the bottom
3. **Submit**: Press Enter or click the send button to compare responses
4. **Compare**: View responses side by side as they come in
5. **Mark Best**: Click "Mark as Best" on your favorite response
6. **Copy**: Use the copy button to copy any response to your clipboard
7. **Chat History**: View previous conversations in the sidebar
8. **New Chat**: Click "New Chat" in the sidebar to start fresh

## API Routes

- `POST /api/compare` - Compare multiple AI models with a given prompt

## Project Structure

```
src/
├── app/
│   ├── api/compare/route.ts    # API endpoint for model comparison
│   ├── layout.tsx              # Root layout with metadata
│   └── page.tsx                # Main application page
├── components/
│   ├── ComparisonView.tsx      # Main comparison display
│   ├── ModelSelector.tsx       # Model selection component
│   ├── PromptInput.tsx         # Input form component
│   └── ResponseColumn.tsx      # Individual response display
├── lib/
│   ├── models.ts               # Available AI models configuration
│   └── openrouter.ts           # OpenRouter API integration
└── types/
    └── ai.ts                   # TypeScript type definitions
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **OpenRouter** - Unified API for multiple AI models
- **React 19** - Latest React features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/aifiesta/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing unified access to multiple AI models
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling system
- All the AI model providers for their incredible technology

---

**Happy AI Comparing! 🚀**