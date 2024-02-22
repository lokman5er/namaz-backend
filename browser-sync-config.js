module.exports = {
    proxy: "localhost:3000", // Der Port, auf dem Ihr Express-Server läuft
    files: ["src/**/*.ts", "src/**/*.html"], // Überwachte Dateien, bei deren Änderung ein Reload erfolgen soll
    ignore: ["node_modules"], // Ignorierte Verzeichnisse
    port: 5000, // Port, auf dem BrowserSync läuft. Stellen Sie sicher, dass dies anders ist als der Ihres Express-Servers
    open: true, // Setzt, ob der Browser automatisch geöffnet werden soll
};
