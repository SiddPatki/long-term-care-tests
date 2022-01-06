const ltcList = Cypress.env('locationData');
const regionLinks = Cypress.env('regionLinks');
import frTranslation from '../fixtures/translation-fr.json';
import enTranslation from '../fixtures/translation-en.json';

/**
 * Location properties:
 * [
  'IQS Home Number',
  'Home Name',
  'Licensing Home Number',
  'Address1',
  'City',
  'Postal',
  'Phone',
  'Fax',
  'Email',
  'Website',
  'LHIN',
  'Home Administrator Admin First Name',
  'Admin Last Name',
  'Licensee',
  'Home Type (Sector)',
  'Licensed Beds',
  "Resident's Council",
  'Family Council',
  'Accreditation',
  'Home Designated Under French Language Services Act',
  'Home Profile Link',
  'Inspection Link',
  'X',
  'Y',
  'FID',
  'OGF_ID',
  'MOH_PRO_ID',
  'SERV_TYPE',
  'SERV_DET',
  'EN_NAME',
  'FR_NAME',
  'EN_ALT',
  'FR_ALT',
  'ADDRESS_1',
  'ADDRESS_2',
  'ADDR_DESCR',
  'COMMUNITY',
  'POSTALCODE',
  'GEO_UPT_DT',
  'EFF_DATE',
  'Year_Month',
  'LTC_Home',
  'LTC_Home_Number',
  'PHU',
  '1st_dose_percentage_staff_vaccination_rate',
  '2nd_dose_percentage_staff_vaccination_rate',
  'Home #',
  'Home Address',
  'Bed #',
  'Complaint',
  'Critical Incident System',
  'Director Order Follow Up',
  'Follow up',
  'Other',
  'Total'
]
 */

