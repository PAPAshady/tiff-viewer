import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiRotateCw, FiTrash2 } from "react-icons/fi";

// Separate the image content into its own component for reuse
const ImageContent = ({ image, onRotate, onDelete, showButtons = true }) => (
  <>
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
    {showButtons && (
      <div className="absolute right-2 top-2 flex gap-2 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
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
    )}
  </>
);

const SortableImage = ({ image, onRotate, onDelete, onClick }) => {
  const [isDragging, setIsDragging] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isDraggingFromDnd,
  } = useSortable({
    id: image.id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isDraggingFromDnd ? 0.3 : 1,
    zIndex: isDragging || isDraggingFromDnd ? 1 : 0,
  };

  const handleClick = (e) => {
    if (!isDragging && !isDraggingFromDnd) {
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
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ImageContent image={image} onRotate={onRotate} onDelete={onDelete} />
    </div>
  );
};

const ImageGrid = ({
  images,
  onImagesChange,
  onImageClick,
  onRotate,
  onDelete,
  onReorder,
}) => {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active && over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const reorderedImages = arrayMove(images, oldIndex, newIndex);
      onImagesChange(reorderedImages);
      onReorder(oldIndex, newIndex, active.id);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      modifiers={[]}
    >
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <SortableImage
              key={image.id}
              image={image}
              onRotate={onRotate}
              onDelete={onDelete}
              onClick={onImageClick}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="opacity-50">
            <ImageContent
              image={images.find((img) => img.id === activeId)}
              onRotate={onRotate}
              onDelete={onDelete}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ImageGrid;
