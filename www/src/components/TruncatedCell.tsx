import useTruncateText from "@/hooks/useTruncateText";
import { Button, TableCell, TableCellProps } from "@mui/material";

interface TruncatedCellProps extends TableCellProps {
  text: string;
  maxLength: number;
}

const TruncatedCell = ({ text, maxLength, ...props }: TruncatedCellProps) => {
  const { truncatedText, isTruncated, toggleTruncate } = useTruncateText(
    text,
    maxLength
  );

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the event from propagating to the row
    toggleTruncate();
  };

  return (
    <TableCell {...props}>
      {truncatedText}
      {text.length > maxLength && (
        <Button
          onClick={handleButtonClick}
          size="small"
          sx={{ fontSize: 12 }}
          variant="text"
        >
          {isTruncated ? "Show More" : "Show Less"}
        </Button>
      )}
    </TableCell>
  );
};

export default TruncatedCell;
