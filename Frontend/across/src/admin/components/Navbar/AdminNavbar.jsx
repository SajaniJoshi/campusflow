import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { useAuth } from "../../../context/AuthContext";

const AdminNavbar = () => {
    const [auth, setAuth] = useAuth();

    const handleLogoutClick = () => {
        setAuth({ ...auth, user: null, token: "" });
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <Navbar
            expand="lg"
            style={{
                backgroundColor: "#007991",
                width: "100%",
                margin: "auto",
                padding: "0 20px",
            }}
        >
            <Navbar.Brand
                href="/admin/home"
                style={{
                    fontSize: "30px",
                    color: "#fff",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
            >
                campus<b>flow</b>
                <sup style={{ fontSize: "14px", margin: "0 px 0px 0px 2px" }}>Admin Panel</sup>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll" style={{ backgroundColor: "#007991" }}>
                <div className="ms-auto d-flex">
                    <Nav.Link className="text-black d-flex flex-column align-items-left">
                        <span className="ms-0 mb-0" style={{ color: "#fff", margin: "1px" }}>
                            <b>{auth.user.full_name}</b>
                        </span>
                        <span style={{ color: "#fff" }}>{auth.user.role}</span>
                    </Nav.Link>
                    <a
                        href="#"
                        className="avatar-emoji"
                        style={{
                            backgroundColor: "#007991",
                            textDecoration: "none",
                            cursor: "pointer",
                            color: "black",
                            marginLeft: "10px", // Add margin for spacing
                        }}
                    >
                        <CgProfile />
                    </a>
                    <a
                        href="/campus-flow/login"
                        className="logout-icon"
                        style={{
                            backgroundColor: "#007991",
                            textDecoration: "none",
                            cursor: "pointer",
                            color: "black",
                            marginLeft: "10px", // Add margin for spacing
                        }}
                        onClick={handleLogoutClick}
                    >
                        <IoIosLogOut />
                    </a>
                </div>
            </Navbar.Collapse>
        </Navbar>

    );
};

export default AdminNavbar;