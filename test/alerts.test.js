import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildAlert,unsentAlerts} from '../public/alerts.js';
const place={id:'forest',name:'Ma forêt'};
const days=[{date:'2026-10-29',horizon:2,score:80},{date:'2026-10-28',horizon:1,score:65}];
test('alerts select earliest favorable window including tomorrow',()=>{assert.equal(buildAlert(place,days,'2026-10-27').date,'2026-10-28');});
test('low or missing signals do not trigger alerts',()=>{assert.equal(buildAlert(place,[],'2026-10-27'),null);assert.equal(buildAlert(place,[{...days[0],score:59}],'2026-10-27'),null);});
test('notification deduplication persists for the day and resets next day',()=>{const a=buildAlert(place,days,'2026-10-27'),b=buildAlert(place,days,'2026-10-28');assert.deepEqual(unsentAlerts([a,b],{[a.key]:1}),[b]);});
test('separate places have independent notification keys',()=>{assert.notEqual(buildAlert(place,days,'2026-10-27').key,buildAlert({...place,id:'other'},days,'2026-10-27').key);});
