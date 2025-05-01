import { FiDownload, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const DownloadBox = ({ downloadUrl, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:bottom-4 sm:left-auto sm:right-4 sm:w-auto sm:p-0"
      >
        <div className="relative flex flex-col gap-3 rounded-lg bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:gap-4 sm:p-4">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 sm:static sm:p-1.5"
          >
            <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="flex-1 pt-6 sm:pt-0">
            <h3 className="text-sm font-semibold text-gray-900">
              Your edited TIFF file is ready!
            </h3>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Click the download button to save your changes.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <a
              href={downloadUrl}
              download
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex-none sm:text-sm sm:px-4"
            >
              <FiDownload className="h-3 w-3 sm:h-4 sm:w-4" />
              Download
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DownloadBox; 