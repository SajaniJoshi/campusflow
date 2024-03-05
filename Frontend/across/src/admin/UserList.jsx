import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./components/Navbar/AdminNavbar";
import { api } from "../api/externalApi";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    setToken(authToken);
    
    // Fetch user data
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get("/auth/fetchUsers")
      .then(response => response.data)
      .then(data => {
        // Check if data is an array
        if (Array.isArray(data.user_data)) {
          // Map over the array and transform each object
          const formattedUsers = data.user_data.map(user => ({
            email: user.email,
            full_name: user.full_name,
            university_name: user.university_name,
            role: user.role
          }));
          // Update the users state with the formatted data
          setUsers(formattedUsers);
        } else {
          console.error("Invalid data format received:", data);
        }
        setLoadingUsers(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setLoadingUsers(false);
      });
  };
  
  const deleteUser = async (email) => {
    const data = {"email": email};
    const body = JSON.stringify(data);
   
    try {
      const response = await api.delete("/auth/deleteUser", {
        data: body,
        headers: {
          "Content-Type": "application/json"
        }})
      const retrievedMsg = response.data.message;
      if (retrievedMsg === "User deletion successful.") {
            setUsers(users.filter(user => user.email !== email));
            toast("User Deleted Successfully");
          } else {
            toast("Failed to delete user");
          }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast("Failed to delete user");
    }
  };

  const updateUser = async (email) => {
    const data1 = {"email": email};
    const body = JSON.stringify(data1);
    try {
      const response = await api.post("/auth/updateUserRole", {
       data: body,
        headers: {
          "Content-Type": "application/json"
        }})
        if (response.data.message === "User update successful.") {
              toast("User Updated Successfully");
                fetchUsers();
              } else {
                toast("Failed to update user");
              }
      
    } catch (error) {
      console.error("Error updating user:", error);
        toast("Failed to update user");
    }
    // ("http://127.0.0.1:8000/auth/updateUserRole", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: email
    //     // Add other fields you want to update here
    //   }),
    // })
    //   .then(response => response.json())
    //   .then(json => {
    //     if (json.message === "User update successful.") {
    //       toast("User Updated Successfully");
    //         fetchUsers();
    //     } else {
    //       toast("Failed to update user");
    //     }
    //   })
    //   .catch(error => {
        
    //   });
  };
  
  return (
    <div style={{ flex: 1 }}>
      <AdminNavbar />
      <ToastContainer />
      <p id="moduleHeading">Users Table</p>
      {loadingUsers ? (
        <div className="spinner">
          <Spinner animation="grow" variant="success" />
        </div>
      ) : (
        <Table striped bordered hover style={{ marginLeft: "10px", marginRight: "10px", padding: "10px"  }}>
          <thead>
            <th>Name</th>
            <th>Email</th>
            <th>University</th>
            <th>Role</th>
            <th>Actions</th>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.email}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.university_name}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === 'USER' && (
                    <ButtonGroup size="sm">
                        <div style={{display: "flex", justifyContent:"end", gap:"1rem"}} className="cta-btns">
                        <Button variant="warning" onClick={() => updateUser(user.email)}>Assign Admin</Button>
                        <Button variant="danger" onClick={() => deleteUser(user.email)}>Delete</Button>
                        </div>
                    </ButtonGroup>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserList;
