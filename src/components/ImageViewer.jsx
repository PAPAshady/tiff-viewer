import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FiX, FiZoomIn, FiZoomOut, FiRotateCw } from "react-icons/fi";

const ImageViewer = ({ image, onClose, onRotate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => onRotate(image.id)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <FiRotateCw className="w-6 h-6" />
          </button>
        </div>

        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
                <button
                  onClick={() => zoomOut()}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <FiZoomOut className="w-6 h-6" />
                </button>
                <button
                  onClick={() => zoomIn()}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <FiZoomIn className="w-6 h-6" />
                </button>
              </div>

              <TransformComponent>
                <img
                  src={image.url}
                  alt={`Page ${image.pageNumber}`}
                  className="max-w-full max-h-[90vh] object-contain"
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