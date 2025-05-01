import { useState, useCallback } from "react";
import { baseUrl } from "../constants";

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

export default usePositionTracking;
