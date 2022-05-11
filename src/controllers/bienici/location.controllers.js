const endpoint = require('../../utils/endpoints');
const initialisePage = require('../../utils/initialisePage');


const getDetailsLocation = async (data) => {

    await data.map(async response => {
        const url = response.url;
        let page = await initialisePage(url);

        const details = await page.evaluate(() => {
            let donnee = [];
            let elements = document.querySelectorAll('.allDetails .labelInfo');
            for(element of elements){
                donnee.push(element.textContent)
            }
            return donnee;
        }) 
        console.log(details);
        response.details = details;
    })
    console.log(data);
    return data;
} 

const getHomeLocation = async () => {
    const url = endpoint.locationFrance.url;
    try{
        const page = await initialisePage(url);
        
        const location = await page.evaluate(() => {
            let data = [];
            let elements = document.querySelectorAll("article.sideListItem");
            
            for(element of elements){
                data.push({
                    titre : element.querySelector('.detailsContainer  h3.descriptionTitle')?.textContent.split('m²')[0].concat(" m²"),
                    adresse : element.querySelector('.detailsContainer h3.descriptionTitle span')?.textContent,
                    prix : element.querySelector('.detailsContainer div.price span.thePrice')?.textContent,
                    prixDetail : element.querySelector('.detailsContainer div.price span.perMonth')?.textContent,
                    description : element.querySelector('.detailsContainer div.descriptionContent')?.textContent.split('\n').join(' '),
                    url : element.querySelector('.sideListItemContainer .detailsContainer .details a.detailedSheetLink').href,
                    details : []
                });
            }   
            // console.log(data);
            return data;
        });
        // console.log({data : location})
        return location;
    }catch(err){
        console.log(`Erreur lors de la recuperation des données \n${err}`);
    }
}


module.exports.getAllLocation = async (req, res, next) => {
    try{
        const homeLocation = await getHomeLocation();
        const detailsLocation = await getDetailsLocation(homeLocation);

        // console.log(detailsLocation);
        return res.json(detailsLocation);
    }catch(err){
        console.log(`Erreur in getAllLocatin \n${err}`);
        return res.send(err);
    }

} 