import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FiX, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { baseUrl } from "../constants";

const ImageViewer = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative m-4 flex h-full max-h-[90vh] w-full max-w-7xl items-center justify-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        >
          <FiX className="h-6 w-6" />
        </button>

        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-2">
                <button
                  onClick={() => zoomOut()}
                  className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
                >
                  <FiZoomOut className="h-6 w-6" />
                </button>
                <button
                  onClick={() => zoomIn()}
                  className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
                >
                  <FiZoomIn className="h-6 w-6" />
                </button>
              </div>

              <TransformComponent>
                <img
                  src={`${baseUrl}/${image.url}`}
                  alt={`Page ${image.pageNumber}`}
                  className="max-h-[90vh] max-w-full object-contain"
                  style={{ transform: `rotate(${image.rotation}deg)` }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default ImageViewer;
