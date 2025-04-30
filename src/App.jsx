import { useState } from "react";
import "./App.css";
import { FiMenu, FiX, FiSave } from "react-icons/fi";
import FileUpload from "./components/FileUpload";
import ImageGrid from "./components/ImageGrid";
import ImageViewer from "./components/ImageViewer";
import useMediaQuery from "./hooks/useMediaQuery";
import { useImageChanges } from "./hooks/useImageChanges";
import { Toast } from "./components/Toast";
import { apiUrl } from "./constants";

function App() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const {
    hasUnsavedChanges,
    recordRotation,
    recordDeletion,
    recordReorder,
    saveChanges,
    discardChanges,
  } = useImageChanges(images);

  const handleFileAccepted = async (file) => {
    setIsLoading(true);
    try {
      const tiffFile = new FormData();
      tiffFile.append("file", file);

      console.time("load-file");
      const res = await fetch(`${apiUrl}/upload/`, {
        method: "POST",
        body: tiffFile,
        credentials: "include",
      });
      console.timeEnd("load-file");
      const tiffData = await res.json();
      const tiffImages = tiffData?.data || [];

      // Transform the URLs into our image objects - this structure will match what we'll get from the backend
      const newImages = tiffImages.map((url, index) => ({
        id: `image-${index + 1}`,
        url,
        pageNumber: index + 1,
        rotation: 0,
        filename: file.name,
      }));

      setImages(newImages);
      setToastMessage({
        type: "success",
        text: "File uploaded successfully!",
      });
    } catch (error) {
      setToastMessage({
        type: "error",
        text: "Failed to upload file. Please try again.",
      });
      console.log("error uploading file : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleRotate = (id) => {
    const image = images.find((img) => img.id === id);
    const newRotation = (image.rotation + 90) % 360;

    setImages(
      images.map((img) =>
        img.id === id ? { ...img, rotation: newRotation } : img,
      ),
    );

    recordRotation(id, newRotation);
  };

  const handleDelete = (id) => {
    const imageToDelete = images.find((img) => img.id === id);
    if (imageToDelete) {
      setImages(images.filter((img) => img.id !== id));
      recordDeletion(id, imageToDelete.url);
    }
  };

  const handleReorder = (oldIndex, newIndex, imageId) => {
    // First record the change
    recordReorder(oldIndex, newIndex, imageId);

    // Then update the UI
    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(oldIndex, 1);
    reorderedImages.splice(newIndex, 0, movedImage);
    setImages(reorderedImages);

    // Calculate position changes for all affected images
    const affectedRange =
      oldIndex < newIndex
        ? { start: oldIndex, end: newIndex }
        : { start: newIndex, end: oldIndex };

    // Record changes for all affected images
    images.forEach((img, currentIndex) => {
      if (
        currentIndex >= affectedRange.start &&
        currentIndex <= affectedRange.end &&
        img.id !== imageId
      ) {
        let newPosition;
        if (oldIndex < newIndex) {
          // Moving forward: images between oldIndex and newIndex shift back by 1
          if (currentIndex > oldIndex && currentIndex <= newIndex) {
            newPosition = currentIndex - 1;
            recordReorder(currentIndex, newPosition, img.id);
          }
        } else {
          // Moving backward: images between newIndex and oldIndex shift forward by 1
          if (currentIndex >= newIndex && currentIndex < oldIndex) {
            newPosition = currentIndex + 1;
            recordReorder(currentIndex, newPosition, img.id);
          }
        }
      }
    });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await saveChanges();
      setToastMessage({
        type: "success",
        text: "All changes saved successfully!",
      });
    } catch (error) {
      // Extract the specific change type from the error message if available
      const errorMatch = error.message.match(
        /Failed to save (ROTATE|DELETE|REORDER) changes/,
      );
      const changeType = errorMatch ? errorMatch[1].toLowerCase() : "changes";

      const errorMessages = {
        rotate: "Failed to save rotation changes",
        delete: "Failed to save deletion changes",
        reorder: "Failed to save reordering changes",
        changes: "Failed to save changes",
      };

      setToastMessage({
        type: "error",
        text: `${errorMessages[changeType]}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
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
        className={`fixed left-0 top-0 z-10 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className={`p-4 ${!isDesktop ? "pt-16" : ""}`}>
          <h2 className="mb-4 text-xl font-semibold">TIFF Viewer</h2>

          {/* Add Save Changes button when there are unsaved changes */}
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveChanges}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              disabled={isLoading}
            >
              <FiSave className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          )}

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
        className={`relative min-h-screen transition-all duration-300 ease-in-out ${
          isDesktop ? "lg:ml-64" : ""
        } `}
      >
        <div
          className={`absolute inset-0 size-full transition-all duration-300 ease-in-out ${isSidebarOpen && !isDesktop ? "z-[5] bg-black/30 backdrop-blur-sm" : "z-[-1]"}`}
        ></div>
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">TIFF Image Viewer</h1>
              {hasUnsavedChanges && (
                <span className="text-sm text-yellow-600">
                  You have unsaved changes
                </span>
              )}
            </div>

            {images.length === 0 ? (
              <FileUpload onFileAccepted={handleFileAccepted} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {images.length} Pages
                  </h2>
                  <button
                    onClick={() => {
                      setImages([]);
                      discardChanges();
                    }}
                    className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Clear
                  </button>
                </div>
                <ImageGrid
                  images={images}
                  onImagesChange={setImages}
                  onImageClick={handleImageClick}
                  onRotate={handleRotate}
                  onDelete={handleDelete}
                  onReorder={handleReorder}
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

      {/* Toast notification */}
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

export default App;
