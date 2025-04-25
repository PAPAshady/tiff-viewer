import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiRotateCw, FiTrash2 } from "react-icons/fi";

const SortableImage = ({ image, onRotate, onDelete, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(image);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      <img
        src={image.url}
        alt={`Page ${image.pageNumber}`}
        className="w-full h-48 object-cover"
        style={{ transform: `rotate(${image.rotation}deg)` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
          <p className="text-white text-sm">Page {image.pageNumber}</p>
          <p className="text-white text-xs opacity-75">{image.filename}</p>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRotate(image.id);
          }}
          className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <FiRotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ImageGrid = ({ images, onImagesChange, onImageClick }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      onImagesChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const handleRotate = (id) => {
    onImagesChange(
      images.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  };

  const handleDelete = (id) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={verticalListSortingStrategy}
        >
          {images.map((image) => (
            <SortableImage
              key={image.id}
              image={image}
              onRotate={handleRotate}
              onDelete={handleDelete}
              onClick={onImageClick}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default ImageGrid; 