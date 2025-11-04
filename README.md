# Tomato Disease Classifier 🍅

A Next.js application that uses AI to detect diseases in tomato leaves.

## Features

- 📸 Upload tomato leaf images
- 🤖 AI-powered disease detection (using TensorFlow.js)
- 📊 Confidence scores for predictions
- 📧 Export results as postal cards (PDF/Image)
- 🎨 Modern UI with TailwindCSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tomato-vision/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts       # Backend API for image analysis
│   ├── globals.css            # Global styles with Tailwind
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main upload page
├── public/                    # Static assets
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── package.json
```

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS
- **AI**: TensorFlow.js
- **Export**: jsPDF, html-to-image

## Detected Diseases

The classifier can identify:
- Early Blight
- Late Blight
- Bacterial Spot
- Septoria Leaf Spot
- Target Spot
- Mosaic Virus
- Yellow Leaf Curl Virus
- Leaf Mold
- Spider Mites
- Healthy leaves

## Next Steps

1. **Add TensorFlow Model**: Uncomment the TensorFlow code in `app/api/analyze/route.ts`
2. **Train Model**: Train or download a pre-trained model for tomato disease detection
3. **Export Feature**: Implement the postal card export functionality
4. **Deploy**: Deploy to Vercel or another hosting platform

## License

MIT
