import { useState } from "react";

/**
 * 
 * @param text - text to truncate
 * @param maxLength - maximum length of the text
 * @returns - truncated text, isTruncated, toggleTruncate
 */

const useTruncateText = (text: string, maxLength: number) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => setIsTruncated(!isTruncated);

  const truncatedText = isTruncated
    ? text.slice(0, maxLength) + (text.length > maxLength ? "...." : "")
    : text;

  return { truncatedText, isTruncated, toggleTruncate };
};

export default useTruncateText;
