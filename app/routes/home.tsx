import type { Route } from "./+types/home";
import { Index } from "../home/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "skyFonix" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Index />;
}
