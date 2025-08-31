const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process for Render.com...');

try {
    // Check if Python is available
    try {
        const pythonVersion = execSync('python3 --version', { encoding: 'utf8' });
        console.log(`Python3 found: ${pythonVersion.trim()}`);
    } catch (e) {
        console.log('Python3 not found');
        process.exit(1);
    }

    // Check project structure
    if (fs.existsSync('index.html')) {
        console.log('index.html found');
    } else {
        console.log('index.html missing');
        process.exit(1);
    }

    // Count photos
    let photoCount = 0;
    try {
        const ricordiDir = 'assets/images/anita/ricordi/';
        if (fs.existsSync(ricordiDir)) {
            const files = fs.readdirSync(ricordiDir);
            photoCount = files.filter(file => 
                /\.(jpg|jpeg|png|gif|heic)$/i.test(file)
            ).length;
        }
    } catch (e) {
        console.log('Error counting photos:', e.message);
    }
    
    console.log(`Photos found: ${photoCount}`);
    
    if (photoCount < 20) {
        console.log('Few photos found, fallback system will be used');
    }

    // Check essential JavaScript files
    const requiredFiles = [
        'assets/js/wedding-album.js',
        'assets/js/anita-photos-clean.js', 
        'assets/js/demo-photos.js'
    ];

    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            console.log(`${path.basename(file)} found`);
        } else {
            console.log(`${path.basename(file)} missing`);
            process.exit(1);
        }
    }

    console.log('Build completed successfully!');
    console.log('Site is ready for deployment');

} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}
