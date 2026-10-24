import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Chrome from "@/components/Chrome";
import Hero from "@/components/Hero";
import Stage from "@/components/Stage";
import Integrations from "@/components/Integrations";
import Closing from "@/components/Closing";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <Chrome />
      <main>
        <Hero />
        <Stage />
        <Integrations />
        <Closing />
      </main>
    </>
  );
}
