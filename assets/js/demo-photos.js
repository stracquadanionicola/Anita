// Foto di demo per quando le foto originali non sono disponibili su Render.com
const demoPhotos = [
    {
        filename: "demo1.jpg",
        title: "Il Nostro Amore",
        description: "Ogni momento con te",
        spanish: "Te quiero mucho",
        fallbackUrl: "https://picsum.photos/800/600?random=1&nature"
    },
    {
        filename: "demo2.jpg", 
        title: "Momento Speciale",
        description: "Ricordi dolci",
        spanish: "Eres mi amor",
        fallbackUrl: "https://picsum.photos/800/600?random=2&love"
    },
    {
        filename: "demo3.jpg",
        title: "Attimo Magico",
        description: "La nostra storia",
        spanish: "Mi corazón",
        fallbackUrl: "https://picsum.photos/800/600?random=3&sunset"
    },
    {
        filename: "demo4.jpg",
        title: "Istante Perfetto",
        description: "Amore infinito",
        spanish: "Te quiero mucho",
        fallbackUrl: "https://picsum.photos/800/600?random=4&flowers"
    },
    {
        filename: "demo5.jpg",
        title: "Emozione Pura",
        description: "Dolci ricordi",
        spanish: "Eres mi amor",
        fallbackUrl: "https://picsum.photos/800/600?random=5&romantic"
    },
    {
        filename: "demo6.jpg",
        title: "Sorriso Unico",
        description: "Il nostro viaggio",
        spanish: "Mi corazón",
        fallbackUrl: "https://picsum.photos/800/600?random=6&beach"
    },
    {
        filename: "demo7.jpg",
        title: "Tempo Insieme",
        description: "Emozioni uniche",
        spanish: "Te quiero mucho",
        fallbackUrl: "https://picsum.photos/800/600?random=7&mountains"
    },
    {
        filename: "demo8.jpg",
        title: "Felicità Condivisa",
        description: "Sorrisi condivisi",
        spanish: "Eres mi amor",
        fallbackUrl: "https://picsum.photos/800/600?random=8&city"
    },
    {
        filename: "demo9.jpg",
        title: "Cuori Uniti",
        description: "Tempo prezioso",
        spanish: "Mi corazón",
        fallbackUrl: "https://picsum.photos/800/600?random=9&landscape"
    },
    {
        filename: "demo10.jpg",
        title: "Attimi di Felicità",
        description: "Cuori uniti",
        spanish: "Te quiero mucho",
        fallbackUrl: "https://picsum.photos/800/600?random=10&forest"
    },
    {
        filename: "demo11.jpg",
        title: "Il Nostro Mondo",
        description: "Attimi di felicità",
        spanish: "Eres mi amor",
        fallbackUrl: "https://picsum.photos/800/600?random=11&lake"
    },
    {
        filename: "demo12.jpg",
        title: "Amore Puro",
        description: "Il nostro mondo",
        spanish: "Mi corazón",
        fallbackUrl: "https://picsum.photos/800/600?random=12&garden"
    },
    {
        filename: "demo13.jpg",
        title: "Momenti Magici",
        description: "Amore puro",
        spanish: "Te amo con todo mi corazón",
        fallbackUrl: "https://picsum.photos/800/600?random=13&clouds"
    },
    {
        filename: "demo14.jpg",
        title: "Ricordi Indimenticabili",
        description: "La nostra felicità",
        spanish: "Eres mi vida",
        fallbackUrl: "https://picsum.photos/800/600?random=14&vintage"
    },
    {
        filename: "demo15.jpg",
        title: "Sogni Realizzati",
        description: "Insieme per sempre",
        spanish: "Para siempre juntos",
        fallbackUrl: "https://picsum.photos/800/600?random=15&dreams"
    }
];

// Forza l'uso delle foto demo su Render.com (ambiente di produzione)
const isRenderEnvironment = 
    typeof process !== 'undefined' && 
    (process.env.RENDER || process.env.NODE_ENV === 'production');

// Se su Render o se anitaPhotos non è definito/vuoto, usa le foto demo
if (isRenderEnvironment || typeof anitaPhotos === 'undefined' || !Array.isArray(anitaPhotos) || anitaPhotos.length === 0) {
    console.log('📸 Usando foto demo ottimizzate per deployment cloud...');
    window.anitaPhotos = demoPhotos;
    
    // Backup se la variabile globale non è stata impostata
    if (typeof anitaPhotos === 'undefined') {
        window.anitaPhotos = demoPhotos;
    }
}
