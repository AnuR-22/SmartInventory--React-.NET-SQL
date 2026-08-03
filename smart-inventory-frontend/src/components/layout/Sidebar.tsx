import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { tokens } from "../../theme/theme";

const navItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    label: "Assets",
    to: "/assets",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
  {
    label: "Assignments",
    to: "/assignments",
    icon: <AssignmentIndOutlinedIcon fontSize="small" />,
  },
  {
    label: "Repairs",
    to: "/repairs",
    icon: <BuildOutlinedIcon fontSize="small" />,
  },
  {
    label: "Vendors",
    to: "/vendors",
    icon: <StorefrontOutlinedIcon fontSize="small" />,
  },
  {
    label: "Employees",
    to: "/employees",
    icon: <GroupOutlinedIcon fontSize="small" />,
  },
  {
    label: "Reports",
    to: "/reports",
    icon: <SummarizeOutlinedIcon fontSize="small" />,
  },
];

export default function Sidebar() {
  return (
    <Box
      component="nav"
      sx={{
        width: 232,
        flexShrink: 0,
        backgroundColor: tokens.ink,
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2.5,
          py: 3,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            backgroundColor: tokens.copper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <QrCode2Icon sx={{ fontSize: 18, color: "#FFFFFF" }} />
        </Box>
        <Box>
          <Typography
            sx={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.1 }}
          >
            Smart Inventory
          </Typography>
          <Typography
            sx={{
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.04em",
            }}
          >
            ASSET MANAGEMENT
          </Typography>
        </Box>
      </Box>

      <Box
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          px: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {navItems.map((item) => (
          <Box component="li" key={item.to} sx={{ display: "block" }}>
            <Box
              component={NavLink}
              to={item.to}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                textDecoration: "none",
                color: "rgba(255,255,255,0.75)",
                borderRadius: 1.5,
                px: 1.5,
                py: 1,
                fontSize: "0.85rem",
                fontWeight: 500,
                transition: "background-color 0.15s ease, color 0.15s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "#FFFFFF",
                },
                "&.active": {
                  backgroundColor: "rgba(193,121,63,0.18)",
                  color: "#FFFFFF",
                  borderLeft: `3px solid ${tokens.copper}`,
                  pl: "calc(1.5 * 8px - 3px)",
                },
              }}
            >
              {item.icon}
              {item.label}
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mt: "auto",
          px: 2.5,
          py: 2.5,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography
          sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)" }}
        >
          RKST
        </Typography>
      </Box>
    </Box>
  );
}
