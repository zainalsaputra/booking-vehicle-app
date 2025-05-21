import { jwtDecode } from "jwt-decode";
import {
  HomeIcon,
  TableCellsIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Approver, Pengajuan, Laporan } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

// Decode token untuk mendapatkan role
const token = localStorage.getItem("accessToken");
let userRole = null;

if (token) {
  try {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role_id; // Pastikan role_id ada dalam JWT
  } catch (error) {
    console.error("Gagal mendecode token:", error);
  }
}

const icon = {
  className: "w-5 h-5 text-inherit",
};

// Definisi routes dengan kondisi role
export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "laporan",
        path: "/laporan",
        element: <Laporan />,
      },
      ...(userRole === 1
        ? [
            {
              icon: <TableCellsIcon {...icon} />,
              name: "pengajuan",
              path: "/pengajuan",
              element: <Pengajuan />,
            },
          ]
        : []),
      ...(userRole === 2
        ? [
            {
              icon: <TableCellsIcon {...icon} />,
              name: "approver",
              path: "/approver",
              element: <Approver />,
            },
          ]
        : []), 
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
