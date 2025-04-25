import { useState } from "react";
import "./App.css";
import { FiMenu, FiX } from "react-icons/fi";
import FileUpload from "./components/FileUpload";
import ImageGrid from "./components/ImageGrid";
import ImageViewer from "./components/ImageViewer";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileAccepted = async (file) => {
    setIsLoading(true);
    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create dummy images with varied sizes and rotations
    const dummyImages = [
      {
        id: "image-1",
        url: "https://picsum.photos/800/600?random=1",
        pageNumber: 1,
        rotation: 0,
        filename: "document_001.tiff",
      },
      {
        id: "image-2",
        url: "https://picsum.photos/600/800?random=2",
        pageNumber: 2,
        rotation: 90,
        filename: "document_002.tiff",
      },
      {
        id: "image-3",
        url: "https://picsum.photos/800/800?random=3",
        pageNumber: 3,
        rotation: 180,
        filename: "document_003.tiff",
      },
      {
        id: "image-4",
        url: "https://picsum.photos/600/600?random=4",
        pageNumber: 4,
        rotation: 270,
        filename: "document_004.tiff",
      },
      {
        id: "image-5",
        url: "https://picsum.photos/800/600?random=5",
        pageNumber: 5,
        rotation: 0,
        filename: "document_005.tiff",
      },
      {
        id: "image-6",
        url: "https://picsum.photos/600/800?random=6",
        pageNumber: 6,
        rotation: 90,
        filename: "document_006.tiff",
      },
      {
        id: "image-7",
        url: "https://picsum.photos/800/800?random=7",
        pageNumber: 7,
        rotation: 180,
        filename: "document_007.tiff",
      },
      {
        id: "image-8",
        url: "https://picsum.photos/600/600?random=8",
        pageNumber: 8,
        rotation: 270,
        filename: "document_008.tiff",
      },
    ];

    setImages(dummyImages);
    setIsLoading(false);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleRotate = (id) => {
    setImages(
      images.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        className="fixed left-4 top-4 z-50 rounded-md bg-white p-2 shadow-md lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4">
          <h2 className="mb-4 text-xl font-semibold">TIFF Viewer</h2>
          <div className="space-y-2">
            <div className="cursor-pointer rounded-md p-2 hover:bg-gray-100">
              File Information
            </div>
            <div className="cursor-pointer rounded-md p-2 hover:bg-gray-100">
              Quick Actions
            </div>
            <div className="cursor-pointer rounded-md p-2 hover:bg-gray-100">
              Change History
            </div>
            <div className="cursor-pointer rounded-md p-2 hover:bg-gray-100">
              Settings
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h1 className="mb-6 text-2xl font-bold">TIFF Image Viewer</h1>

            {images.length === 0 ? (
              <FileUpload onFileAccepted={handleFileAccepted} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {images.length} Pages
                  </h2>
                  <button
                    onClick={() => setImages([])}
                    className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Clear
                  </button>
                </div>
                <ImageGrid
                  images={images}
                  onImagesChange={setImages}
                  onImageClick={handleImageClick}
                />
              </div>
            )}

            {isLoading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="rounded-lg bg-white p-4 shadow-lg">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Processing TIFF file...</p>
                </div>
              </div>
            )}

            {selectedImage && (
              <ImageViewer
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
                onRotate={handleRotate}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
