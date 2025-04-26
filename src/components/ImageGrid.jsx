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
  const [isDragging, setIsDragging] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.id,
      animateLayoutChanges: () => false,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e) => {
    if (!isDragging) {
      e.stopPropagation();
      onClick(image);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-md"
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <img
        src={image.url}
        alt={`Page ${image.pageNumber}`}
        className="h-48 w-full object-cover"
        style={{ transform: `rotate(${image.rotation}deg)` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-200 group-hover:bg-opacity-30">
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
          <p className="text-sm text-white">Page {image.pageNumber}</p>
          <p className="text-xs text-white opacity-75">{image.filename}</p>
        </div>
      </div>
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRotate(image.id);
          }}
          className="rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
        >
          <FiRotateCw className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          className="rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ImageGrid = ({ images, onImagesChange, onImageClick }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Add a small drag distance threshold
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img,
      ),
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
