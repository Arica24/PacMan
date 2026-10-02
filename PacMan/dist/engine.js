export const MAZE=[
'###################',
'#o.......#.......o#',
'#.##.###.#.###.##.#',
'#.................#',
'#.##.#.#####.#.##.#',
'#....#...#...#....#',
'####.###.#.###.####',
'#....#.......#....#',
'#.##.#.## ##.#.##.#',
'#....#.#   #.#....#',
'#.##...#   #...##.#',
'#....#.#   #.#....#',
'#.##.#.#####.#.##.#',
'#....#.......#....#',
'####.#.#####.#.####',
'#........#........#',
'#.##.###.#.###.##.#',
'#o.#...........#.o#',
'##.#.#.#####.#.#.##',
'#....#...P...#....#',
'###################'];
export const DIRECTIONS={left:{x:-1,y:0},right:{x:1,y:0},up:{x:0,y:-1},down:{x:0,y:1}};
export function walkable(x,y){return MAZE[y]?.[x]!==undefined&&MAZE[y][x]!=='#';}
function entity(x,y,color){return {x,y,dir:'left',wanted:'left',progress:0,moving:false,color,grace:0};}
export function createGame(){const dots=new Map();MAZE.forEach((row,y)=>[...row].forEach((tile,x)=>{if(tile==='.'||tile==='o')dots.set(`${x},${y}`,tile);}));return {status:'ready',score:0,lives:3,dots,player:entity(9,19,'#ffeb00'),ghosts:[entity(9,9,'#ff224e'),entity(8,10,'#00ffcf'),entity(10,10,'#d544ff')],time:0,power:0,chain:0,immune:0,hitTimer:0,events:[],random:Math.random};}
export function start(game){game.status='running';return game;}
export function requestDirection(game,direction){if(!DIRECTIONS[direction]||!['running','hit'].includes(game.status))return false;const player=game.player;player.wanted=direction;const a=DIRECTIONS[player.dir],b=DIRECTIONS[direction];if(player.moving&&a.x===-b.x&&a.y===-b.y){player.x+=a.x;player.y+=a.y;player.progress=1-player.progress;player.dir=direction;}return true;}
export function pause(game){if(['running','hit'].includes(game.status)){game.beforePause=game.status;game.status='paused';return true;}return false;}
export function resume(game){if(game.status==='paused'){game.status=game.beforePause||'running';return true;}return false;}
export function position(entity){const direction=DIRECTIONS[entity.dir];return {x:entity.x+(entity.moving?direction.x*entity.progress:0),y:entity.y+(entity.moving?direction.y*entity.progress:0)};}
function available(e){return Object.entries(DIRECTIONS).filter(([name,d])=>walkable(e.x+d.x,e.y+d.y)).map(([name])=>name);}
function move(e,dt,speed,choose){if(!e.moving){const dir=choose(e);if(!dir)return;e.dir=dir;e.moving=true;}e.progress+=dt*speed;while(e.progress>=1){const d=DIRECTIONS[e.dir];e.x+=d.x;e.y+=d.y;e.progress-=1;const dir=choose(e);if(!dir){e.progress=0;e.moving=false;break;}e.dir=dir;}}
function playerChoice(e){const options=available(e);return options.includes(e.wanted)?e.wanted:options.includes(e.dir)?e.dir:null;}
function distances(target){const map=new Map([[`${target.x},${target.y}`,0]]),queue=[target];for(let head=0;head<queue.length;head++){const p=queue[head],distance=map.get(`${p.x},${p.y}`);for(const d of Object.values(DIRECTIONS)){const x=p.x+d.x,y=p.y+d.y,key=`${x},${y}`;if(walkable(x,y)&&!map.has(key)){map.set(key,distance+1);queue.push({x,y});}}}return map;}
function ghostChoice(game,e,index,map){let options=available(e);const old=DIRECTIONS[e.dir];const filtered=options.filter(name=>{const d=DIRECTIONS[name];return d.x!==-old.x||d.y!==-old.y;});if(filtered.length)options=filtered;if(game.random()<.16)return options[Math.floor(game.random()*options.length)];return options.sort((a,b)=>{const da=DIRECTIONS[a],db=DIRECTIONS[b];const va=map.get(`${e.x+da.x},${e.y+da.y}`)??999,vb=map.get(`${e.x+db.x},${e.y+db.y}`)??999;return game.power>0?vb-va:va-vb;})[0];}
function consume(game){const key=`${game.player.x},${game.player.y}`,tile=game.dots.get(key);if(!tile)return;game.dots.delete(key);game.score+=tile==='o'?50:10;if(tile==='o'){game.power=7;game.chain=0;game.events.push('power');}if(game.dots.size===0){game.status='won';game.events.push('won');}}
function resetActors(game){game.player=entity(9,19,'#ffeb00');game.ghosts=game.ghosts.map((g,i)=>entity(i===1?8:i===2?10:9,i===0?9:10,g.color));game.power=0;game.immune=2;}
export function tick(game,delta){game.events=[];if(!['running','hit'].includes(game.status))return;const duration=Math.max(0,Math.min(.1,delta));const steps=Math.max(1,Math.ceil(duration/.01)),dt=duration/steps;for(let i=0;i<steps;i++){
 if(game.status==='hit'){game.hitTimer-=dt;if(game.hitTimer<=0){if(game.lives===0){game.status='over';game.events.push('over');break;}resetActors(game);game.status='running';}continue;}
 if(game.status!=='running')break;game.time+=dt;game.power=Math.max(0,game.power-dt);game.immune=Math.max(0,game.immune-dt);consume(game);if(game.status!=='running')break;
 move(game.player,dt,5.7,playerChoice);consume(game);if(game.status!=='running')break;const target={x:game.player.x,y:game.player.y},targetKey=`${target.x},${target.y}`;if(game.pathKey!==targetKey){game.pathMap=distances(target);game.pathKey=targetKey;}const map=game.pathMap;
 for(let index=0;index<game.ghosts.length;index++){const ghost=game.ghosts[index];ghost.grace=Math.max(0,ghost.grace-dt);move(ghost,dt,game.power>0?3.1:4.0+index*.15,e=>ghostChoice(game,e,index,map));const a=position(game.player),b=position(ghost);if(ghost.grace>0||Math.hypot(a.x-b.x,a.y-b.y)>.65)continue;if(game.power>0){game.score+=200*Math.min(4,2**game.chain++);game.ghosts[index]=entity(9,10,ghost.color);game.ghosts[index].grace=1.5;game.events.push('ghost');}else if(game.immune<=0){game.lives--;game.status='hit';game.hitTimer=1.1;game.events.push('hit');break;}}
 }
}
export function getBest(storage){try{const v=Number(storage.getItem('dot-dash-best'));return Number.isFinite(v)&&v>=0?Math.floor(v):0;}catch{return 0;}}
export function saveBest(storage,score){const best=Math.max(score,getBest(storage));try{storage.setItem('dot-dash-best',String(best));}catch{}return best;}
