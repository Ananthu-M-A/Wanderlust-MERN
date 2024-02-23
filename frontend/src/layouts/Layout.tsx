import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import { useAppContext } from "../contexts/AppContext";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const { isLoggedIn } = useAppContext();
    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            {isLoggedIn && <Hero />}
            <div className="container mx-auto">
                {isLoggedIn && <SearchBar />}
            </div>
            <div className="container mx-auto py-10 flex-1">
                {children}
            </div>
        </div>
    )
};

export default Layout;
