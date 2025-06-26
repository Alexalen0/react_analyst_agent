# Data Analyst App

A modern, interactive web application for data analysis and visualization. Built with React, TypeScript, Material UI, and powerful data processing libraries, this app enables users to upload, process, and analyze various file types (CSV, Excel, PDF, DOCX, images) and visualize insights with beautiful charts.

## Features

- **File Upload & Processing:** Supports TXT, DOCX, PDF, CSV, XLSX, PNG, JPG, JPEG files.
- **Data Extraction:** Extracts text and tabular data from documents and images (OCR).
- **AI Integration:** Connects to Llama-3.3-70B-Instruct-Turbo-Free for natural language analysis (API key required).
- **Data Visualization:** Interactive charts using Plotly.js and Nivo.
- **Modern UI:** Responsive, glassmorphic design with Material UI and custom themes.

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Running the App

```bash
npm start
# or
yarn start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
# or
yarn build
```

## Usage

1. Upload a supported file (CSV, Excel, PDF, DOCX, image, etc.).
2. The app extracts and displays the content.
3. Enter your query or analysis prompt (optionally using your API key for AI features).
4. View answers and interactive visualizations.

## Project Structure

- `src/` — Main source code
  - `App.tsx` — Main app component
  - `services/` — File processing and API integration
  - `types.ts` — TypeScript types
- `public/` — Static assets and HTML

## Dependencies

- React, TypeScript
- Material UI (MUI)
- Plotly.js, react-plotly.js
- @nivo/bar, @nivo/line
- Axios, Tesseract.js, Mammoth, xlsx, pdfjs-dist
