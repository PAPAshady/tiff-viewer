import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

const FileUpload = ({ onFileAccepted }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles?.[0];
      file && onFileAccepted(file);
    },
    [onFileAccepted],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/tiff": [".tif", ".tiff"],
      },
      maxFiles: 1,
      maxSize: 100 * 1024 * 1024, // 100MB
      multiple: false,
    });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500">
          {isDragActive
            ? "Drop the TIFF file here"
            : "Drag and drop your TIFF file here"}
        </p>
        <p className="mt-2 text-sm text-gray-400">or click to browse</p>
      </div>
      {fileRejections[0]?.errors[0]?.message && (
        <p className="mt-2 text-center text-sm text-red-500">
          {fileRejections[0].errors[0].code === "file-too-large"
            ? "File must be less than 100MB"
            : "Invalid file type. Please upload a TIFF file"}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
