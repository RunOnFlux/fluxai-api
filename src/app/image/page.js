import ImageChat from "./components/ImageChat";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Flux | Image Generator",
  description: "Generate an image with FluxAI.",
};

export default function Image() {
  return (
    <div className="max-w-6xl mx-auto font-montserrat">
      <nav className="px-4 pt-4">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "FluxONE" }]}
        />
      </nav>
      <ImageChat />
    </div>
  );
}
