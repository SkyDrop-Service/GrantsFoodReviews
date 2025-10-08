import { Link } from "react-router-dom";

interface HeaderProps {
  backgroundColor?: string;
}

export const Header = ({ backgroundColor = '#CCCCCC' }: HeaderProps) => {
    return (
        <header 
            className="border-b transition-colors duration-500 ease-in-out"
            style={{ backgroundColor }}
        >
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