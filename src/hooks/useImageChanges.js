import { useState, useCallback } from "react";

// Define change types as constants
export const CHANGE_TYPES = {
  ROTATE: "ROTATE",
  DELETE: "DELETE",
  REORDER: "REORDER",
};

export const useImageChanges = () => {
  // Track all changes in order
  const [changes, setChanges] = useState([]);
  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // Track original positions of images before any reordering
  const [originalPositions, setOriginalPositions] = useState({});
  // Track current positions to calculate final positions
  const [currentPositions, setCurrentPositions] = useState({});

  // Add or update a change in the changes array
  const addChange = useCallback(
    (changeType, payload) => {
      setChanges((prevChanges) => {
        let newChanges;

        // For DELETE changes, remove any previous changes for this image
        if (changeType === CHANGE_TYPES.DELETE) {
          // Also remove any reorder changes that might affect this image
          const filteredChanges = prevChanges.filter((change) => {
            if (change.payload.imageId === payload.imageId) {
              return false; // Remove changes for the deleted image
            }
            return true;
          });

          newChanges = [
            ...filteredChanges,
            {
              id: Date.now(),
              type: changeType,
              payload,
              timestamp: new Date().toISOString(),
            },
          ];
        }
        // For ROTATE changes, update or add the rotation
        else if (changeType === CHANGE_TYPES.ROTATE) {
          // If rotation is 0 or 360, remove any rotation changes for this image
          if (payload.rotation === 0 || payload.rotation === 360) {
            newChanges = prevChanges.filter(
              (change) =>
                !(
                  change.type === CHANGE_TYPES.ROTATE &&
                  change.payload.imageId === payload.imageId
                ),
            );
          } else {
            const existingRotationIndex = prevChanges.findIndex(
              (change) =>
                change.type === CHANGE_TYPES.ROTATE &&
                change.payload.imageId === payload.imageId,
            );

            if (existingRotationIndex !== -1) {
              // Update existing rotation
              const updatedChanges = [...prevChanges];
              updatedChanges[existingRotationIndex] = {
                ...updatedChanges[existingRotationIndex],
                payload: {
                  ...payload,
                  timestamp: new Date().toISOString(),
                },
              };
              newChanges = updatedChanges;
            } else {
              newChanges = [
                ...prevChanges,
                {
                  id: Date.now(),
                  type: changeType,
                  payload,
                  timestamp: new Date().toISOString(),
                },
              ];
            }
          }
        }
        // For REORDER changes, track both original and current positions
        else if (changeType === CHANGE_TYPES.REORDER) {
          // Store original position if not already stored
          const newOriginalPositions = { ...originalPositions };
          if (!newOriginalPositions[payload.imageId]) {
            newOriginalPositions[payload.imageId] = payload.oldIndex;
            setOriginalPositions(newOriginalPositions);
          }

          // Update current position
          const newCurrentPositions = {
            ...currentPositions,
            [payload.imageId]: payload.newIndex,
          };
          setCurrentPositions(newCurrentPositions);

          // Get the original position for this image
          const originalOldIndex =
            newOriginalPositions[payload.imageId] ?? payload.oldIndex;

          // Remove any previous reorder changes for this image
          const changesWithoutPreviousReorder = prevChanges.filter(
            (change) =>
              !(
                change.type === CHANGE_TYPES.REORDER &&
                change.payload.imageId === payload.imageId
              ),
          );

          newChanges = [
            ...changesWithoutPreviousReorder,
            {
              id: Date.now(),
              type: changeType,
              payload: {
                ...payload,
                oldIndex: originalOldIndex,
                // Include information about affected positions
                affectedImages: Object.entries(newCurrentPositions)
                  .filter(([id]) => id !== payload.imageId)
                  .map(([id, position]) => ({
                    imageId: id,
                    originalPosition: newOriginalPositions[id],
                    currentPosition: position,
                  })),
              },
              timestamp: new Date().toISOString(),
            },
          ];
        }
        // Default case
        else {
          newChanges = [
            ...prevChanges,
            {
              id: Date.now(),
              type: changeType,
              payload,
              timestamp: new Date().toISOString(),
            },
          ];
        }

        setHasUnsavedChanges(newChanges?.length > 0);
        return newChanges;
      });
    },
    [originalPositions, currentPositions],
  );

  // Record rotation change
  const recordRotation = useCallback(
    (imageId, newRotation) => {
      // Normalize rotation to be between 0 and 360
      const normalizedRotation = ((newRotation % 360) + 360) % 360;
      addChange(CHANGE_TYPES.ROTATE, {
        imageId,
        rotation: normalizedRotation,
      });
    },
    [addChange],
  );

  // Record deletion
  const recordDeletion = useCallback(
    (imageId) => {
      // When deleting an image, we need to update positions of other images
      const deletedPosition = currentPositions[imageId];
      if (deletedPosition !== undefined) {
        // Update positions of images that come after the deleted image
        Object.entries(currentPositions).forEach(([id, position]) => {
          if (position > deletedPosition) {
            setCurrentPositions((prev) => ({
              ...prev,
              [id]: position - 1,
            }));
          }
        });
      }

      addChange(CHANGE_TYPES.DELETE, {
        imageId,
      });
    },
    [addChange, currentPositions],
  );

  // Record reordering
  const recordReorder = useCallback(
    (oldIndex, newIndex, imageId) => {
      addChange(CHANGE_TYPES.REORDER, {
        imageId,
        oldIndex,
        newIndex,
      });
    },
    [addChange],
  );

  // Save changes to backend
  const saveChanges = useCallback(async () => {
    try {
      // Group changes by type
      const groupedChanges = changes.reduce((acc, change) => {
        if (!acc[change.type]) {
          acc[change.type] = [];
        }
        acc[change.type].push(change);
        return acc;
      }, {});

      console.log(groupedChanges);

      // Clear all tracking states after successful save
      setChanges([]);
      setHasUnsavedChanges(false);
      setOriginalPositions({});
      setCurrentPositions({});

      return true;
    } catch (error) {
      console.error("Error saving changes:", error);
      throw error;
    }
  }, [changes]);

  // Discard all unsaved changes
  const discardChanges = useCallback(() => {
    setChanges([]);
    setHasUnsavedChanges(false);
    setOriginalPositions({});
    setCurrentPositions({});
  }, []);

  return {
    changes,
    hasUnsavedChanges,
    recordRotation,
    recordDeletion,
    recordReorder,
    saveChanges,
    discardChanges,
  };
};
