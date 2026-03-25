// Central icon registry — all icons used across the app come from here.
// Source: @radix-ui/react-icons

export {
  MagnifyingGlassIcon as SearchIcon,
  Cross2Icon as CloseIcon,
  EnterIcon as LoginIcon,
  HamburgerMenuIcon as MenuIcon,
  ChevronRightIcon as ArrowRightIcon,
  Cross1Icon as XIcon,
  PersonIcon as UserIcon,
  ExitIcon as LogoutIcon,
  GearIcon as SettingsIcon,
} from "@radix-ui/react-icons";

export {
  ShoppingCart as CartIcon,
  Star as StarIcon,
  ChevronLeft as ArrowLeftIcon,
  ChevronRight as ChevronRightIcon,
  Heart as FavIcon,
} from "lucide-react";

// Custom delivery bicycle courier icon
export const DeliveryBikeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Rear wheel */}
    <circle cx="13" cy="46" r="9" />
    {/* Front wheel */}
    <circle cx="51" cy="46" r="9" />
    {/* Frame: chain stay + seat stay */}
    <polyline points="13,46 24,28 36,28 44,46" />
    {/* Top tube */}
    <line x1="24" y1="28" x2="36" y2="20" />
    {/* Fork */}
    <line x1="44" y1="46" x2="40" y2="28" />
    {/* Down tube */}
    <line x1="36" y1="28" x2="44" y2="46" />
    {/* Handlebar */}
    <line x1="40" y1="28" x2="46" y2="25" />
    <line x1="46" y1="25" x2="46" y2="21" />
    {/* Seat post */}
    <line x1="36" y1="20" x2="34" y2="26" />
    {/* Seat */}
    <line x1="30" y1="20" x2="39" y2="20" />
    {/* Rider head */}
    <circle cx="44" cy="16" r="4" fill="currentColor" stroke="none" opacity="0.15" />
    <circle cx="44" cy="16" r="4" />
    {/* Rider body */}
    <polyline points="44,20 40,28 46,25" />
    {/* Delivery box on back */}
    <rect x="22" y="19" width="12" height="9" rx="1" />
    <line x1="28" y1="19" x2="28" y2="28" />
  </svg>
);
