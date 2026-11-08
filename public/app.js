'use strict';
// Illustrative sample records; this demo does not collect or persist customer data.
const transactions = [
  ['Maya Chen','Completed','Studio plan','Nov 8, 2026',129,'MC'],
  ['Oliver Park','Completed','Growth plan','Nov 8, 2026',249,'OP'],
  ['Amara Okafor','Pending','Studio plan','Nov 7, 2026',129,'AO'],
  ['Luca Moretti','Completed','Starter plan','Nov 7, 2026',49,'LM'],
  ['Sofia Reyes','Completed','Growth plan','Nov 6, 2026',249,'SR'],
  ['Elliot Brooks','Refunded','Starter plan','Nov 5, 2026',49,'EB'],
  ['Priya Nair','Completed','Studio plan','Nov 4, 2026',129,'PN'],
  ['Theo Laurent','Pending','Growth plan','Nov 3, 2026',249,'TL']
];
const periods = {
  week:{revenue:'$12,684.32',orders:'468',customers:'87',conversion:'3.84',growth:'14.2%',date:'Nov 2 – Nov 8, 2026',labels:['Nov 2','Nov 3','Nov 4','Nov 5','Nov 6','Nov 8'],scale:'1 .83'},
  month:{revenue:'$48,295.80',orders:'1,842',customers:'326',conversion:'3.62',growth:'12.8%',date:'Oct 10 – Nov 8, 2026',labels:['Oct 10','Oct 15','Oct 20','Oct 25','Oct 30','Nov 8'],scale:'1 1'},
  quarter:{revenue:'$138,726.45',orders:'5,263',customers:'914',conversion:'3.48',growth:'18.6%',date:'Aug 11 – Nov 8, 2026',labels:['Aug 11','Aug 29','Sep 16','Oct 4','Oct 22','Nov 8'],scale:'1 .92'}
};
const $ = id => document.getElementById(id);
let currentPeriod='month';
let currentView='overview';
const money = amount => amount.toLocaleString('en-US',{style:'currency',currency:'USD'});
function visibleTransactions(){
  const query=$('search').value.trim().toLowerCase();
  return transactions.filter(row=>row.slice(0,4).join(' ').toLowerCase().includes(query));
}
function renderRows(){
  const rows=visibleTransactions();
  $('rows').replaceChildren();
  for(const [index,row] of rows.entries()){
    const tr=document.createElement('tr');
    const customer=document.createElement('td');customer.className='customer';
    const avatar=document.createElement('span');avatar.className=`customer-avatar tone${index%4}`;avatar.textContent=row[5];
    customer.append(avatar,document.createTextNode(row[0]));tr.append(customer);
    const statusCell=document.createElement('td');
    const status=document.createElement('span');status.className=`status ${row[1].toLowerCase()}`;status.textContent=row[1];statusCell.append(status);tr.append(statusCell);
    for(const value of [row[2],row[3],money(row[4])]){const td=document.createElement('td');td.textContent=value;tr.append(td);}
    tr.lastElementChild.className='amount';$('rows').append(tr);
  }
  $('empty').hidden=rows.length>0;
  $('result-count').textContent=`Showing ${rows.length} of ${transactions.length} transactions`;
}
document.querySelectorAll('[data-period]').forEach(button=>button.addEventListener('click',()=>{
  currentPeriod=button.dataset.period;const data=periods[currentPeriod];
  document.querySelectorAll('[data-period]').forEach(item=>{item.classList.toggle('selected',item===button);item.setAttribute('aria-pressed',String(item===button));});
  for(const id of ['revenue','orders','customers']) $(id).textContent=data[id];
  $('conversion').textContent=data.conversion+'%';$('revenue-growth').textContent='↗ '+data.growth;
  $('sales-total').textContent=data.orders;
  const total=Number(data.orders.replaceAll(',',''));
  document.querySelectorAll('.channel-row small').forEach((el,index)=>el.textContent=Math.round(total*[.486,.324,.19][index]).toLocaleString('en-US'));
  $('date-range').textContent='◷  '+data.date;
  $('x-axis').replaceChildren(...data.labels.map(label=>{const span=document.createElement('span');span.textContent=label;return span;}));
  for(const id of ['area','line']){$(id).style.transformOrigin='center bottom';$(id).style.scale=data.scale;}
}));
const views={overview:['A clearer picture.','Here’s how your business is doing. Let’s make today count.'],analytics:['Every trend tells a story.','Explore the numbers behind your business.'],transactions:['The details that add up.','Explore and search your latest transactions.'],customers:['Meet your customers.','See the people behind your latest orders.']};
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  currentView=button.dataset.view;
  document.querySelectorAll('[data-view]').forEach(item=>{item.classList.toggle('active',item===button);if(item===button)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');});
  $('breadcrumb').textContent=currentView[0].toUpperCase()+currentView.slice(1);
  $('page-title').textContent=views[currentView][0];$('page-subtitle').textContent=views[currentView][1];
  document.title=$('breadcrumb').textContent+' · Fieldwork';
  $('overview-content').hidden=['transactions','customers'].includes(currentView);
  document.querySelector('.metrics').hidden=['transactions','customers'].includes(currentView);
  document.querySelector('.transactions').hidden=currentView==='analytics';
  $('table-title').textContent=currentView==='customers'?'Customers · 8':'Recent transactions · 8';
  $('table-description').textContent=currentView==='customers'?'Sample customers and their most recent purchases.':'The latest activity across your business.';
}));
$('search').addEventListener('input',renderRows);
let toastTimer;
$('export').addEventListener('click',()=>{
  const rows=visibleTransactions();
  const quote=value=>'"'+String(value).replaceAll('"','""')+'"';
  const content=[['Customer','Status','Product','Date','Amount (USD)'],...rows.map(row=>row.slice(0,5))].map(row=>row.map(quote).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8;'}));
  const link=document.createElement('a');link.href=url;link.download='fieldwork-sample-transactions.csv';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('toast').textContent=`Exported ${rows.length} sample transactions.`;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4000);
});
renderRows();
document.querySelector('[data-view="overview"]').setAttribute('aria-current','page');
document.querySelectorAll('[data-period]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.period===currentPeriod)));
