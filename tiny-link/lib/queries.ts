import { linktable } from "@/types/link";
import {query} from "./db"

export  function generateRandomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 6; 
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function isValidCode(url: string): boolean {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "(([\\da-z.-]+)\\.([a-z.]{2,6})|" + 
    "(([0-9]{1,3}\\.){3}[0-9]{1,3}))" + 
    "([\\/\\w .-]*)*\\/?$", "i"
  );
  return pattern.test(url);
}

export function isValidUrl(url:string):boolean{
  try {
    const u = new URL(url)
    return u.protocol ==="http" || u.protocol ==="https:"
  } catch (error) {
    console.log(error,"The eroor")
    return false;
  }
}

export async function getLinkByCode(code: string): Promise<linktable | null> {
  const { rows } = await query<linktable>(
    `SELECT * FROM links WHERE code = $1`,
    [code]
  );
  return rows[0] ?? null;
}

export async function createLink(code:string,url:string):Promise<linktable>{
  const existing = await getLinkByCode(code);
  if(existing){
    const err = new Error("Code already exists");
    // @ts-ignore
    err.code = "code_exists";
    throw err;
  }
  const {rows}=await query<linktable>(
    `INSERT INTO links (code,url)
     Values ($1, $2)
     RETURNING *
    `,
    [code, url]
  )
    return rows[0];
}

export async function getAllLinks():Promise<linktable[]>{
 const {rows} = await query<linktable>(`
     SELECT * FROM links
     ORDER BY created_at DESC
    `)
   return rows;
}

export async function deleteLinkByCode(code: string): Promise<boolean> {
  const { rows } = await query<{ id: number }>(
    `DELETE FROM links WHERE code = $1
     RETURNING id`,
    [code]
  );
  return rows.length > 0;
}

export async function incrementClick(code: string): Promise<linktable | null> {
  const { rows } = await query<linktable>(
    `UPDATE links
       SET clicks = clicks + 1,
           last_clicked_at = NOW()
     WHERE code = $1
     RETURNING *`,
    [code]
  );
  return rows[0] ?? null;
}