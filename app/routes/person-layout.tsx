import { Outlet } from "react-router";
import Navbar from "../../komponenter/navbar/Navbar";

export default function PersonLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}