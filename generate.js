const XLSX = require('xlsx');
const _ = require('lodash');

const json =require('./mochawesome-report/mochawesome.json');

let tests = (json.results[0].suites[0].suites[0].suites.map(i => i.tests.map(j => ({locationTitle: i.title, ...j})))).reduce((l, m) => [...l, ...m], []);
tests = tests.map(i => _.omit(i, ['code', 'context', 'uuid', 'parentUUID', 'isHook', 'skipped', 'speed', 'pass', 'fail', 'timedOut', 'duration', 'fullTitle', 'pending']))


const ws = XLSX.utils.json_to_sheet(tests);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'testreport');
XLSX.writeFile(wb, 'testreport.xlsx');