import {test} from 'node:test';
import assert from 'node:assert/strict';
import {detectEpisodes,episodeForDate} from '../public/episodes.js';
function fixture(){return {time:Array.from({length:44},(_,i)=>new Date(Date.UTC(2026,8,i+1)).toISOString().slice(0,10)),temperature_2m_max:Array(44).fill(24),temperature_2m_min:Array(44).fill(16),precipitation_sum:Array(44).fill(0)};}
function cool(d){for(let i=15;i<44;i++){d.temperature_2m_max[i]=18;d.temperature_2m_min[i]=10;}d.precipitation_sum[15]=15;return d;}
test('sustained wet cooling creates an episode, with a 10–15 day window',()=>{const e=detectEpisodes(cool(fixture()),'2026-09-29');assert.equal(e.length,1);assert.equal(e[0].date,'2026-09-16');assert.equal(episodeForDate(e,'2026-09-25'),null);assert.equal(episodeForDate(e,'2026-09-26').age,10);assert.equal(episodeForDate(e,'2026-10-01').age,15);assert.equal(episodeForDate(e,'2026-10-02'),null);});
test('warm rebound cancels the episode instead of rewarding any temperature drop',()=>{const d=cool(fixture());d.temperature_2m_max[17]=24;d.temperature_2m_min[17]=16;assert.equal(detectEpisodes(d,'2026-09-29').length,0);});
test('rain without temperature transition is not called a confirmed trigger',()=>{const d=fixture();d.precipitation_sum[15]=30;assert.equal(detectEpisodes(d,'2026-09-29').length,0);});
test('future modeled persistence is distinguished from past modeled weather',()=>{const e=detectEpisodes(cool(fixture()),'2026-09-17');assert.match(e[0].status,/prévu/);});
test('cold then mild wet conditions allow a warming episode',()=>{const d=fixture();d.temperature_2m_max.fill(8);d.temperature_2m_min.fill(2);for(let i=15;i<44;i++){d.temperature_2m_max[i]=15;d.temperature_2m_min[i]=7;}d.precipitation_sum[15]=12;assert.equal(detectEpisodes(d,'2026-09-29')[0].type,'Redoux pluvieux après froid');});
test('missing data do not establish persistence',()=>{const d=cool(fixture());d.temperature_2m_min[16]=null;assert.equal(detectEpisodes(d,'2026-09-29').length,0);});
