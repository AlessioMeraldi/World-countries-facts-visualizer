
export async function fetchCountryByName(name) {
    const base = "https://restcountries.com/v3.1/name/";
    const encoded = encodeURIComponent(name);

    // Attempt 1: exact match (fullText=true)
    try {
        const resFull = await fetch(`${base}${encoded}?fullText=true`);
        if (resFull.ok) {
            const dataFull = await resFull.json();
            return dataFull;
        } else {
            throw new Error();
        }
    } catch (err) {
        console.log('Casted error and attempting fallback solution'+err);
        // ignores and goes on to the fallback
    }

    // Attempt 2: partial match (fallback solution)
    const res = await fetch(`${base}${encoded}`);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(res.statusText || text || "Country not found.");
    }
    return res.json();
}
