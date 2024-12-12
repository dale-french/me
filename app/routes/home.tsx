import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dale French - Software Engineer" },
    {
      name: "description",
      content:
        "I'm an experienced Software Engineer / Engineering Manager based in Amsterdam.",
    },
  ];
}

export default function Home() {
  return <p>Hello!</p>;
}
