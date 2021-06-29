import { useEffect, useRef, useState } from "react";

export const useStateRef = (value) => {
  const [state, setState] = useState(value);
  const ref = useRef(state);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return [state, setState, ref];
};
