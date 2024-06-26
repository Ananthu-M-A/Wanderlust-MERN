import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
// import SearchBar from "../components/search/SearchBar";
import { useLocation } from "react-router-dom";
import Footer from "../components/footer/Footer";
import SearchBar from "../components/search/SearchBar";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const { pathname } = useLocation();
    const [showComponent, setShowComponent] = useState(true);
    useEffect(() => {
        if (pathname.startsWith("/search")) {
            setShowComponent(true);
        } else {
            setShowComponent(false);
        }
    }, [pathname]);
    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            {showComponent && <div className="bg-img bg-cover bg-center min-h-screen">
                <SearchBar />
            </div>}
            <div className="container mx-auto py-10 flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
};

export default Layout;
