const endpoint = require('../../utils/endpoints');
const initialisePage = require('../../utils/initialisePage');
const fs = require('fs');

const getAllUrl = async () => {
    try{
        const url = endpoint.terrain.url;
        const page = initialisePage(url);

        const urlLocations = (await page).evaluate(() => {
            let data = [];
            let elements = document.querySelectorAll('article.sideListItem')
            for(element of elements){
                data.push({
                    url : element.querySelector('.sideListItemContainer .detailsContainer .details a.detailedSheetLink').href
                });
            }
            return data;
        })
        return urlLocations;
    }catch(err){
        console.error(`Erreur lors de la recuperation de tous les URL \n ${err}`)
    }
}


module.exports.getAllTerrain = async (req, res, next) => {
    try{
        const allUrl = await getAllUrl();
        const dataFinal = [];
        for(let i = 0; i < allUrl.length; i++){
            console.warn("URL : ", allUrl[i].url );
            const url = allUrl[i].url;
            const page = await initialisePage(url);
            let details = await page.evaluate(() => {
                const docs = {}

                /**
                 * Recupeartion de tous les details 
                 */

                const allInfo = document.querySelectorAll('.allDetails .labelInfo');
                const infos = []
                for(let info of allInfo){
                    infos.push(info.textContent)
                }
                /** Fin de la recuperation de tous les details */

                docs.titre = document.querySelector('.titleInside h1')?.textContent.split('m²')[0].concat(' m²');
                docs.addresse = document.querySelector('.titleInside h1')?.textContent.split('m²')[1];
                docs.type = "Achat terrain";
                docs.prix = document.querySelector('.itemPriceContainer .price .thePrice')?.textContent;
                docs.datePub = document.querySelector('.realEstateAdsMainInfo  span:first-child')?.textContent;
                docs.refAnnonce = document.querySelector('.realEstateAdsMainInfo  span:nth-child(3)')?.textContent;
                docs.description = document.querySelector('section.description .descriptionContent')?.textContent;
                docs.details = infos,
                docs.aproposQuartier = document.querySelector('section.neighborhoodSection .neighborhoodDescription')?.textContent.trim();

                console.log("donnee : ", docs.titre);
                return docs;
            })
            dataFinal.push(details)
        }

        fs.writeFile('./output/bienici/terrains.json', JSON.stringify(dataFinal, null, 2), err => {
            if(err){
                console.log("=================================");
                console.log(`Erreur lors de l'ecriture du fichier JSON\n ${err}`);
                console.log("=================================");
            }else{
                console.log("=================================");
                console.log(`Success`);
                console.log("=================================");
            }
        })
        res.json(dataFinal);
    }catch(err){
        console.log(`Erreur lors de la recuperation de tous les terrain \n ${err}`);
    }
} 
