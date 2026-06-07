export default function HeroSection() {
  return (
    <div className="grid grid-cols-12 gap-8 mb-12">

      <div className="col-span-8">

        <p className="uppercase tracking-[6px] text-[#754C3A] text-sm mb-3">
          BUILDMATE HQ
        </p>

        <h1 className="text-7xl leading-none font-light text-[#24120C]">
          Welcome
        </h1>

        <h1 className="text-7xl leading-none font-light text-[#E35336]">
          Back,
        </h1>

        <h1 className="text-7xl leading-none font-light text-[#24120C]">
          Builder.
        </h1>

        <p className="italic text-[#754C3A] text-2xl mt-5">
          your next teammate is one swipe away
        </p>

      </div>

      <div className="col-span-4 flex justify-end">

        <div className="w-60 bg-[#2C130A] rounded-3xl p-8 rounded-3xl">

          <p className="text-right text-gray-300 uppercase">
            LEVEL
          </p>

          <h2 className="text-right text-7xl text-[#F2A25C]">
            7
          </h2>

          <div className="h-2 bg-[#5D392B] rounded-full mt-5">
            <div
              className="h-2 bg-[#A17660] rounded-full"
              style={{ width: "95%" }}
            />
          </div>

          <p className="text-center text-gray-400 mt-4">
            2840 / 3000 XP
          </p>

        </div>

      </div>

    </div>
  );
}