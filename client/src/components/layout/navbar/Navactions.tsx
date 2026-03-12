import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import SearchBar from "./SearchBar";

const Navactions = () => {
  const user = null;
  return (
    <div className="flex items-center gap-4">
      <SearchBar />

      {user ? (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.image} />
        </Avatar>
      ) : (
        <Button variant="ghost" size="icon">
          Login
        </Button>
      )}

      <ShoppingBag className="w-5 h-5 cursor-pointer" />
    </div>
  );
};

export default Navactions;
