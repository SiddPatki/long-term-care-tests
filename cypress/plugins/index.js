/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const path = require('path');
const XLSX = require('xlsx');
const neatCSV = require('neat-csv');
const fs = require('fs');
const _ = require('lodash');
const dayjs = require('dayjs');
const localeFr = require('dayjs/locale/fr');


module.exports =  async (on, config) => {

  
  const ltcConsolidatedWB = fs.readFileSync(path.join(__dirname, '/../../data/', 'ltc_data_consolidated_20211220.csv'), 'utf8')
  const ltcConsolidated = await neatCSV(ltcConsolidatedWB);
  config.env.ltcConsolidated = ltcConsolidated;
  // return config;

  const homeLocationsWorkbook = XLSX.readFile(path.join(__dirname, '/../../data/', 'LTC Homes Locations.xls'));
  const homeLocations = XLSX.utils.sheet_to_json(homeLocationsWorkbook.Sheets[homeLocationsWorkbook.SheetNames[0]], {raw: false});

  const homeInspectionWorkbook = XLSX.readFile(path.join(__dirname, '/../../data/', 'Homes Inspection Details.xlsx'));
  const homeInspectionData = XLSX.utils.sheet_to_json(homeInspectionWorkbook.Sheets[homeInspectionWorkbook.SheetNames[0]], {raw: false});

  const linksWorkbook = XLSX.readFile(path.join(__dirname, '/../../data/', 'ltc-hccss-links.xlsx'));
  const linksData = XLSX.utils.sheet_to_json(linksWorkbook.Sheets[linksWorkbook.SheetNames[0]], {raw: false});

  const acWorkbook = XLSX.readFile(path.join(__dirname, '/../../data/', 'AC Data.xlsx'));
  const acData = XLSX.utils.sheet_to_json(acWorkbook.Sheets[acWorkbook.SheetNames[0]], {raw: false});

  const homeInspectionITWorkbook = XLSX.readFile(path.join(__dirname, '/../../data/', 'Inspection Data compiled by IT.xlsx'));
  const homeInspectionITData = XLSX.utils.sheet_to_json(homeInspectionITWorkbook.Sheets[homeInspectionITWorkbook.SheetNames[0]], {raw: false});

  const waitTimesWorkbook = XLSX.readFile(path.join(__dirname, '/../../data/', 'WL_WT_ByLTCHome.xlsx'));
  const waitTimes = XLSX.utils.sheet_to_json(waitTimesWorkbook.Sheets[waitTimesWorkbook.SheetNames[0]], {raw: false});

  const ltcImmunizationFile = fs.readFileSync(path.join(__dirname, '/../../data/', 'ltc_immunization_data.csv'), 'utf8')
  const ltcImmunizationData = await neatCSV(ltcImmunizationFile);

  const ltcGeoFile = fs.readFileSync(path.join(__dirname, '/../../data/', 'ltc_homes_ontario_geo.csv'), 'utf8')
  const ltcGeoData = await neatCSV(ltcGeoFile);



  let homeData = [];
  let homeObj = {};

  for(let location of homeLocations){ //.slice(0, 10)
    const homeNo = location['IQS Home Number'];
    const geo = _.findLast(ltcGeoData, (o) => o['MOH_PRO_ID'] == homeNo);
    const immuneData = _.findLast(ltcImmunizationData, (o) => o['LTC_Home_Number'] == homeNo ||  o['LTC_Home_Number'] == +('' + homeNo));
    const inspection = _.findLast(homeInspectionData, (o) => o['Home #'] == homeNo);
    const inspectionIT = _.findLast(homeInspectionITData, (o) => o['HomeNumber'] == homeNo);
    const acRecord = _.findLast(acData, (o) => o['home_id'] == homeNo);
    const waitData = _.findLast(waitTimes, (o) => o['LICENCE_NO'] == homeNo);
    

    const inspectionDate = inspectionIT && inspectionIT['InspectionDate'] ? dayjs(inspectionIT['InspectionDate']).format('MMMM D, YYYY') : '';
    const inspectionDateFr = inspectionIT && inspectionIT['InspectionDate'] ? dayjs(inspectionIT['InspectionDate']).locale(localeFr).format('D MMMM YYYY') : '';

    const inspectionLinkFr = inspectionIT && inspectionIT['DocumentLink'] ? inspectionIT['DocumentLink'].replaceAll('en-ca', 'fr-ca') : '';
    const inspectionLinkEn = inspectionIT && inspectionIT['DocumentLink'] ? inspectionIT['DocumentLink'] : '';
    
    let homeName = location['Home Name'];
    if(homeName[homeName.length - 1] === ")"){
      homeName[homeName.length - 1] = "-";
    }

    const testUrl = `https://stage.ontariogovernment.ca/locations/longtermcare/homes/${location['Licensing Home Number']}-${homeName.trim()
          .toLowerCase().replaceAll("(","")
          .replaceAll(")","")
          .replaceAll("'","-")
          .replaceAll(".","-")
          .replaceAll(" - ", " ")
          .replaceAll(" ", "-")}`
          .replaceAll("--","-")
          .replaceAll("---","-");

    const testUrlFr = `https://stage.ontariogovernment.ca/fr/locations/longtermcare/homes/${location['Licensing Home Number']}-${homeName.trim()
          .toLowerCase().replaceAll("(","")
          .replaceAll(")","")
          .replaceAll("'","-")
          .replaceAll(".","-")
          .replaceAll(" - ", " ")
          .replaceAll(" ", "-")}`
          .replaceAll("--","-")
          .replaceAll("---","-");

    

    let homeInfo = ({...location, ...geo, ...immuneData, ...inspection, testUrl, ...waitData, testUrlFr, ...inspectionIT, inspectionLinkFr, inspectionDateFr, inspectionLinkEn,
      inspectionDate, acCommonAreas: acRecord ? acRecord['Designated Cooling Areas'] : 'No', acRooms:  acRecord ?  acRecord['Resident Rooms'] : 'No' });
      homeData.push(homeInfo);
      homeObj[location['Home Name']] = homeInfo;
  }
  config.env.locationData = homeData;
  console.log(homeData);
  let regionLinks = {};
  for(let lData of linksData){
    regionLinks[lData['LHIN']] = lData;
  }
  config.env.regionLinks = regionLinks;



  return config
}

