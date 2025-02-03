import ImageChat from "./components/ImageChat";

export const metadata = {
  title: "Flux | Image Generator",
  description: "Generate an image with FluxAI.",
};

export default function Image() {
  return (
    <div className="max-w-6xl mx-auto">
      <ImageChat />
    </div>
  );
}
