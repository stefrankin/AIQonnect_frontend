"use server";

export async function scrapeANDStoreSearch(query: string) {
  if(!query) return;

  try {
    const searchResults = await scrapeSearch(query);
  } catch (error:any) {
    throw new Error('Failed to create/update search results');
  }
   
 
}