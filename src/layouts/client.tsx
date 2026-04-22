import { Toaster } from "sonner";

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default ClientProvider;
