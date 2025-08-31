#!/usr/bin/env node

/**
 * Script di controllo per verificare che tutte le foto nel sistema esistano
 * e aggiornare automaticamente i metadati se necessario
 */

const fs = require('fs');
const path = require('path');

// Percorsi
const photosDir = './assets/images/anita/ricordi/';
const jsFile = './assets/js/anita-photos-real.js';

console.log('🔍 Controllo foto di Anita...\n');

// Leggi le foto fisiche presenti
const physicalPhotos = fs.readdirSync(photosDir)
    .filter(file => /\.(jpg|jpeg|png|gif|heic)$/i.test(file))
    .sort();

console.log(`📁 Foto fisiche trovate: ${physicalPhotos.length}`);

// Leggi il file JavaScript
const jsContent = fs.readFileSync(jsFile, 'utf8');
const anitaPhotosMatch = jsContent.match(/const anitaPhotos = (\[[\s\S]*?\]);/);

if (!anitaPhotosMatch) {
    console.log('❌ Errore: Non riesco a leggere anitaPhotos dal file JS');
    process.exit(1);
}

const metadataPhotos = JSON.parse(anitaPhotosMatch[1]);
console.log(`📝 Foto nei metadati: ${metadataPhotos.length}`);

// Verifica coerenza
const metadataFilenames = metadataPhotos.map(p => p.filename);
const missingPhotos = metadataFilenames.filter(filename => !physicalPhotos.includes(filename));
const extraPhotos = physicalPhotos.filter(filename => !metadataFilenames.includes(filename));

console.log('\n📊 RISULTATI:');

if (missingPhotos.length > 0) {
    console.log(`❌ ${missingPhotos.length} foto nei metadati ma mancanti fisicamente:`);
    missingPhotos.forEach(photo => console.log(`   - ${photo}`));
}

if (extraPhotos.length > 0) {
    console.log(`⚠️  ${extraPhotos.length} foto fisiche non nei metadati:`);
    extraPhotos.forEach(photo => console.log(`   - ${photo}`));
}

if (missingPhotos.length === 0 && extraPhotos.length === 0) {
    console.log('✅ Perfetto! Tutte le foto sono sincronizzate');
} else {
    console.log(`\n🔧 Aggiorno automaticamente i metadati...`);
    
    // Genera nuovi metadati solo per le foto esistenti
    const updatedMetadata = physicalPhotos.map((filename, index) => {
        const existing = metadataPhotos.find(p => p.filename === filename);
        if (existing) return existing;
        
        // Genera metadati per nuove foto
        const phrases = [
            'Ogni momento con te', 'Il nostro amore', 'Ricordi speciali', 'Tu ed io insieme',
            'Momenti magici', 'La nostra storia', 'Amore infinito', 'Dolci ricordi'
        ];
        
        const titles = [
            'Momento Speciale', 'Ricordo Dolce', 'Attimo Magico', 'Istante Perfetto'
        ];
        
        return {
            filename: filename,
            title: titles[index % titles.length],
            description: phrases[index % phrases.length],
            spanish: index % 3 === 0 ? 'Te quiero mucho' : index % 3 === 1 ? 'Eres mi amor' : 'Mi corazón'
        };
    });
    
    // Scrivi il nuovo file JS
    const newJsContent = `// Metadata delle foto di Anita - Aggiornato automaticamente
const anitaPhotos = ${JSON.stringify(updatedMetadata, null, 2)};

// Export per uso nel modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = anitaPhotos;
}
`;
    
    fs.writeFileSync(jsFile, newJsContent);
    console.log(`✅ Metadati aggiornati! Ora ${updatedMetadata.length} foto sincronizzate`);
}

console.log('\n🎉 Controllo completato!');
