import { useEffect, useRef, useState } from "react";

export const useReducerRef = (value) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, ref];
};
