import React, { useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { Box, Typography, Avatar } from "@mui/material";
import Image from "next/image";

interface Props {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Accept;
  previousLogoUrl?: string | null;
}

const CustomDropzone = ({
  onDrop,
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
  previousLogoUrl = null,
}: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: accept,
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #ccc",
        borderRadius: "4px",
        textAlign: "center",
        padding: "20px",
        cursor: "pointer",
        position: "relative",
        height: "200px", // Set a fixed height for the container
        width: "200px",  // Set a fixed width for the container
        display: "flex",
        justifyContent: "center",
        alignItems: previousLogoUrl || preview ? "flex-end" : "center",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography variant="body1">Drop the files here...</Typography>
      ) : (
        <Typography variant="body1">
          Drag & drop logo here, or click to select file
        </Typography>
      )}
      {(previousLogoUrl || preview) && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={
              preview
                ? preview
                : previousLogoUrl
                ? "https://sfds.usualsmart.com/" + previousLogoUrl
                : preview ?? ""
            }
            alt="Logo preview"
            layout="fill"
            objectFit="contain"
          />
        </Box>
      )}
    </Box>
  );
};

export default CustomDropzone;
