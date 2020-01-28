import { Assistant } from "./interfaces";
import { db } from "./main";

export function diffrenceAssistant(
  a: Assistant[],
  b: Assistant[]
): Assistant[] {
  const c: Assistant[] = [];
  for (const x of a) if (!needleExist(x.phone, b)) c.push(x);

  return c;
}

function needleExist(phone: string, heyStack: Assistant[]): boolean {
  for (const y of heyStack) if (phone === y.phone) return true;
  return false;
}

export function arr_diff(a1: string[], a2: string[]): string[] {
  return a1.filter(item => a2.indexOf(item) < 0);
}

export async function getDocByPhone(
  doc: string,
  phoneAtt: string,
  phoneVal: string
): Promise<FirebaseFirestore.QuerySnapshot> {
  return await db
    .collection(doc)
    .where(phoneAtt, "==", phoneVal)
    .select()
    .get();
}
