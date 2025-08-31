// Foto di demo per quando le foto originali non sono disponibili
const demoPhotos = [
    {
        filename: "demo1.jpg",
        title: "Il Nostro Amore",
        description: "Ogni momento con te",
        spanish: "Te quiero mucho",
        url: "https://picsum.photos/800/600?random=1"
    },
    {
        filename: "demo2.jpg", 
        title: "Momento Speciale",
        description: "Ricordi dolci",
        spanish: "Eres mi amor",
        url: "https://picsum.photos/800/600?random=2"
    },
    {
        filename: "demo3.jpg",
        title: "Attimo Magico",
        description: "La nostra storia",
        spanish: "Mi corazón",
        url: "https://picsum.photos/800/600?random=3"
    },
    {
        filename: "demo4.jpg",
        title: "Istante Perfetto",
        description: "Amore infinito",
        spanish: "Te quiero mucho",
        url: "https://picsum.photos/800/600?random=4"
    },
    {
        filename: "demo5.jpg",
        title: "Emozione Pura",
        description: "Dolci ricordi",
        spanish: "Eres mi amor",
        url: "https://picsum.photos/800/600?random=5"
    },
    {
        filename: "demo6.jpg",
        title: "Sorriso Unico",
        description: "Il nostro viaggio",
        spanish: "Mi corazón",
        url: "https://picsum.photos/800/600?random=6"
    },
    {
        filename: "demo7.jpg",
        title: "Tempo Insieme",
        description: "Emozioni uniche",
        spanish: "Te quiero mucho",
        url: "https://picsum.photos/800/600?random=7"
    },
    {
        filename: "demo8.jpg",
        title: "Felicità Condivisa",
        description: "Sorrisi condivisi",
        spanish: "Eres mi amor",
        url: "https://picsum.photos/800/600?random=8"
    },
    {
        filename: "demo9.jpg",
        title: "Cuori Uniti",
        description: "Tempo prezioso",
        spanish: "Mi corazón",
        url: "https://picsum.photos/800/600?random=9"
    },
    {
        filename: "demo10.jpg",
        title: "Attimi di Felicità",
        description: "Cuori uniti",
        spanish: "Te quiero mucho",
        url: "https://picsum.photos/800/600?random=10"
    },
    {
        filename: "demo11.jpg",
        title: "Il Nostro Mondo",
        description: "Attimi di felicità",
        spanish: "Eres mi amor",
        url: "https://picsum.photos/800/600?random=11"
    },
    {
        filename: "demo12.jpg",
        title: "Amore Puro",
        description: "Il nostro mondo",
        spanish: "Mi corazón",
        url: "https://picsum.photos/800/600?random=12"
    }
];

// Se anitaPhotos non è definito o vuoto, usa le foto demo
if (typeof anitaPhotos === 'undefined' || !Array.isArray(anitaPhotos) || anitaPhotos.length === 0) {
    console.log('📸 Caricando foto di demo per il deployment...');
    window.anitaPhotos = demoPhotos;
}
