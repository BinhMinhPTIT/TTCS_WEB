import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlusCircle, FaEdit, FaList, FaShoppingCart, FaBookOpen } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          to={"/add"}
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <FaPlusCircle className="w-5 h-5" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>
        {/* <NavLink
          to={"/edit"}
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <FaEdit className="w-5 h-5" />
          <p className="hidden md:block">Edit Items</p>
        </NavLink> */}
        <NavLink
          to={"/list"}
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <FaList className="w-5 h-5" />
          <p className="hidden md:block">List Items</p>
        </NavLink>
        <NavLink
          to={"/orders"}
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <FaShoppingCart className="w-5 h-5" />
          <p className="hidden md:block">Orders Items</p>
        </NavLink>
        <NavLink
          to={"/blog-management"}
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <FaBookOpen className="w-5 h-5" />
          <p className="hidden md:block">Blog Management</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
