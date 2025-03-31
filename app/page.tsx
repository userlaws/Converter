import { ModernFileConverter } from '@/components/modern-file-converter';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background transition-colors duration-300'>
      <header className='border-b bg-background'>
        <div className='container mx-auto flex items-center justify-between px-4 py-4'>
          <h1 className='text-2xl font-bold'>Modern File Converter</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className='container mx-auto px-4 py-12'>
        <div className='mx-auto max-w-3xl space-y-8'>
          <div className='space-y-2 text-center'>
            <h2 className='text-3xl font-bold tracking-tight'>
              Convert Your Files
            </h2>
            <p className='text-muted-foreground'>
              Fast, secure, and easy file conversion for all your needs
            </p>
          </div>

          <ModernFileConverter />
        </div>
      </main>

      <footer className='mt-auto border-t py-6'>
        <div className='container mx-auto px-4 text-center'>
          {/* <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Modern File Converter</p>
          <p className="mt-2">
            <a href="/simple" className="text-sm text-primary hover:underline">
              View Simple Version
            </a>
          </p> */}
        </div>
      </footer>
    </div>
  );
}
