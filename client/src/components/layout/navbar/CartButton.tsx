import { Link } from "react-router";
import { CartIcon } from "@/components/icons";
import { useAppSelector } from "@/redux/hooks";

const CartButton = () => {
  const { items } = useAppSelector((state) => state.cart || { items: [] });
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link
      to="/cart"
      className="group relative p-2.5 text-foreground/70 hover:text-primary transition-all duration-300 hover:scale-110 active:scale-95 bg-secondary/30 hover:bg-primary/10 rounded-full flex-shrink-0"
      aria-label="Cart"
    >
      <CartIcon className="w-[19px] h-[19px] transition-transform duration-300 group-hover:rotate-[15deg]" />
      
      {/* Aesthetic Animated Badge */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg animate-in zoom-in duration-300">
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25"></span>
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
