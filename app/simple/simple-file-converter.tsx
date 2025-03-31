"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle, Upload } from "lucide-react"

export function SimpleFileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [convertTo, setConvertTo] = useState("pdf")
  const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus("idle")
      setErrorMessage("")
    }
  }

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setStatus("error")
      setErrorMessage("Please select a file first")
      return
    }

    setStatus("converting")

    // Simulate conversion process
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage("An error occurred during conversion")
    }
  }

  return (
    <form onSubmit={handleConvert} className="space-y-6">
      <div className="rounded-md border border-dashed border-gray-300 p-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              {file ? file.name : "Drag and drop your file here or click to browse"}
            </p>
            <p className="text-xs text-gray-500">Supports various file formats up to 10MB</p>
          </div>
          <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
          <label
            htmlFor="file-upload"
            className="mt-2 cursor-pointer rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            Select File
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="convert-to" className="block text-sm font-medium text-gray-700">
          Convert to
        </label>
        <select
          id="convert-to"
          value={convertTo}
          onChange={(e) => setConvertTo(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
          <option value="jpg">JPG</option>
          <option value="png">PNG</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "converting"}
        className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
      >
        {status === "converting" ? "Converting..." : "Convert Now"}
      </button>

      {status === "success" && (
        <div className="flex items-center rounded-md bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle className="mr-2 h-5 w-5" />
          <span>Conversion successful! Your file is ready to download.</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center rounded-md bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>{errorMessage || "An error occurred. Please try again."}</span>
        </div>
      )}
    </form>
  )
}

