import { BIBLE_API } from "@/constants/consts";
import { PassageBody } from "@/constants/types";

export default async function fetchBiblePassage() {
  try {
    const res = await fetch(BIBLE_API);
    if (!res.ok) throw new Error("Could not fetch data");
    const data: PassageBody = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
