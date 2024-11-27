import { useState, useEffect } from "react";

const useKeyPress = (targeKeyCode: number) => {
  const [keyPressed, setKeyPressed] = useState(false);
  const [event, setEvent] = useState();

  const keyDownHandler = (e: any) => {
    setEvent(e);
    const { keyCode } = e;
    if (keyCode === targeKeyCode) {
      setKeyPressed(true);
    }
  };
  const keyUpHandler = (e: any) => {
    setEvent(e);
    const { keyCode } = e;
    if (keyCode === targeKeyCode) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, []);

  return { event: event as any, keyPressed };
};

export default useKeyPress;
