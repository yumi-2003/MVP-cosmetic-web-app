import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShoppingBag, LogIn } from "lucide-react";
import SearchBar from "./SearchBar";
import { Link } from "react-router";

const Navactions = () => {
  const user = null;
  return (
    <div className="flex items-center gap-4 text-light/80">
      <SearchBar />

      {user ? (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.image} />
        </Avatar>
      ) : (
        <Link to="/login">
          <Button
            variant="ghost"
            size="icon"
            className="flex h-9 w-9 items-center justify-center"
          >
            <LogIn className="h-5 w-5" />
            <span className="sr-only">Login</span>
          </Button>
        </Link>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="flex h-9 w-9 items-center justify-center"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="sr-only">Cart</span>
      </Button>
    </div>
  );
};

export default Navactions;
