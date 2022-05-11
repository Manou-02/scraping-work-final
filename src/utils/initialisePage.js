const puppeteer =  require('puppeteer');

async function initialisePage(url){
    try{
        const browser = await puppeteer.launch({
            "dumpio": true,
            "headless": true,
            "executablePath": '/usr/bin/chromium',
            "args": [
                '--disable-setuid-sandbox',
                '--no-sandbox',
                '--disable-gpu',
            ]
        })
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0); 

        await page.goto(url,{
            //effacer le timeout et atterndre jusqu'à la recuperation des données
            waitUntil : 'load',
            timeout : 0
        });

        return page;
        
    }catch(err){
        console.log(`Erreur lors de l'initialisation du page \n ${err}`);
    }
}

module.exports = initialisePage;