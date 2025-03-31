import { SimpleFileConverter } from "./simple-file-converter"

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">Simple File Converter</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-center text-xl font-medium">Convert Your Files</h2>
          <SimpleFileConverter />
        </div>
      </main>

      <footer className="container mx-auto mt-8 px-4 py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Simple File Converter</p>
        <p className="mt-2">
          <a href="/" className="text-blue-600 hover:underline">
            Back to Home
          </a>
        </p>
      </footer>
    </div>
  )
}

