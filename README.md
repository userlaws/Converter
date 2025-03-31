# Modern File Converter

## Overview

The Modern File Converter is a web application that allows users to convert files quickly and securely. It supports various formats including PDF, JPG, PNG, and more. The application utilizes the Convertio API for seamless file conversion.

## Features

- Fast and secure file conversion
- Supports multiple file formats
- User-friendly interface
- Drag and drop functionality
- Download converted files easily

## Technologies Used

- React
- Next.js
- Axios
- Convertio API
- Tailwind CSS (or any other styling framework you are using)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/userlaws/Converter.git
   cd modern-file-converter
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables:
   - Create a `.env.local` file in the root directory and add your Convertio API key:
     ```
     NEXT_PUBLIC_CONVERTIO_API_KEY=your_api_key_here
     ```

### Running the Application

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

### Usage

1. Select a file to convert.
2. Choose the desired output format.
3. Click "Convert Now" to start the conversion.
4. Download the converted file once the process is complete.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Convertio API](https://developers.convertio.co/api/docs/) for providing the file conversion service.
