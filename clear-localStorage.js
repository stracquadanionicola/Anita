// Script per pulire il localStorage e ricaricare le foto corrette
// Da eseguire nella console del browser per risolvere i 404

(function() {
    console.log('🧹 Pulizia localStorage di Anita...');
    
    // Rimuovi tutti i dati del photobook
    localStorage.removeItem('photobook');
    localStorage.removeItem('anita-photos');
    localStorage.removeItem('photobook-memories');
    localStorage.removeItem('uploaded-photos');
    
    // Rimuovi qualsiasi altra chiave legata alle foto
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.includes('photo') || key.includes('anita') || key.includes('image')) {
            localStorage.removeItem(key);
            console.log('🗑️ Rimossa chiave:', key);
        }
    });
    
    console.log('✅ localStorage pulito!');
    console.log('🔄 Ricarica la pagina per vedere le foto aggiornate');
    
    // Ricarica automaticamente dopo 2 secondi
    setTimeout(() => {
        window.location.reload();
    }, 2000);
})();
