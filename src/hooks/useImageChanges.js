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

  // Add a new change to the changes array
  const addChange = useCallback((changeType, payload) => {
    const change = {
      id: Date.now(), // unique ID for the change
      type: changeType,
      payload,
      timestamp: new Date().toISOString(),
    };

    setChanges((prevChanges) => [...prevChanges, change]);
    setHasUnsavedChanges(true);
  }, []);

  // Record rotation change
  const recordRotation = useCallback(
    (imageId, newRotation) => {
      addChange(CHANGE_TYPES.ROTATE, {
        imageId,
        rotation: newRotation,
      });
    },
    [addChange],
  );

  // Record deletion
  const recordDeletion = useCallback(
    (imageId) => {
      addChange(CHANGE_TYPES.DELETE, {
        imageId,
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

  // Save changes to backend
  const saveChanges = useCallback(async () => {
    try {
      // Format changes for the backend
      const changeSet = {
        changes,
        timestamp: new Date().toISOString(),
      };

      console.log(changeSet);

      // Clear changes after successful save
      setChanges([]);
      setHasUnsavedChanges(false);

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
