"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, Maximize, X } from "lucide-react"

interface PDFViewerProps {
  bookTitle: string
  onClose: () => void
}

export default function PDFViewer({ bookTitle, onClose }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const totalPages = 250 // Mock total pages

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-white" : "relative"}`}>
      <Card className={`${isFullscreen ? "h-full rounded-none border-0" : ""}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">{bookTitle}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className={`${isFullscreen ? "h-full pb-16" : "h-96"} overflow-auto`}>
          <div
            className="bg-white shadow-lg mx-auto border"
            style={{
              width: `${zoom}%`,
              minWidth: "600px",
              aspectRatio: "8.5/11",
            }}
          >
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">PDF Content</p>
                <p>
                  Page {currentPage} of {totalPages}
                </p>
                <p className="text-sm mt-4">
                  This is a mock PDF viewer. In a real implementation,
                  <br />
                  you would integrate with a PDF library like PDF.js
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="flex items-center justify-between p-4 border-t">
          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Page</span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(Math.max(1, Math.min(Number.parseInt(e.target.value) || 1, totalPages)))}
              className="w-16 px-2 py-1 text-center border rounded"
              min="1"
              max={totalPages}
            />
            <span className="text-sm">of {totalPages}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
