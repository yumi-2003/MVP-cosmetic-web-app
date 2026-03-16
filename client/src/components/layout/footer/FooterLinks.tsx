const FooterLinks = () => {
  return (
    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
      {/* brand  */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl">JUSTAGIRL</h3>
        <p className="text-sm text-neutral-400">
          Clean, considered beauty for skin that speaks for itself.
        </p>
      </div>

      {/* shop  */}
      <div className="space-y-3">
        <h4 className="text-xs tracking-widest text-neutral-500">SHOP</h4>
        <ul className="space-y-2 text-sm">
          <li className="">All Products</li>
          <li className="">Skincare</li>
          <li className="">Makeup</li>
          <li className="">New Arrivals</li>
          <li className="">Best Sellers</li>
        </ul>
      </div>

      {/* company  */}
      <div className="">
        <h4 className="text-xs tracking-widest text-neutral-500">COMPANY</h4>
        <ul className="space-y-2 text-sm">
          <li className="">Our Story</li>
          <li className="">Sustainability</li>
          <li className="">Press</li>
          <li className="">Careers</li>
        </ul>
      </div>

      {/* support  */}
      <div className="">
        <h4 className="text-xs tracking-widest text-neutral-500">SUPPORT</h4>
        <ul className="space-y-2 text-sm">
          <li>FAQ</li>
          <li>Shipping & Returns</li>
          <li>Track Order</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </div>
  );
};

export default FooterLinks;
