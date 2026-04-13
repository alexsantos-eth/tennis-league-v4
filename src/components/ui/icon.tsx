interface IconProps {
  children: React.ReactNode;
}

const Icon = ({ children }: IconProps) => {
  return (
    <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
      {children}
    </span>
  );
};

export default Icon;