describe(`Tests for ${ltcList.length} Location Pages`, () => {
    ['en', 'fr'].forEach(lang => {
        context(`${lang}: `, () => {
        const translation = lang === 'en' ? enTranslation : frTranslation;
        ltcList.forEach((location, idx) => {
            context(`${idx + 1}) ${lang} ${location['Home Name']}: `, () => {
                const placementCoordinatorLink = lang === 'en' ? regionLinks[location['LHIN']]['placement_coordinator_EN'] : regionLinks[location['LHIN']]['placement_coordinator_FR'];
                const inspectionDate = lang === 'en' ? location['inspectionDate'] : location['inspectionDateFr'];
                const inspectionType = lang === 'en' ? location['InspectionType'] : frTranslation.location.lastInspection.types[location[['InspectionType']]];
                const inspectionLink =  lang === 'en' ? (location['Inspection Link'] || '') : (location['Inspection Link'] || '').replace('en-ca', 'fr-ca');
                const homeTypeText = location['Home Type (Sector)'] === 'For-Profit' ? translation.location.administrativeDetails.homeType.forProfit : translation.location.administrativeDetails.homeType.nonProfit;
                const waitText = getWaitTimeRange(location['maximum WT'], lang);

                before(() => {
                    cy.visit(lang === 'en' ? location.testUrl : location.testUrlFr);
                });
            
                it(`Heading should match location name: ${location['Home Name']}, ${translation.location.aboutHeading}`, () => {
                    cy.get('[class*=location-module--homeName]', { timeout:0 }).contains(location['Home Name']);
                    cy.get('#about').contains(translation.location.aboutHeading);
                });
            
                it(`Verifying Address 1, Address 2, City and postal: ${location['Address1']} ${location['Address2'] ? location['Address2'] : ''} ${location['Postal']} and Get directions`, () => {
                    cy.get('[class^=location-module--address]', { timeout:0 }).should('include.text', location['Address1']);
                    if(location['Address2']){
                        cy.get('[class^=location-module--address]', { timeout:0 }).should('include.text', location['Address2']);
                    }
                    cy.get('[class^=location-module--address]', { timeout:0 }).should('include.text', location['City']);
                    cy.get('[class^=location-module--address]', { timeout:0 }).should('include.text', location['Postal']);
    
                    cy.get('p:nth-child(3) > a', { timeout:0 }).should('have.attr', 'href')
                        //.and('include', location['Address1'].split(" ").join("+"))
                        //.and('include', location['City'].split(" ").join("+"))
                        .and('include', location['Postal']);
                    
                });
    
                it(`verifying placement coordinator link ${placementCoordinatorLink}`, () => {
                    cy.get('#exploreOptions', { timeout: 0 }).contains(translation.location.whereToStart.exploreOptionsLinkText);
                    cy.get('#exploreOptions > a', { timeout: 0 }).should('have.attr', 'href', translation.location.whereToStart.exploreOptionsHref);

                    cy.get('#choosingAnLTC', { timeout: 0 }).contains(translation.location.whereToStart.choosingAnLTCLinkText);
                    cy.get('#choosingAnLTC > a', { timeout: 0 }).should('have.attr', 'href', translation.location.whereToStart.choosingAnLTCHref);

                    cy.get('#applyingForLTC', { timeout: 0 }).contains(translation.location.whereToStart.applyingForLTCLinkText);
                    cy.get('#applyingForLTC > a', { timeout: 0 }).should('have.attr', 'href', translation.location.whereToStart.applyingForLTCHref);

                    cy.get('#livingInLTC', { timeout: 0 }).contains(translation.location.whereToStart.livingInLTCLinkText);
                    cy.get('#livingInLTC > a', { timeout: 0 }).should('have.attr', 'href', translation.location.whereToStart.livingInLTCHref);

                    cy.get('#payingForLTC', { timeout: 0 }).contains(translation.location.whereToStart.payingForLTCLinkText);
                    cy.get('#payingForLTC > a', { timeout: 0 }).should('have.attr', 'href', translation.location.whereToStart.payingForLTCHref);
                    
                    cy.get('#whereToStart header > p > a', { timeout: 0 }).should('have.attr', 'href', placementCoordinatorLink);
                    cy.get('#whereToStart header > p > a', { timeout: 0 }).should('have.attr', 'href', placementCoordinatorLink);
                })
            
                it(`Verifying beds: Should have ${location["Licensed Beds"]} beds`, () => {
                    if(lang === 'en'){
                        cy.get('#accordion-button-for-beds', { timeout:0 }).contains(location["Licensed Beds"]);
                    }else{
                        cy.get('#accordion-button-for-lits', { timeout:0 }).contains(location["Licensed Beds"]);
                    }
                    
                });
            
                it(`Verifying vaccination rates: ${location["2nd_dose_percentage_staff_vaccination_rate"] * 100}% and  ${location["1st_dose_percentage_staff_vaccination_rate"] * 100}%`, () => {
                    if(lang === 'en'){
                        cy.get('#accordion-button-for-fullyVaccinated > h3', { timeout:0 }).should('include.text', location["2nd_dose_percentage_staff_vaccination_rate"] * 100);
                        cy.get('#accordion-content-for-fullyVaccinated > p:nth-child(1)', { timeout:0 })
                            .should('include.text', `${location["2nd_dose_percentage_staff_vaccination_rate"] * 100}%`);
                        cy.get('#accordion-content-for-fullyVaccinated > p:nth-child(1)', { timeout:0 })
                            .should('include.text', `${location["1st_dose_percentage_staff_vaccination_rate"] * 100}%`);
                    }else{
                        cy.get('#accordion-button-for-entièrementVacciné > h3', { timeout:0 }).should('include.text', location["2nd_dose_percentage_staff_vaccination_rate"] * 100);
                        cy.get('#accordion-content-for-entièrementVacciné > p:nth-child(1)', { timeout:0 })
                            .should('include.text', `${location["2nd_dose_percentage_staff_vaccination_rate"] * 100}`);
                        cy.get('#accordion-content-for-entièrementVacciné > p:nth-child(1)', { timeout:0 })
                            .should('include.text', `${location["1st_dose_percentage_staff_vaccination_rate"] * 100}`);
                    }
                    
                });

                // it(`Verifying wait data: ${waitText}`, () => {
                //     cy.get('#waitTimes').contains(waitText);
                // });
    
                it(`Verifying inspection details: ${inspectionDate} and ${location['InspectionType'] ? inspectionType : ''} and inspection link ${inspectionLink}`, () => {
                    if(inspectionDate){
                        if(lang === 'en'){
                            cy.get('#accordion-content-for-lastInspection', { timeout:0 }).should('include.text', inspectionDate);
                        }else{
                            cy.get('#accordion-content-for-dernièreInspection', { timeout:0 }).should('include.text', inspectionDate);
                        }
                        
                    }

                    if(inspectionType && lang === 'en'){
                        cy.get('#accordion-content-for-lastInspection', { timeout:0 }).should('include.text', inspectionType);
                    }else if(inspectionType && lang === 'fr'){
                        cy.get('#accordion-content-for-dernièreInspection', { timeout:0 }).should('include.text',  inspectionType);
                    }

                    if(inspectionLink && lang === 'en'){
                        cy.get('#accordion-content-for-lastInspection > a', { timeout:0 }).should('have.attr', 'href', inspectionLink);
                    }else if(inspectionLink && lang === 'fr'){
                        cy.get('#accordion-content-for-dernièreInspection > a', { timeout:0 }).should('have.attr', 'href', inspectionLink);
                    }

                    
                });
    
                it(`Verifying ${translation.location.features.residentsCouncilLinkText} ${location["Resident's Council"] === "YES"}, ${translation.location.features.familyCouncilLinkText} ${location["Family Council"] === "YES"}, \n
                    ${translation.location.features.airConditioningCommonAreas} ${location['acCommonAreas']} and ${translation.location.features.airConditioningRooms} ${location['acRooms']}`, () => {
                        const elm = lang === 'en' ? '#accordion-content-for-features' : '#accordion-content-for-caractéristiques';
                    if(location["Resident's Council"] === "YES"){
                        cy.get(elm, { timeout:0 }).should('include.text', translation.location.features.residentsCouncilLinkText);
                    }
                    if(location["Family Council"] === "YES"){
                        cy.get(elm, { timeout:0 }).should('include.text', translation.location.features.familyCouncilLinkText);
                    }
    
                    if(location['acCommonAreas'] === 'Yes'){
                        cy.get(elm, { timeout:0 }).should('include.text', translation.location.features.airConditioningCommonAreas);
                    }else{
                        cy.get(elm, { timeout:0 }).should('not.include.text', translation.location.features.airConditioningCommonAreas)
                    }
                    if(location['acRooms']  === 'Yes'){
                        cy.get(elm, { timeout:0 }).should('include.text', translation.location.features.airConditioningRooms);
                    }else{
                        cy.get(elm, { timeout:0 }).should('not.include.text', translation.location.features.airConditioningRooms)
                    }
    
                });
            
                it(`Verifying Administrative details: ${homeTypeText}, ${location['Licensee']} and ${location['Home Administrator Admin First Name']} ${location['Admin Last Name']} `, () => {
                    if(lang === 'en'){
                        cy.get('#administrativeDetails', { timeout:0 }).contains(translation.location.administrativeDetails.heading);
                    }else{
                        cy.get('#détailsAdministratifs', { timeout:0 }).contains(translation.location.administrativeDetails.heading);
                    }
                    
                    cy.get('#homeType > span', { timeout:0 }).should('include.text', homeTypeText);
                    cy.get('#homeType > h4', { timeout:0 }).contains(translation.location.administrativeDetails.homeType.heading);
                    cy.get('#licensee > span', { timeout:0 }).should('include.text', location['Licensee']);
                    cy.get('#licensee', { timeout:0 }).contains(translation.location.administrativeDetails.licensee.heading);
                    cy.get('#homeAdministrator > span', { timeout:0 }).should('include.text', `${location['Home Administrator Admin First Name']} ${location['Admin Last Name']}`);
                    cy.get('#homeAdministrator', { timeout:0 }).contains(translation.location.administrativeDetails.homeAdministrator.heading);
                    if(location['Management Firm']){
                        cy.get('#managementFirm > span', { timeout:0 }).should('include.text', location['Management Firm']);
                        cy.get('#managementFirm', { timeout:0 }).contains(translation.location.administrativeDetails.managementFirm.heading);
                    }
                });
            
                it(`Verifying Contact details ${location['Phone']}, ${location['Email']} and ${location['Website'] && location['Website'] != '0' ? location['Website'] : ''}`, () => {
                    if(location['Phone']){
                        if(lang === 'en'){
                            cy.get('#contactPhone > a', { timeout:0 }).should('contain.text', ('1-' +location['Phone']).trimEnd().slice(0, 14));
                        }else{
                            cy.get('#contactPhone > a', { timeout:0 }).should('include.text', ('1 ' + location['Phone']).replace('-',' ').trim().slice(0, 14));
                        }
                    }
                    // if(location['Email'] && location['Email'] !='0'){
                    //     cy.get('#contactEmail > a', { timeout:0 }).should('include.text', location['Email']);
                        
                    // }
                    // cy.get('#contactEmail > a', { timeout:0 }).should('include.text', location['Email'])
                    if(location['Website'] && location['Website'] != '0' ){
                        cy.get('#contactWebsite > a', { timeout:0 }).should('have.attr' , 'href', location['Website']);
                    }else{
                        cy.get('#visit').should('not.include.text', lang === 'en' ? 'Visit this home’s website' : 'Visitez le site Web de ce foyer');
                    }
                    
                });

                it(`Verifying Cvoid data section`, () => {
                    cy.get('#covid19Data', { timeout:0 }).contains(translation.location.covid19Data.heading, { matchCase: false });
                    cy.get('#covid19Data a', { timeout:0 }).should('have.attr' , 'href', translation.location.covid19Data.linkHref);
                });
            
                it(`Verifying visit home details: ${location['Website']}`, () => {
                    if(location['Website'] && location['Website'] != '0' ){
                        cy.get('#visit > p > a:nth-child(1)', { timeout:0 }).should('have.attr' , 'href', location['Website']);
                    }
                });
            
                it(`Verifying Ready to apply details: ${lang === 'en' ? location['LHIN'] : translation.HCCSS[location['LHIN']]} and apply link ${placementCoordinatorLink}`, () => {

                    cy.get('#apply > p > strong > a', { timeout:0 }).should('have.attr' , 'href', placementCoordinatorLink);
                    cy.get('#apply > p > strong > a', { timeout:0 }).should('include.text', lang === 'en' ? location['LHIN'] : translation.HCCSS[location['LHIN']]);
                });
            });
        });
    });
    });
});

function getWaitTimeRange(days, lang){
    const isEnglish = lang === 'en';
    switch(days){
      case days > 365: return isEnglish ? 'More than 1 year' : 'More than 1 year';
      case days >= 273.75: return isEnglish ? '9 to 12 months' : '9 to 12 months';
      case days >= 182.5: return isEnglish ? '6 to 9 months' : '6 to 9 months';
      case days >= 91.2501: return isEnglish ? '3 to 6 months' : '3 to 6 months';
      default: return isEnglish ? '0 to 3 months' : '0 to 3 months';
    }
}