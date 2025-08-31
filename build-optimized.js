const fs = require('fs');
const path = require('path');

console.log('🚀 Build ottimizzato per Render.com con sistema foto demo...');

// File essenziali per il funzionamento
const essentialFiles = [
    'index.html',
    'assets/js/demo-photos.js',        // Priorità alle foto demo
    'assets/js/anita-photos-clean.js', 
    'assets/js/photo-optimizer.js',
    'assets/js/wedding-album.js',
    'assets/css/style.css'
];

let buildSuccess = true;

// Verifica file essenziali
console.log('📋 Controllo file essenziali...');
for (const file of essentialFiles) {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.error(`❌ MANCANTE: ${file}`);
        buildSuccess = false;
    }
}

// Informazioni sulle foto locali (non blocca il build)
const photoDir = 'assets/images/anita/ricordi';
console.log('\n📸 Analisi foto...');

if (fs.existsSync(photoDir)) {
    try {
        const files = fs.readdirSync(photoDir);
        const photoFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|heic|webp)$/i));
        
        let totalSize = 0;
        for (const file of photoFiles) {
            const filePath = path.join(photoDir, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
        }
        
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);
        console.log(`📊 ${photoFiles.length} foto locali (${totalSizeMB}MB)`);
        
        if (totalSize > 50 * 1024 * 1024) { // 50MB soglia per Render
            console.log('🔄 Foto troppo grandi - sistema demo attivato automaticamente');
        } else {
            console.log('✅ Dimensioni foto accettabili');
        }
    } catch (error) {
        console.log('⚠️  Errore analisi foto:', error.message);
    }
} else {
    console.log('📁 Cartella foto non trovata - solo foto demo disponibili');
}

// Verifica foto demo
console.log('\n🌟 Controllo sistema foto demo...');
try {
    const demoContent = fs.readFileSync('assets/js/demo-photos.js', 'utf8');
    if (demoContent.includes('fallbackUrl') && demoContent.includes('picsum.photos')) {
        console.log('✅ Sistema foto demo configurato correttamente');
    } else {
        console.log('⚠️  Sistema foto demo potrebbe non essere configurato');
    }
} catch (error) {
    console.error('❌ Errore lettura demo-photos.js:', error.message);
    buildSuccess = false;
}

// Risultato finale
console.log('\n' + '='.repeat(50));
if (buildSuccess) {
    console.log('🎉 BUILD COMPLETATO CON SUCCESSO!');
    console.log('📱 Sistema demo pronto per Render.com');
    console.log('🔄 Fallback automatico per foto grandi');
    process.exit(0);
} else {
    console.log('❌ BUILD FALLITO - File essenziali mancanti');
    process.exit(1);
}
