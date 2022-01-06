const XLSX = require('xlsx');
const _ = require('lodash');

const json =require('./mochawesome-report/mochawesome.json');

let tests = json.results[0].suites[0].suites[0].tests;

tests = tests.map(i => _.omit(i, ['code', 'context', 'uuid', 'parentUUID', 'isHook', 'skipped', 'speed', 'pass', 'fail', 'timedOut', 'duration', 'fullTitle', 'pending', 'err']))

const ws = XLSX.utils.json_to_sheet(tests);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'testreport');
XLSX.writeFile(wb, `testreport-${Date.now()}.xlsx`);