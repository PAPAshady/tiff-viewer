import { useState, useCallback } from "react";
import { apiUrl, baseUrl } from "../constants";

// Define change types as constants
export const CHANGE_TYPES = {
  ROTATE: "ROTATE",
  DELETE: "DELETE",
  REORDER: "REORDER",
};

// Custom hook for tracking image positions
const usePositionTracking = () => {
  const [originalPositions, setOriginalPositions] = useState({});
  const [currentPositions, setCurrentPositions] = useState({});

  const updatePosition = useCallback((imageId, newPosition) => {
    setCurrentPositions((prev) => ({
      ...prev,
      [imageId]: newPosition,
    }));
  }, []);

  const storeOriginalPosition = useCallback((imageId, position) => {
    setOriginalPositions((prev) => ({
      ...prev,
      [imageId]: position,
    }));
  }, []);

  const handleDeletion = useCallback((deletedPosition) => {
    if (deletedPosition !== undefined) {
      setCurrentPositions((prev) => {
        const newPositions = { ...prev };
        Object.entries(newPositions).forEach(([id, position]) => {
          if (position > deletedPosition) {
            newPositions[id] = position - 1;
          }
        });
        return newPositions;
      });
    }
  }, []);

  const reset = useCallback(() => {
    setOriginalPositions({});
    setCurrentPositions({});
  }, []);

  return {
    originalPositions,
    currentPositions,
    updatePosition,
    storeOriginalPosition,
    handleDeletion,
    reset,
  };
};

