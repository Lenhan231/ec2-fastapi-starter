import HomeClient from "../components/HomeClient";
import { api } from "../lib/api";

export const revalidate = 0;

export default async function HomePage() {
  const gyms = await api.listGyms();
  return <HomeClient gyms={gyms} />;
}
