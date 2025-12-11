import HomePage from "./components/Home";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-2 md:gap-6 md:py-6">
          <div className="px-2 lg:px-6">
            <HomePage />
          </div>
        </div>
      </div>
    </div>
  );
}
