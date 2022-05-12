const endpoint = require('../../utils/endpoints');
const initialisePage = require('../../utils/initialisePage');
require('events').EventEmitter.defaultMaxListeners = 3000;

const initialeData = {
    titre : "",
    prix : "",
    date : "",
    description :""
}


const getUrlDetails = async () => {
    const url = endpoint.locationFrance.url;
    try{
        const page = await initialisePage(url);
        
        const urlLocation = await page.evaluate(() => {
            let data = [];
            let elements = document.querySelectorAll("article.sideListItem");
            
            for(element of elements){

                data.push({
                    url : element.querySelector('.sideListItemContainer .detailsContainer .details a.detailedSheetLink').href,
                });
            }   
            return data;
        });
        return urlLocation;
    }catch(err){
        console.log(`Erreur lors de la recuperation des url \n${err}`);
    }
}

module.exports.getLocations = async (req, res, next) => {
    
    try{
        const data = await getUrlDetails();
        let response = [];
        data.forEach(async element => {
            let url = element.url;
            const page = await initialisePage(url);
    
            
            const details = await page.evaluate(() => {
                let donnee = [];
                let elements = document.querySelectorAll('.allDetails .labelInfo');
                for(element of elements){
                    donnee.push(element.textContent)
                }
                return donnee;
            }) 
            console.log(details);
            response.push(details);
        });
        res.json(response);
    }catch(err){
        console.log(`Erreur lors de get all locations`);
    }
}