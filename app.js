const products=[
 {id:1,name:'Monstera',cat:'Plants',price:899,emoji:'🪴',bg:'#d8efdc'},
 {id:2,name:'Snake plant',cat:'Plants',price:549,emoji:'🌿',bg:'#e3f1d0'},
 {id:3,name:'Mini cactus',cat:'Plants',price:299,emoji:'🌵',bg:'#f6efc9'},
 {id:4,name:'Money plant',cat:'Plants',price:349,emoji:'🍃',bg:'#d3ecd9'},
 {id:5,name:'Clay pot, small',cat:'Pots',price:249,emoji:'🏺',bg:'#ffe0d5'},
 {id:6,name:'Hanging planter',cat:'Pots',price:599,emoji:'🧺',bg:'#e8e0f5'},
 {id:7,name:'Ceramic pot, white',cat:'Pots',price:749,emoji:'⚪',bg:'#e5eef5'},
 {id:8,name:'Watering can',cat:'Tools',price:449,emoji:'🚿',bg:'#d5e9f7'},
 {id:9,name:'Pruning shears',cat:'Tools',price:399,emoji:'✂️',bg:'#fde2e2'},
 {id:10,name:'Potting mix, 5 kg',cat:'Tools',price:199,emoji:'🌱',bg:'#e9e1d4'},
 {id:11,name:'Sunflower seeds',cat:'Seeds',price:99,emoji:'🌻',bg:'#fff1b8'},
 {id:12,name:'Herb seed kit',cat:'Seeds',price:349,emoji:'🌶️',bg:'#ffd9cf'}
];
const $=s=>document.querySelector(s);
const money=n=>'₹'+n.toLocaleString('en-IN');
let cart=JSON.parse(localStorage.getItem('leafy-cart')||'{}');
let cat='All',q='',sort='';

function renderFilters(){
  const cats=['All',...new Set(products.map(p=>p.cat))];
  $('#filters').innerHTML=cats.map(c=>`<button class="chip ${c===cat?'on':''}" data-c="${c}">${c}</button>`).join('');
}
function renderGrid(){
  let list=products.filter(p=>(cat==='All'||p.cat===cat)&&p.name.toLowerCase().includes(q));
  if(sort==='low')list.sort((a,b)=>a.price-b.price);
  if(sort==='high')list.sort((a,b)=>b.price-a.price);
  $('#grid').innerHTML=list.length?list.map(p=>`
   <article class="card">
     <div class="pic" style="background:${p.bg}">${p.emoji}</div>
     <h3>${p.name}</h3><div class="cat">${p.cat}</div>
     <div class="row"><span class="price">${money(p.price)}</span>
     <button class="add" data-id="${p.id}">Add to cart</button></div>
   </article>`).join(''):'<p class="empty">No products match your search. Try another word.</p>';
}
function renderCart(){
  const ids=Object.keys(cart);
  let total=0,count=0;
  $('#items').innerHTML=ids.length?ids.map(id=>{
    const p=products.find(x=>x.id==id),n=cart[id];total+=p.price*n;count+=n;
    return `<div class="item"><div class="t" style="background:${p.bg}">${p.emoji}</div>
      <div class="i"><div>${p.name}</div><small>${money(p.price)}</small></div>
      <div class="qty"><button data-d="-1" data-id="${id}" aria-label="Remove one">−</button>${n}
      <button data-d="1" data-id="${id}" aria-label="Add one">+</button></div></div>`}).join('')
    :'<p class="empty">Your cart is empty. Add a plant to get started.</p>';
  $('#total').textContent=money(total);
  $('#count').textContent=count;
  localStorage.setItem('leafy-cart',JSON.stringify(cart));
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function drawer(open){$('#drawer').classList.toggle('open',open);$('#overlay').classList.toggle('show',open)}
function change(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];renderCart()}

$('#filters').onclick=e=>{if(e.target.dataset.c){cat=e.target.dataset.c;renderFilters();renderGrid()}};
$('#search').oninput=e=>{q=e.target.value.toLowerCase().trim();renderGrid()};
$('#sort').onchange=e=>{sort=e.target.value;renderGrid()};
$('#grid').onclick=e=>{if(e.target.dataset.id){change(e.target.dataset.id,1);toast('Added to cart')}};
$('#items').onclick=e=>{if(e.target.dataset.d)change(e.target.dataset.id,+e.target.dataset.d)};
$('#cartBtn').onclick=()=>drawer(true);
$('#close').onclick=$('#overlay').onclick=()=>drawer(false);
document.onkeydown=e=>{if(e.key==='Escape')drawer(false)};
$('#checkout').onclick=()=>{
  if(!Object.keys(cart).length)return toast('Your cart is empty');
  cart={};renderCart();drawer(false);toast('Order placed. Thank you!');
};
renderFilters();renderGrid();renderCart();
