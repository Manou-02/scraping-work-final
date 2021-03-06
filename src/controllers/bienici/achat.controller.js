const endpoint = require('../../utils/endpoints');
const initialisePage = require('../../utils/initialisePage');
const fs = require('fs');
// const finalUrl = require('../../../output/bienici/url/achat2.json');

const getAllUrlAchat = async () => {
    try{
        let allUrl = [];

        for (let i = 6; i < 9; i++) {
                       
            let url = endpoint.achatFrance.url +i;
            const page = await initialisePage(url);
    
            const urlAchat = await page.evaluate(() => {
                let data = [];
                let elements = document.querySelectorAll('article.sideListItem')
                for(element of elements){
                    data.push({
                        url : element.querySelector('.sideListItemContainer .detailsContainer .details a.detailedSheetLink').href
                    });
                }
                return data;
            })
            console.log(urlAchat);
            allUrl = [...allUrl, ...urlAchat];
            
        }
        return allUrl;
    }catch(err){
        console.error(`Erreur lors de la recuperation de tous les URL \n ${err}`)
    }

}

const donnee = {
    titre :"",
    addresse : "",
    prix: "",
    datePub : "",
    refAnnonce : "",
    description : "",
    details : [],
    aproposQuartier : ""
}

module.exports.getAllAchat = async (req, res, next) => {
    
    try{
        const dataFinal = [];
        const allUrl = await getAllUrlAchat();
        // const allUrl = await getAllUrlAchat();
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

                docs.titre = document.querySelector('.titleInside h1')?.textContent.split('m??')[0].concat(' m??');
                docs.addresse = document.querySelector('.titleInside h1')?.textContent.split('m??')[1];
                docs.type = "Achat";
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
        
        fs.writeFile('./output/bienici/donnee/achat3.json', JSON.stringify(dataFinal, null, 2), err => {
            if(err){
                console.log("=================================");
                console.log(`Erreur lors de l'ecriture du fichier JSON\n ${err}`);
                console.log("=================================");
            }else{
                console.log("=================================");
                console.log(`Success: Data recuperer`);
                console.log("=================================");
            }
        })
        res.json(dataFinal);
    }catch(err){
        console.log(`Erreur lors de la recuperation de tous les achats\n ${err}`);
    }
}