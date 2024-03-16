import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import { useLocation } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const { pathname } = useLocation();
    const [showComponent, setShowComponent] = useState(true);
    useEffect(() => {
        if ((pathname.startsWith("/admin")) || (pathname === "/adminLogin") ||
            (pathname === "/login") || (pathname === "/register") || (pathname === "/home/account"))
            {
            setShowComponent(false);
        } else {
            setShowComponent(true);
        }
    }, [pathname]);
    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            {showComponent && <>
                <Hero />
                <div className="container mx-auto">
                    <SearchBar />
                </div>
            </>}
            <div className="container mx-auto py-10 flex-1">
                {children}
            </div>
        </div>
    )
};

export default Layout;
