type FooterProps = {
    children?: React.ReactNode
}

export const Footer = ({ children }: FooterProps) => {
    return (
        <footer className="border-t border-gray-300 py-4 mt-6">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
                {children}
            </div>
        </footer>
    )
}