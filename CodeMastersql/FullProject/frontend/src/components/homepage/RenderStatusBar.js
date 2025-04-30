
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RenderStatusBar({
  // statuses,
  // user,
  // handleOpenStatus,
  handleDeleteStatus,
  handleEditStatus
}) {
  const BASE_URL = "http://localhost:9090";

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          p: 2,
          borderRadius: 2,
          maxWidth: 750,
          width: "100%",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {statuses.map((status) => (
          <Box key={status.id} sx={{ textAlign: "center", minWidth: 80 }}>
            <Box>
              <Box
                component="img"
                src={`${BASE_URL}${status.imagePath}`}
                alt="status"
                onClick={() => handleOpenStatus(status)}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid black",
                  cursor: "pointer",
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "block",
                maxWidth: 70,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "white",
              }}
            >
              {status.user.username}
            </Typography>

            {status.user.email === user?.email && (
              <Box display="flex" justifyContent="center" gap={1} mt={0.5}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditStatus(status)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteStatus(status.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
