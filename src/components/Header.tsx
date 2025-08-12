import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/favicon.ico" alt="App Logo" className="h-12 w-12" />
                    </Link>
                </div>
            </div>
        </header>
    );
};