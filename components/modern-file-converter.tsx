'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, File, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import axios from 'axios';

const fileFormats = [
  { id: 'documents', label: 'Documents', formats: ['PDF', 'DOCX', 'TXT'] },
  { id: 'images', label: 'Images', formats: ['JPG', 'PNG', 'SVG', 'WEBP'] },
  { id: 'audio', label: 'Audio', formats: ['MP3', 'WAV', 'OGG'] },
];

export function ModernFileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedTab, setSelectedTab] = useState('documents');
  const [convertTo, setConvertTo] = useState('PDF');
  const [status, setStatus] = useState<
    'idle' | 'uploading' | 'converting' | 'success' | 'error'
  >('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [conversionId, setConversionId] = useState('');

  // Get the API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_CONVERTIO_API_KEY;

  // Check status of conversion periodically
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (conversionId && status === 'converting') {
      interval = setInterval(async () => {
        try {
          const response = await axios.post(
            'https://api.convertio.co/convert/list',
            {
              apikey: apiKey,
              status: 'all',
              count: 1,
            }
          );

          if (
            response.data &&
            response.data.data &&
            response.data.data.length > 0
          ) {
            const conversionStatus = response.data.data[0].status;

            if (conversionStatus === 'finished') {
              // Get the download URL
              try {
                const dlResponse = await axios.get(
                  `https://api.convertio.co/convert/${conversionId}/dl`
                );

                if (
                  dlResponse.data &&
                  dlResponse.data.data &&
                  dlResponse.data.data.content
                ) {
                  // Create a download URL from the content
                  const content = dlResponse.data.data.content;
                  const binaryData = Buffer.from(content, 'base64');

                  // Determine the appropriate MIME type
                  let mimeType = 'application/octet-stream';
                  switch (convertTo.toLowerCase()) {
                    case 'pdf':
                      mimeType = 'application/pdf';
                      break;
                    case 'docx':
                      mimeType =
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                      break;
                    case 'jpg':
                    case 'jpeg':
                      mimeType = 'image/jpeg';
                      break;
                    case 'png':
                      mimeType = 'image/png';
                      break;
                    case 'svg':
                      mimeType = 'image/svg+xml';
                      break;
                    case 'webp':
                      mimeType = 'image/webp';
                      break;
                    case 'mp3':
                      mimeType = 'audio/mpeg';
                      break;
                    case 'wav':
                      mimeType = 'audio/wav';
                      break;
                    case 'ogg':
                      mimeType = 'audio/ogg';
                      break;
                    case 'txt':
                      mimeType = 'text/plain';
                      break;
                  }

                  const blob = new Blob([binaryData], { type: mimeType });
                  const url = URL.createObjectURL(blob);
                  setDownloadUrl(url);
                  setStatus('success');
                  clearInterval(interval);
                }
              } catch (dlError: any) {
                console.error(
                  'Download error:',
                  dlError.response?.data || dlError
                );
              }
            } else if (conversionStatus === 'failed') {
              setStatus('error');
              setErrorMessage(
                response.data.data[0].error || 'Conversion failed'
              );
              clearInterval(interval);
            } else {
              // Still converting, update progress
              setProgress(Math.min(Date.now() % 100, 90)); // Simulate progress
            }
          }
        } catch (error: any) {
          console.error('Status check error:', error.response?.data || error);
          setStatus('error');
          setErrorMessage('Failed to check conversion status');
          clearInterval(interval);
        }
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [conversionId, status, apiKey]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatus('error');
      setErrorMessage('Please select a file first');
      return;
    }

    if (!apiKey) {
      setStatus('error');
      setErrorMessage(
        'API key is missing. Please set NEXT_PUBLIC_CONVERTIO_API_KEY in your environment.'
      );
      return;
    }

    setStatus('converting');
    setProgress(10);

    try {
      // Step 1: Initiate the conversion
      const initResponse = await axios.post(
        'https://api.convertio.co/convert',
        {
          apikey: apiKey,
          input: 'upload', // Using 'upload' input type
          outputformat: convertTo.toLowerCase(),
        }
      );

      console.log('Conversion initiated:', initResponse.data);

      if (
        initResponse.data &&
        initResponse.data.data &&
        initResponse.data.data.id
      ) {
        const id = initResponse.data.data.id;
        setConversionId(id);
        setProgress(30);

        // Step 2: Upload the file
        const formData = new FormData();
        formData.append('file', file);

        try {
          const uploadResponse = await axios.put(
            `https://api.convertio.co/convert/${id}/${file.name}`,
            file,
            {
              headers: {
                'Content-Type': file.type || 'application/octet-stream',
              },
            }
          );

          console.log('File uploaded:', uploadResponse.data);
          setProgress(50);

          // Status checking and download will be handled by the useEffect
        } catch (uploadError: any) {
          console.error(
            'Upload error:',
            uploadError.response?.data || uploadError
          );
          setStatus('error');
          setErrorMessage(
            'Failed to upload file: ' +
              (uploadError.response?.data?.error || uploadError.message)
          );
        }
      } else {
        throw new Error('Failed to start conversion');
      }
    } catch (error: any) {
      console.error('Conversion error:', error.response?.data || error);
      setStatus('error');
      setErrorMessage(
        'Failed to initiate conversion: ' +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const resetForm = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setConversionId('');
    setDownloadUrl('');
  };

  return (
    <Card className='overflow-hidden'>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className='border-b px-6 py-3'>
          <TabsList className='grid w-full grid-cols-3'>
            {fileFormats.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {fileFormats.map((category) => (
          <TabsContent key={category.id} value={category.id} className='p-0'>
            <CardContent className='p-6'>
              <div className='mb-4'>
                <div
                  className={cn(
                    'flex flex-col items-center justify-center space-y-2 text-center border-2 border-dashed rounded-lg p-6',
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300',
                    status === 'success' ? 'border-green-300 bg-green-50' : ''
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {status === 'success' ? (
                    <CheckCircle className='h-8 w-8 text-green-500' />
                  ) : (
                    <Upload className='h-8 w-8 text-gray-400' />
                  )}
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-gray-700'>
                      {file
                        ? file.name
                        : 'Drag and drop your file here or click to browse'}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Supports various file formats up to 50MB
                    </p>
                  </div>
                  <input
                    type='file'
                    id='file-upload'
                    className='hidden'
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor='file-upload'
                    className='mt-2 cursor-pointer rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100'
                  >
                    Select File
                  </label>
                </div>
              </div>

              <div className='mb-6 space-y-3'>
                <label className='text-sm font-medium'>Convert to</label>
                <div className='flex flex-wrap gap-2'>
                  {category.formats.map((format) => (
                    <Button
                      key={format}
                      type='button'
                      variant={convertTo === format ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setConvertTo(format)}
                    >
                      {format}
                    </Button>
                  ))}
                </div>
              </div>

              {status === 'converting' && (
                <div className='mb-6 space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Converting...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className='h-2' />
                </div>
              )}

              {status === 'error' && (
                <div className='mb-6 flex items-center rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
                  <AlertCircle className='mr-2 h-5 w-5' />
                  <span>
                    {errorMessage || 'An error occurred. Please try again.'}
                  </span>
                </div>
              )}

              {status === 'success' && downloadUrl ? (
                <div className='mb-6 space-y-4'>
                  <div className='flex items-center rounded-md bg-green-50 p-3 text-sm text-green-600'>
                    <CheckCircle className='mr-2 h-5 w-5' />
                    <span>Conversion completed successfully!</span>
                  </div>
                  <Button
                    className='w-full'
                    size='lg'
                    variant='default'
                    onClick={() => {
                      const extension = convertTo.toLowerCase();
                      const fileName = file
                        ? `${file.name.split('.')[0]}.${extension}`
                        : `converted.${extension}`;

                      // Create an anchor element and trigger download
                      const a = document.createElement('a');
                      a.href = downloadUrl;
                      a.download = fileName;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Download Converted File
                  </Button>
                  <Button
                    className='w-full'
                    size='lg'
                    variant='outline'
                    onClick={resetForm}
                  >
                    Convert Another File
                  </Button>
                </div>
              ) : (
                <Button
                  className='w-full'
                  size='lg'
                  onClick={handleConvert}
                  disabled={!file || status === 'converting'}
                >
                  {status === 'converting' ? 'Converting...' : 'Convert Now'}
                </Button>
              )}
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
