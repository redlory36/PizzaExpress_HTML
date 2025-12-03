// Selettori dei pulsanti
const btnGet = document.getElementById("button1");
const btnPut = document.getElementById("button2");
const btnPost = document.getElementById("button3");
const btnDelete = document.getElementById("button4");

const output = document.getElementById("output");


const apiURL = "http://localhost:5011/api/pizze";
// Funzione per mostrare i risultati
function showOutput(message, data = null) {
    function convert(value) {
        if (Array.isArray(value)) {
            return value.map(item => convert(item)).join("<br>");
        }
        else if (typeof value === "object" && value !== null) {
            return Object.entries(value)
                .map(([k, v]) => `${k}: ${convert(v)}`)
                .join("<br>");
        }
        else {
            return value;
        }
    }

    const text = data ? convert(data) : "";
    output.innerHTML = `<strong>${message}</strong><br>${text}`;
}



// GET
btnGet.addEventListener("click", async () => {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        showOutput("Menù della pizzeria:", data);
    } catch (error) {
        showOutput("Errore GET:", error);
    }
});
// PUT
btnPut.addEventListener("click", async () => {
    const idToModify = prompt("Inserisci l'ID della pizza da modificare:");
    if (!idToModify) {
        showOutput("Errore PUT:", "ID non valido!");
        return;
    }
    const field = "prezzo";
    const newValue = prompt(`Inserisci il nuovo valore per ${field}:`);
    if (!newValue) {
        showOutput("Errore PUT:", "Valore non valido!");
        return;
    }
    const newData = {};
    newData[field] = Number(newValue);
    try {
        const response = await fetch(`${apiURL}/${idToModify}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newData)
        });
        if (!response.ok) {
            throw new Error(`Errore PUT: ${response.status}`);
        }
        // --- Gestione risposta vuota ---
        let data = null;
        const text = await response.text();
        if (text) {
            data = JSON.parse(text); 
        }
        showOutput("Modifica eseguita con successo", data);
    } catch (error) {
        showOutput("Errore PUT:", error.message);
    }
});
// POST
btnPost.addEventListener("click", async () => {
    const newPizza = {
        id: prompt("inserire l'id della nuova pizza"),
        nome: prompt("inserire il nome"),
        prezzo: prompt("inserire il prezzo")
    };
    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPizza)
        });
        const data = await response.json();
        showOutput("Inserimento eseguito con successo", data);
    } catch (error) {
        showOutput("Errore POST:", error);
    }
});
// DELETE
btnDelete.addEventListener("click", async () => {
    const idToDelete = prompt("Inserire l'ID della pizza da eliminare");
    if (!idToDelete) {
        showOutput("Errore DELETE:", "Inserisci un ID valido!");
        return;
    }
    try {
        const response = await fetch(`${apiURL}/${idToDelete}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Errore nella DELETE: ${response.status}`);
        }
        const data = await response.text();
        showOutput(`Pizza eliminata con successo: ${idToDelete}`, data);
    } catch (error) {
        showOutput("Errore DELETE:", error.message);
    }
});
