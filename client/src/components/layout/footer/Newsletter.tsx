const Newsletter = () => {
  return (
    <section className="border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-8 lg:grid-cols-2 lg:items-center">
        {/* left  */}
        <div className="">
          <p className="text-xs tracking-[0.3em] text-neutral-500">
            STAY IN THE LOOP
          </p>
          <h2 className="font-serif text-3xl md:text-4xl mt-3">
            Beauty, delivered to your inbox.
          </h2>
        </div>
        {/* right */}
        <form className="flex w-full max-w-md">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-transparent border border-neutral-700 px-4 py-3 outline-none"
          />
          <button className="bg-white text-black px-6 text-sm tracking-widest transition-all hover:bg-neutral-500 hover:text-white">
            {" "}
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
