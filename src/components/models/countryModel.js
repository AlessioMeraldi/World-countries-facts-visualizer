export async function fetchCountryByName(name) {

    const base = "https://restcountries.com/v3.1/name/";
    const encoded = encodeURIComponent(name);

    // Attempt 1: exact match (fullText=true)
    try {
        const resFull = await fetch(`${base}${encoded}?fullText=true`);
        if (!resFull.ok) {
            throw new Error("Could not find matching country");
        }

        const dataFull = await resFull.json();
        return dataFull;

    } catch (err) {
        console.log(
            "Couldn't find a Country matching the exact name, attempting fallback solution - thrown " + err
        );
        // ignores and goes on to the fallback
    }

    try {
        const resPartial = await fetch(`${base}${encoded}`);
        if (!resPartial.ok) {
            const text = await resPartial.text().catch(() => "");
            throw new Error(resPartial.statusText || text || "Country not found.");
        }

        const dataPartial = await resPartial.json();
        return dataPartial;

    } catch (err) {
        console.log(
            "Couldn't find matching country even with the fallback solution - thrown " + err
        );
        throw err; // propagate to ViewModel
    }
}
