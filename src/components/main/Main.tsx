export const Main = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <main
      className={`container mx-auto flex flex-grow flex-col items-center justify-center p-4 ${className}`}
    >
      {children}
    </main>
  );
};
