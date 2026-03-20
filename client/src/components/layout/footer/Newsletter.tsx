const Newsletter = () => {
  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 lg:grid-cols-2 lg:items-center">
        {/* left  */}
        <div className="">
          <p className="text-xs tracking-[0.3em] text-muted-foreground">
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
            className="flex-1 bg-background border border-input px-4 py-3 outline-none"
          />
          <button className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 px-6 py-3 text-sm tracking-widest transition-all">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
