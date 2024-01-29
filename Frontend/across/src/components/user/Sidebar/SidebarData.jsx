import React from "react";
// sidebar top icons imports
import { MdDashboard } from "react-icons/md";
import { FaBook, FaBookOpen, FaServicestack } from "react-icons/fa";
import { RiSchoolFill, RiAppsFill } from "react-icons/ri";

// sidebar bottom icon imports
import { MdSettings } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const homeUrl = "/campus-flow/user/home";
const universityUrl = "/campus-flow/user/universities";
const servicesUrl = "/campus-flow/user/services";
const coursesUrl = "/campus-flow/user/courses";
const modulesUrl = "/campus-flow/user/modules";
const applicationsUrl = "/campus-flow/user/applications";

const profileUrl = "/campus-flow/user/profile";
const settingsUrl = "/campus-flow/user/settings";

export const SidebarTopData = [
  {
    title: "Dashboard",
    icon: <MdDashboard />,
    link: homeUrl,
  },
  {
    title: "Modules",
    icon: <FaBook />,
    link: modulesUrl,
  },

  {
    title: "Courses",
    icon: <FaBookOpen />,
    link: coursesUrl,
  },
  {
    title: "Universities",
    icon: <RiSchoolFill />,
    link: universityUrl,
  },
  {
    title: "Applications",
    icon: <RiAppsFill />,
    link: applicationsUrl,
  },
  {
    title: "Services",
    icon: <FaServicestack />,
    link: servicesUrl,
  },
];

export const SidebarBottomData = [
  {
    title: "My Profile",
    icon: <FaUserCircle />,
    link: profileUrl,
  },
  {
    title: "Settings",
    icon: <MdSettings />,
    link: settingsUrl,
  },
];
