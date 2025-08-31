const fs = require('fs');
const path = require('path');

console.log('🔧 Ottimizzazione foto per Render.com...');

// Verifica dimensioni directory foto
const photosDir = 'assets/images/anita/ricordi/';
let totalSize = 0;
let photoCount = 0;

try {
    const files = fs.readdirSync(photosDir);
    
    files.forEach(file => {
        if (/\.(jpg|jpeg|png|gif|heic)$/i.test(file)) {
            const filePath = path.join(photosDir, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
            photoCount++;
            
            // Log foto grandi (>500KB)
            if (stats.size > 500 * 1024) {
                console.log(`📸 Foto grande: ${file} - ${Math.round(stats.size / 1024)}KB`);
            }
        }
    });
    
    console.log(`\n📊 REPORT FOTO:`);
    console.log(`   Totale foto: ${photoCount}`);
    console.log(`   Dimensione totale: ${Math.round(totalSize / 1024 / 1024)}MB`);
    console.log(`   Dimensione media: ${Math.round(totalSize / photoCount / 1024)}KB per foto`);
    
    // Raccomandazioni per Render.com
    if (totalSize > 100 * 1024 * 1024) { // >100MB
        console.log(`\n⚠️  ATTENZIONE: Le foto sono troppo pesanti per Render.com (>100MB)`);
        console.log(`   Render.com ha limitazioni su repository grandi`);
        console.log(`   Raccomandazione: Usare sistema di fallback con foto esterne`);
    } else if (totalSize > 50 * 1024 * 1024) { // >50MB
        console.log(`\n💡 Le foto sono abbastanza pesanti (>50MB)`);
        console.log(`   Il deployment potrebbe essere lento`);
    } else {
        console.log(`\n✅ Dimensioni foto OK per Render.com`);
    }
    
    // Aggiorna la configurazione build
    const buildConfig = {
        photosFound: photoCount,
        totalSizeMB: Math.round(totalSize / 1024 / 1024),
        avgSizeKB: Math.round(totalSize / photoCount / 1024),
        renderCompatible: totalSize < 100 * 1024 * 1024,
        lastCheck: new Date().toISOString()
    };
    
    fs.writeFileSync('photo-build-report.json', JSON.stringify(buildConfig, null, 2));
    console.log(`\n📄 Report salvato in photo-build-report.json`);
    
} catch (error) {
    console.error('❌ Errore durante l\'analisi foto:', error.message);
    process.exit(1);
}

console.log('\n🎉 Analisi completata!');
