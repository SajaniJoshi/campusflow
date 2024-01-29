import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

import { SidebarTopData, SidebarBottomData } from "./SidebarData";

const Sidebar = () => {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar__contents">
          <div className="sidebar__top">
            <ul className="sidebar__top__links">
              {SidebarTopData.map((val, key) => {
                return (
                  <li key={key}>
                    {" "}
                    <NavLink
                      style={({ isActive }) => {
                        return {
                          backgroundColor: isActive ? "#439a86" : "",
                          color: isActive ? "#fff" : "",
                        };
                      }}
                      to={val.link}
                      className="sidebar__top__link"
                    >
                      {val.icon}
                      <span>{val.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="sidebar__bottom">
            <ul className="sidebar__bottom__links">
              {SidebarBottomData.map((val, key) => {
                return (
                  <li key={key}>
                    <NavLink
                      style={({ isActive }) => {
                        return {
                          backgroundColor: isActive ? "#439a86" : "",
                          color: isActive ? "#fff" : "",
                        };
                      }}
                      to={val.link}
                      className="sidebar__bottom__link"
                    >
                      {val.icon}
                      <span>{val.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
