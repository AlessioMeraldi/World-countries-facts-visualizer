// export async function fetchCountryByName(name) {
//
//    const base = "https://restcountries.com/v3.1/name/";
//    const encoded = encodeURIComponent(name);
//    let res = "";
//
//    // Attempt 1: exact match (fullText=true)
//    try {
//        const resFull = await fetch(`${base}${encoded}?fullText=true`);
//        if (resFull.ok) {
//            const dataFull = await resFull.json();
//            return dataFull;
//        } else {
//            throw new Error("Could not find matching country");
//        }
//    } catch (err) {
//        console.log('Couldn\'t find a Country matching the exact name, attempting fallback solution - thrown '+err);
//        // ignores and goes on to the fallback
//    }

// Attempt 2: partial match (fallback solution)
/*
const res = await fetch(`${base}${encoded}`);
if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(res.statusText || text || "Country not found.");
}
*/

//    try {
//       const res = await fetch(`${base}${encoded}`);
//       if (!res.ok) {
//           const text = await res.text().catch(() => "");
//           throw new Error(res.statusText || text || "Country not found.");
//       }
//    } catch (err){
//        console.log('Couldn\'t find matching country even with teh fallback solution - thrown '+err);
//    }

//   return res.json();
//}

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
