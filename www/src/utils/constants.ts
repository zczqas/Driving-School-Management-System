/* 
    This file contains all the constants used in the landing page.
    The constants are used to maintain a consistent look and feel throughout the page.
    The constants are used in the styled components of the page.
*/
import {
    AccountCircleOutlined,
    AttachMoneyOutlined,
    SchoolOutlined,
    CheckCircleOutlined,
    NotesOutlined,
    DescriptionOutlined,
    EmailOutlined,
  } from "@mui/icons-material";

export const constants = {
    color: {
        primary: {
            main: "#5E38B5",
            light: "#FF5C00",
            dark: "#FF5C00",
        },
        text: {
            primary: "#F37636",
            secondary: "#000000",
        },
        background: {
            default: "#FFFFFF",
            paper: "#FFFFFF",
        },
    },
    paddingContainerX: {
        xs: "20px",
        md: "80px",
        lg: "90px",
    },
    mobileMinHeight: "calc(100vh - 200px)",
    profileTabs: [
        {
            id: 1,
            name: "Profile Information",
            icon: AccountCircleOutlined,
        },
        {
            id: 2,
            name: "Transactions",
            icon: AttachMoneyOutlined,
        },
        {
            id: 3,
            name: "DT & Ed.",
            icon: SchoolOutlined,
        },
        {
            id: 4,
            name: "Certificates",
            icon: CheckCircleOutlined,
        },
        {
            id: 5,
            name: "Instructor Notes",
            icon: NotesOutlined,
        },
        {
            id: 6,
            name: "Documents",
            icon: DescriptionOutlined,
        },
        {
            id: 7,
            name: "Email Logs",
            icon: EmailOutlined,
        },
    ],
}