import authCover from "@/assets/images/auth.jpg";

type prpos = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: prpos) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* left image side  */}
      <div className="hidden md:flex items-center justify-center bg-neutral-100">
        <img
          src={authCover}
          alt="image"
          className="w-full h-full object-contain"
        />
      </div>
      {/* right form side  */}
      <div className="flex mx-auto items-center justify-center px-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
