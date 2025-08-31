const fs = require('fs');

// Lista tutte le foto nella directory
const fotoDir = 'assets/images/anita/ricordi/';
const files = fs.readdirSync(fotoDir);
const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|gif|heic)$/i));

console.log('Trovate', imageFiles.length, 'foto');

// Genera metadata semplici
const metadata = imageFiles.map((filename, index) => {
  const titles = [
    'Momento Speciale', 'Ricordo Dolce', 'Attimo Magico', 'Istante Perfetto',
    'Emozione Pura', 'Sorriso Unico', 'Tempo Insieme', 'Felicità Condivisa'
  ];
  
  const descriptions = [
    'Ogni momento con te', 'Il nostro amore', 'Ricordi speciali', 'Tu ed io insieme',
    'Momenti magici', 'La nostra storia', 'Amore infinito', 'Dolci ricordi'
  ];
  
  const spanish = ['Te quiero mucho', 'Eres mi amor', 'Mi corazón'];
  
  return {
    filename,
    title: titles[index % titles.length],
    description: descriptions[index % descriptions.length],
    spanish: spanish[index % spanish.length]
  };
});

// Crea il file JavaScript
const jsContent = `// Album fotografico di Anita e Nicola - ${imageFiles.length} foto
const anitaPhotos = ${JSON.stringify(metadata, null, 2)};

console.log('📸 Album caricato:', anitaPhotos.length, 'foto');
`;

fs.writeFileSync('assets/js/anita-photos-clean.js', jsContent);
console.log('✅ Creato anita-photos-clean.js con', metadata.length, 'foto');