export const useImageChanges = (images) => {
  // Track all changes in order
  const [changes, setChanges] = useState([]);
  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Use the position tracking hook
  const {
    originalPositions,
    currentPositions,
    updatePosition,
    storeOriginalPosition,
    handleDeletion,
    reset: resetPositions,
  } = usePositionTracking();

  // Helper function to handle delete changes
  const handleDeleteChange = (prevChanges, payload) => {
    handleDeletion(currentPositions[payload.imageId]);
    // Remove any previous changes for this image
    const filteredChanges = prevChanges.filter((change) => {
      if (change.payload.imageId === payload.imageId) {
        return false; // Remove changes for the deleted image
      }
      return true;
    });

    return [
      ...filteredChanges,
      {
        id: Date.now(),
        type: CHANGE_TYPES.DELETE,
        payload,
        timestamp: new Date().toISOString(),
      },
    ];
  };

  // Helper function to handle rotation changes
  const handleRotationChange = (prevChanges, payload) => {
    // If rotation is 0 or 360, remove any rotation changes for this image
    if (payload.rotation === 0 || payload.rotation === 360) {
      return prevChanges.filter(
        (change) =>
          !(
            change.type === CHANGE_TYPES.ROTATE &&
            change.payload.imageId === payload.imageId
          ),
      );
    }

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
      return updatedChanges;
    }

    return [
      ...prevChanges,
      {
        id: Date.now(),
        type: CHANGE_TYPES.ROTATE,
        payload,
        timestamp: new Date().toISOString(),
      },
    ];
  };

  // Helper function to handle reorder changes
  const handleReorderChange = (prevChanges, payload) => {
    if (!originalPositions[payload.imageId]) {
      storeOriginalPosition(payload.imageId, payload.oldIndex);
    }
    updatePosition(payload.imageId, payload.newIndex);

    // Get the original position for this image
    const originalOldIndex =
      originalPositions[payload.imageId] ?? payload.oldIndex;

    // Remove any previous reorder changes for this image
    const changesWithoutPreviousReorder = prevChanges.filter(
      (change) =>
        !(
          change.type === CHANGE_TYPES.REORDER &&
          change.payload.imageId === payload.imageId
        ),
    );

    return [
      ...changesWithoutPreviousReorder,
      {
        id: Date.now(),
        type: CHANGE_TYPES.REORDER,
        payload: {
          ...payload,
          oldIndex: originalOldIndex,
          // Include information about affected positions
          affectedImages: Object.entries(currentPositions)
            .filter(([id]) => id !== payload.imageId)
            .map(([id, position]) => ({
              imageId: id,
              originalPosition: originalPositions[id],
              currentPosition: position,
            })),
        },
        timestamp: new Date().toISOString(),
      },
    ];
  };

  // Add or update a change in the changes array
  const addChange = useCallback(
    (changeType, payload) => {
      setChanges((prevChanges) => {
        let newChanges;

        switch (changeType) {
          case CHANGE_TYPES.DELETE:
            newChanges = handleDeleteChange(prevChanges, payload);
            break;
          case CHANGE_TYPES.ROTATE:
            newChanges = handleRotationChange(prevChanges, payload);
            break;
          case CHANGE_TYPES.REORDER:
            newChanges = handleReorderChange(prevChanges, payload);
            break;
          default:
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
    (imageId, imageUrl) => {
      addChange(CHANGE_TYPES.DELETE, {
        imageId,
        imageUrl,
      });
    },
    [addChange],
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

  // Helper function to process rotation changes
  const processRotationChanges = (rotationChanges) => {
    if (!rotationChanges?.length) return null;

    return rotationChanges.reduce((acc, change) => {
      const imageUrl = images.find(
        (img) => img.id === change.payload.imageId,
      )?.url;
      if (imageUrl) {
        acc[imageUrl] = change.payload.rotation;
      }
      return acc;
    }, {});
  };

  // Helper function to process deletion changes
  const processDeletionChanges = (deletionChanges) => {
    if (!deletionChanges?.length) return null;

    return deletionChanges.reduce((acc, change) => {
      const imageUrl = change.payload.imageUrl;
      if (imageUrl) {
        acc[imageUrl] = 1;
      }
      return acc;
    }, {});
  };

  // Helper function to process reorder changes
  const processReorderChanges = (reorderChanges) => {
    if (!reorderChanges?.length) return null;

    // Create a map of current positions for each image
    const positionMap = new Map();
    images.forEach((img, index) => {
      positionMap.set(img.id, index);
    });

    // Sort images based on their current positions
    const orderedFiles = [...images]
      .sort((a, b) => positionMap.get(a.id) - positionMap.get(b.id))
      .map(img => img.url);

    return {
      file: orderedFiles
    };
  };

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

      // Process each type of change
      const rotationData = processRotationChanges(
        groupedChanges[CHANGE_TYPES.ROTATE],
      );
      const deletionData = processDeletionChanges(
        groupedChanges[CHANGE_TYPES.DELETE],
      );
      const reorderData = processReorderChanges(
        groupedChanges[CHANGE_TYPES.REORDER],
      );

      // Always get the current order of files, even if no reorder changes
      const currentOrderData = {
        file: images.map(img => img.url)
      };

      if (rotationData) {
        try {
        const res = await fetch(`${apiUrl}/rotate/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rotationData),
          credentials: "include",
        });
        } catch (error) {
          console.error("Error saving rotation changes:", error);
        }
      }

      if (deletionData) {
        try {
        const res = await fetch(`${apiUrl}/delete/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deletionData),
          credentials: "include",
        });
        } catch (error) {
          console.error("Error saving deletion changes:", error);
        }
      }

      // Always call reorder API if there are any changes in order to receive the downloadable link
      if (changes.length > 0) {
        try {
          const res = await fetch(`${apiUrl}/reorder/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(currentOrderData),
            credentials: 'include'
          });
          const reorderRes = await res.json();
          console.log("Reorder response:", reorderRes);
          
          // Clear all tracking states after successful save
          setChanges([]);
          setHasUnsavedChanges(false);
          resetPositions();

          // Return the download URL from the response
          return {
            downloadUrl: reorderRes.data
          };
        } catch (error) {
          console.error("Error saving reorder changes:", error);
          throw error;
        }
      }

      // Clear all tracking states after successful save
      setChanges([]);
      setHasUnsavedChanges(false);
      resetPositions();

      return true;
    } catch (error) {
      console.error("Error saving changes:", error);
      throw error;
    }
  }, [changes, images, resetPositions]);

  // Discard all unsaved changes
  const discardChanges = useCallback(() => {
    setChanges([]);
    setHasUnsavedChanges(false);
    resetPositions();
  }, [resetPositions]);

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
