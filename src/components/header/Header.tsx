import { Link } from "react-router"

type HeaderProps = {
    children?: React.ReactNode
}

export const Header = ({ children }: HeaderProps) => {
    return (
        <header className="p-4 border-b border-gray-300 flex justify-end">
            <nav>
                <Link to="/" className="mr-4 text-blue-500 hover:underline">Home</Link>
                {/* <Link to="/about" className="mr-4 text-blue-500 hover:underline">About</Link>
                <Link to="/contact" className="text-blue-500 hover:underline">Contact</Link> */}
            </nav>
            {children}
        </header>
    )
}