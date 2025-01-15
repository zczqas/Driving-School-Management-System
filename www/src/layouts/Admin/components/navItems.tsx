import Image from "next/image";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InventoryIcon from "@mui/icons-material/Inventory";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import { Badge as BadgeIcon, LocalAtm, Receipt } from "@mui/icons-material";

// NAV ITEMS
export const navItems = [
  {
    id: 1,
    name: "csr",
    title: "csr",
    icon: <SupportAgentIcon sx={{ color: "#fff" }} />,
    slug: "",
    isDisabled: false,
    role: ["admin", "csr"],
    subNavItems: [
      {
        id: 1,
        name: "Search Students",
        title: "Search Students",
        icon: <PersonSearchIcon sx={{ color: "#fff" }} />,
        slug: "/manage/search-students",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 2,
        name: "Student Listing",
        title: "Student Listing",
        icon: (
          <Image
            src={"/assets/icons/user.svg"}
            alt="user"
            height={24}
            width={24}
          />
        ),
        slug: "/manage/student-listing",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 3,
        name: "Add New Student",
        title: "Add New Student",
        icon: <PersonAddIcon sx={{ color: "#fff" }} />,
        slug: "/manage/add-new-student",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 4,
        name: "DT Appt Confirmation",
        title: "DT Appt Confirmation",
        icon: (
          <Image
            src={"/assets/icons/appointment.svg"}
            alt="driver-training"
            height={24}
            width={24}
          />
        ),
        slug: "/manage/driver-training-and-education",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 5,
        name: "Issue Certificates",
        title: "Issue certificates",
        icon: (
          <Image
            src={"/assets/icons/certificate.svg"}
            alt="certificate"
            height={24}
            width={24}
          />
        ),
        slug: "/manage/certificate",
        isDisabled: false,
        role: ["admin", "csr"],
      },
    ],
  },
  {
    id: 2,
    name: "Instructor",
    title: "instructor",
    icon: (
      <Image
        src={"/assets/icons/instructor.svg"}
        alt="instructor"
        height={24}
        width={24}
      />
    ),
    slug: "",
    isDisabled: false,
    role: ["admin", "instructor", "csr"],
    subNavItems: [
      {
        id: 1,
        name: "Instructors Lesson Listing",
        title: "Instructors Lesson Listing",
        icon: <InventoryIcon sx={{ color: "#fff" }} />,
        slug: "/manage/instructor/instructors-lesson-listing",
        isDisabled: false,
        role: ["admin", "instructor", "csr"],
      },
      {
        id: 2,
        name: "Instructors TimeSheet",
        title: "Instructors TimeSheet",
        icon: <ViewTimelineIcon sx={{ color: "#fff" }} />,
        slug: "/manage/instructor/instructors-timesheet",
        isDisabled: false,
        role: ["admin", "instructor", "csr"],
      },
      {
        id: 3,
        name: "Schedule",
        title: "Schedule",
        icon: <ScheduleIcon sx={{ color: "#fff" }} />,
        slug: "/manage/instructor/instructors-schedule",
        isDisabled: false,
        role: ["admin", "csr", "instructor"],
      },
      {
        id: 4,
        name: "Current Instructors",
        title: "Current Instructors",
        icon: <PeopleIcon sx={{ color: "#fff" }} />,
        slug: "/manage/instructor/current-instructors",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 5,
        name: "Calendar",
        title: "Calendar",
        icon: <CalendarMonthIcon sx={{ color: "#fff" }} />,
        slug: "/manage/calendar",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 6,
        name: "Issue Certificates",
        title: "Issue certificates",
        icon: (
          <Image
            src={"/assets/icons/certificate.svg"}
            alt="certificate"
            height={24}
            width={24}
          />
        ),
        slug: "/manage/certificate/",
        isDisabled: false,
        role: ["instructor"],
      },
    ],
  },
  {
    id: 3,
    name: "Main",
    title: "Main",
    icon: <DashboardRoundedIcon sx={{ color: "#fff" }} />,
    slug: "",
    isDisabled: false,
    role: ["admin"],
    subNavItems: [
      // {
      //   id: 1,
      //   name: "School Configuration Pages",
      //   title: "School Configuration Pages",
      //   icon: (
      //     <Image
      //       src={"/assets/icons/packages.svg"}
      //       alt="package"
      //       height={24}
      //       width={24}
      //     />
      //   ),
      //   slug: "",
      //   isDisabled: false,
      // },

      // {
      //   id: 4,
      //   name: "Sales Report",
      //   title: "Sales Report",
      //   icon: <AssessmentIcon sx={{ color: "#fff" }} />,
      //   slug: "/manage/accounting",
      //   isDisabled: false,
      //   role: ["admin", "csr"],
      // },
      {
        id: 2,
        name: "Users",
        title: "Users",
        icon: <PeopleIcon sx={{ color: "#fff" }} />,
        slug: "/manage/user-management",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 3,
        name: "Packages",
        title: "Packages",
        icon: <InventoryIcon sx={{ color: "#fff" }} />,
        slug: "/manage/packages",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 6,
        name: "Lessons",
        title: "Lessons",
        icon: <SchoolIcon sx={{ color: "#fff" }} />,
        slug: "/manage/lessons",
        isDisabled: false,
        role: ["admin"],
      },
      {
        id: 12,
        name: "Driver ED and Courses",
        title: "Driver ED and Courses",
        icon: (
          <Image
            src={"/assets/icons/user.svg"}
            alt="user"
            height={24}
            width={24}
          />
        ),
        slug: "/manage/course",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      // {
      //   id: 4,
      //   name: "Coupons",
      //   title: "Coupons",
      //   icon: (
      //     <Image
      //       src={"/assets/icons/appointment.svg"}
      //       alt="driver-training"
      //       height={24}
      //       width={24}
      //     />
      //   ),
      //   slug: "",
      //   isDisabled: false,
      // },
      // {
      //   id: 5,
      //   name: "Lists",
      //   title: "Lists",
      //   icon: (
      //     <Image
      //       src={"/assets/icons/appointment.svg"}
      //       alt="driver-training"
      //       height={24}
      //       width={24}
      //     />
      //   ),
      //   slug: "",
      //   isDisabled: false,
      // },
      // {
      //   id: 6,
      //   name: "Email Text",
      //   title: "Email Text",
      //   icon: (
      //     <Image
      //       src={"/assets/icons/appointment.svg"}
      //       alt="driver-training"
      //       height={24}
      //       width={24}
      //     />
      //   ),
      //   slug: "",
      //   isDisabled: false,
      // },
      // {
      //   id: 7,
      //   name: "Reports",
      //   title: "Reports",
      //   icon: (
      //     <Image
      //       src={"/assets/icons/appointment.svg"}
      //       alt="driver-training"
      //       height={24}
      //       width={24}
      //     />
      //   ),
      //   slug: "",
      //   isDisabled: false,
      // },

      // {
      //   id: 8,
      //   name: "Instructor Time Sheets",
      //   title: "Instructor Time Sheets",
      //   icon: (
      //     <Image
      //       src={"/assets/icons/user.svg"}
      //       alt="package"
      //       height={24}
      //       width={24}
      //     />
      //   ),
      //   slug: "/manage/instructor/instructors-timesheet",
      //   isDisabled: false,
      //   role: ["admin", "csr", "instructor"],
      // },
      // {
      //   id: 9,
      //   name: "Appointment Reminder",
      //   title: "Appointment Reminder",
      //   icon: (
      //     <Image
      //       src={"/assets/icons/appointment.svg"}
      //       alt="driver-training"
      //       height={24}
      //       width={24}
      //     />
      //   ),
      //   slug: "",
      //   isDisabled: false,
      // },

      {
        id: 7,
        name: "School Configuration",
        title: "School Configuration",
        icon: (
          <Image
            src={"/assets/icons/settings.svg"}
            alt="masterlist"
            height={24}
            width={24}
          />
        ),
        slug: "/manage/school-configuration",
        isDisabled: false,
        role: ["admin"],
      },
      {
        id: 9,
        name: "Show Activities",
        title: "Show Activities",
        icon: (
          <Image
            src={"/assets/icons/book-a.svg"}
            alt="activities-icon"
            height={24}
            width={24}
          />
        ),
        slug: "/manage/activities",
        isDisabled: false,
        role: ["admin", "csr", "instructor"],
      },
      // {
      //   id: 10,
      //   name: "Banners",
      //   title: "Banners",
      //   icon: (
      //     <Image
      //       src={"/assets/icons/appointment.svg"}
      //       alt="driver-training"
      //       height={24}
      //       width={24}
      //     />
      //   ),
      //   slug: "",
      //   isDisabled: false,
      // },
      {
        id: 11,
        name: "Coupons",
        title: "Coupons",
        icon: (
          <Image
            src={"/assets/icons/ticket.svg"}
            alt="activities-icon"
            height={24}
            width={24}
          />
        ),
        slug: "/manage/coupons",
        isDisabled: false,
        role: ["admin", "csr"],
      },
    ],
  },
  {
    id: 4,
    name: "Reports",
    title: "Reports",
    icon: <AssessmentIcon sx={{ color: "#fff" }} />,
    slug: "",
    isDisabled: false,
    role: ["admin", "csr", "instructor"],
    subNavItems: [
      {
        id: 1,
        name: "Transactions",
        title: "Transactions",
        icon: <LocalAtm sx={{ color: "#fff" }} />,
        slug: "/manage/accounting",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 2,
        name: "Sales Report",
        title: "Sales Report",
        icon: <Receipt sx={{ color: "#fff" }} />,
        slug: "/manage/accounting/sales-report",
        isDisabled: false,
        role: ["admin", "csr"],
      },
      {
        id: 3,
        name: "Certificates Report",
        title: "Certificate Report",
        icon: <BadgeIcon sx={{ color: "#fff" }} />,
        slug: "/manage/certificate-report",
        isDisabled: false,
        role: ["admin", "csr", "instructor"],
      },
    ],
  },
  {
    id: 5,
    name: "Master List",
    title: "master list",
    icon: (
      <Image
        src={"/assets/icons/list.svg"}
        alt="masterlist"
        height={24}
        width={24}
      />
    ),
    slug: "/manage/masterlist",
    isDisabled: false,
    role: ["admin"],
  },
  {
    id: 6,
    name: "Home",
    title: "home",
    icon: <DashboardRoundedIcon sx={{ color: "#fff" }} />,
    slug: "/manage/home",
    isDisabled: false,
    role: ["student"],
  },
  {
    id: 7,
    name: "Online Driver Ed",
    title: "online driver ed",
    icon: <DriveEtaIcon sx={{ color: "#fff" }} />,
    slug: "/manage/drivers-ed",
    isDisabled: false,
    role: ["student"],
    showIfDriverEd: true,
  },
  {
    id: 8,
    name: "Schedule Lessons",
    title: "schedule lessons",
    icon: <CalendarMonthIcon sx={{ color: "#fff" }} />,
    slug: "/manage/schedule-lessons",
    isDisabled: true,
    role: ["student"],
  },
  {
    id: 9,
    name: "Package",
    title: "package",
    icon: <RequestPageIcon sx={{ color: "#fff" }} />,
    slug: "/manage/accounting/create",
    isDisabled: false,
    role: ["student"],
  },
  {
    id: 10,
    name: "Profile",
    title: "Profile",
    icon: (
      <Image src={"/assets/icons/user.svg"} alt="user" height={24} width={24} />
    ),
    slug: "/manage/profile",
    isDisabled: false,
    role: ["student"],
  },
];
