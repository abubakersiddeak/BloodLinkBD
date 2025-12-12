import Loading from "@/components/Loading";
import RedirectProvider from "@/providers/RedirectProvider";

export default function Page() {
  return (
    <>
      <RedirectProvider>
        <Loading />
      </RedirectProvider>
    </>
  );
}
