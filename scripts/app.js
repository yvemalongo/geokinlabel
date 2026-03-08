(function() {
// ══════════════════════════════════════════════════════════
// DONNÉES
// ══════════════════════════════════════════════════════════
var DB = {
    "Gombe":{ leader:"M. Fabrice Ngoy",police:"+243 810 000 001",health:"+243 990 000 001",population:250000,house:42000,density:2100,schools:85,marches:12,sante:8,waterAccess:92,elecAccess:95,assainissement:78,routes:[75,15,10],prox:[{ico:"🏫",name:"Lycée Prince de Liège",dist:"300m",type:"Éducation"},{ico:"🏥",name:"Hôpital CMK",dist:"1.2km",type:"Santé"},{ico:"🏛️",name:"Palais de la Nation",dist:"850m",type:"Administratif"},{ico:"💧",name:"Réservoir REGIDESO",dist:"600m",type:"Infrastructure"}],status:"Priorité faible"},
    "Matete":{ leader:"Mme. Jeanine Kabedi",police:"+243 810 000 002",health:"+243 990 000 002",population:680000,house:98000,density:18500,schools:140,marches:22,sante:14,waterAccess:45,elecAccess:38,assainissement:25,routes:[25,20,55],prox:[{ico:"🏫",name:"E.P. 1 Matete",dist:"1.2km",type:"Éducation"},{ico:"🏥",name:"Centre de Santé Uzima",dist:"900m",type:"Santé"},{ico:"🛒",name:"Marché Central",dist:"400m",type:"Commerce"}],status:"Priorité haute"},
    "Kasa-Vubu":{ leader:"M. Théodore Mbungu",police:"+243 810 000 003",health:"+243 990 000 003",population:510000,house:72000,density:14200,schools:105,marches:18,sante:11,waterAccess:62,elecAccess:55,assainissement:40,routes:[40,30,30],prox:[{ico:"🏫",name:"Institut Kasa-Vubu",dist:"700m",type:"Éducation"},{ico:"🏥",name:"Clinique Ngaliema",dist:"2.1km",type:"Santé"},{ico:"🛒",name:"Marché Gambela",dist:"500m",type:"Commerce"}],status:"Priorité moyenne"},
    "Limete":{ leader:"M. Pascal Luzamba",police:"+243 810 000 004",health:"+243 990 000 004",population:420000,house:61000,density:8900,schools:90,marches:15,sante:9,waterAccess:70,elecAccess:68,assainissement:55,routes:[55,25,20],prox:[{ico:"🏫",name:"École Primaire Limete",dist:"500m",type:"Éducation"},{ico:"🏥",name:"Hôpital Biamba",dist:"1.8km",type:"Santé"},{ico:"🏭",name:"Zone Industrielle",dist:"900m",type:"Industrie"}],status:"Priorité faible"}
};

var SC = {"Priorité faible":"#3fb950","Priorité moyenne":"#d29922","Priorité haute":"#f85149"};

var ENTITIES = [
    {lon:15.315,lat:-4.305,ico:'🏥',name:'Hôpital CMK',cat:'sante',label:'Santé'},
    {lon:15.415,lat:-4.345,ico:'🏥',name:'Hôpital Biamba Marie Mutombo',cat:'sante',label:'Santé'},
    {lon:15.338,lat:-4.362,ico:'🏥',name:'Clinique Ngaliema',cat:'sante',label:'Santé'},
    {lon:15.370,lat:-4.403,ico:'🏥',name:'Centre de Santé Uzima',cat:'sante',label:'Santé'},
    {lon:15.298,lat:-4.345,ico:'🏥',name:'Dispensaire Gombe Nord',cat:'sante',label:'Santé'},
    {lon:15.355,lat:-4.390,ico:'💊',name:'Pharmacie Centrale Matete',cat:'sante',label:'Santé'},

    {lon:15.325,lat:-4.315,ico:'🏫',name:'Lycée Prince de Liège',cat:'education',label:'Éducation'},
    {lon:15.335,lat:-4.360,ico:'🏫',name:'Institut Kasa-Vubu',cat:'education',label:'Éducation'},
    {lon:15.360,lat:-4.398,ico:'🏫',name:'ISIPA Matete',cat:'education',label:'Éducation'},
    {lon:15.450,lat:-4.348,ico:'🏫',name:'École Primaire Limete',cat:'education',label:'Éducation'},
    {lon:15.302,lat:-4.340,ico:'🎓',name:'Université de Kinshasa (UNIKIN)',cat:'education',label:'Éducation'},
    {lon:15.320,lat:-4.375,ico:'🏫',name:'Institut Boboto',cat:'education',label:'Éducation'},

    {lon:15.308,lat:-4.310,ico:'🚨',name:'Commissariat Gombe',cat:'police',label:'Police'},
    {lon:15.350,lat:-4.415,ico:'🚨',name:'Commissariat Matete',cat:'police',label:'Police'},
    {lon:15.320,lat:-4.355,ico:'🚨',name:'Commissariat Kasa-Vubu',cat:'police',label:'Police'},
    {lon:15.440,lat:-4.350,ico:'🚨',name:'Commissariat Limete',cat:'police',label:'Police'},
    {lon:15.330,lat:-4.332,ico:'🪖',name:'Camp Kokolo',cat:'police',label:'Police'},

    {lon:15.370,lat:-4.405,ico:'🛒',name:'Marché Central Matete',cat:'commerce',label:'Commerce'},
    {lon:15.325,lat:-4.358,ico:'🛒',name:'Marché Gambela',cat:'commerce',label:'Commerce'},
    {lon:15.312,lat:-4.320,ico:'🛒',name:'Marché Gombe',cat:'commerce',label:'Commerce'},
    {lon:15.455,lat:-4.353,ico:'🛒',name:'Marché Limete',cat:'commerce',label:'Commerce'},
    {lon:15.295,lat:-4.360,ico:'🏪',name:'Galerie Présidentielle',cat:'commerce',label:'Commerce'},

    {lon:15.322,lat:-4.338,ico:'🚌',name:'Arrêt Bus Gombe Centre',cat:'transport',label:'Transport'},
    {lon:15.348,lat:-4.408,ico:'🚌',name:'Arrêt Bus Matete Marché',cat:'transport',label:'Transport'},
    {lon:15.332,lat:-4.367,ico:'🚌',name:'Arrêt Bus Kasa-Vubu',cat:'transport',label:'Transport'},
    {lon:15.420,lat:-4.342,ico:'🚌',name:'Arrêt Bus Limete',cat:'transport',label:'Transport'},
    {lon:15.345,lat:-4.352,ico:'🚉',name:'Gare Centrale de Kinshasa',cat:'transport',label:'Transport'},
    {lon:15.445,lat:-4.385,ico:'✈️',name:'Aéroport N\'Djili',cat:'transport',label:'Transport'},

    {lon:15.308,lat:-4.318,ico:'💧',name:'Réservoir REGIDESO Gombe',cat:'infra',label:'Infrastructure'},
    {lon:15.362,lat:-4.395,ico:'💧',name:'Château d\'eau Matete',cat:'infra',label:'Infrastructure'},
    {lon:15.295,lat:-4.348,ico:'⚡',name:'Centrale SNEL Gombe',cat:'infra',label:'Infrastructure'},
    {lon:15.460,lat:-4.355,ico:'🏭',name:'Zone Industrielle Limete',cat:'infra',label:'Infrastructure'},

    {lon:15.300,lat:-4.350,ico:'🏛️',name:'Mairie de Gombe',cat:'admin',label:'Administratif'},
    {lon:15.305,lat:-4.305,ico:'🏛️',name:'Palais de la Nation',cat:'admin',label:'Administratif'},
    {lon:15.315,lat:-4.312,ico:'🏛️',name:'Assemblée Nationale',cat:'admin',label:'Administratif'},
    {lon:15.310,lat:-4.318,ico:'🏛️',name:'Primature',cat:'admin',label:'Administratif'}
];

var HEAT_POINTS = [
    {lon:15.310,lat:-4.320,w:0.9,label:'Zone à risque élevé'},
    {lon:15.350,lat:-4.410,w:0.95,label:'Point chaud critique'},
    {lon:15.330,lat:-4.380,w:0.7,label:'Zone à risque modéré'},
    {lon:15.370,lat:-4.400,w:0.75,label:'Zone à risque'},
    {lon:15.325,lat:-4.405,w:0.85,label:'Point chaud élevé'},
    {lon:15.355,lat:-4.330,w:0.6,label:'Zone à surveiller'},
    {lon:15.315,lat:-4.355,w:0.8,label:'Zone à risque élevé'},
    {lon:15.340,lat:-4.345,w:0.65,label:'Zone à surveiller'},
    {lon:15.360,lat:-4.425,w:0.9,label:'Point chaud critique'},
    {lon:15.295,lat:-4.370,w:0.7,label:'Zone à risque'},
    {lon:15.405,lat:-4.340,w:0.55,label:'Zone à surveiller'},
    {lon:15.415,lat:-4.355,w:0.6,label:'Zone à surveiller'},
    {lon:15.345,lat:-4.395,w:0.8,label:'Zone à risque élevé'},
    {lon:15.385,lat:-4.415,w:0.7,label:'Zone à risque'}
];

var CATS = [
  {id:'sante',    label:'Santé',             ico:'🏥', color:'rgba(248,81,73,0.8)'},
  {id:'police',   label:'Police & Sécurité', ico:'🚨', color:'rgba(88,166,255,0.8)'},
  {id:'education',label:'Éducation',         ico:'🏫', color:'rgba(188,140,255,0.8)'},
  {id:'transport',label:'Transport',         ico:'🚌', color:'rgba(63,185,80,0.8)'},
  {id:'commerce', label:'Commerce',          ico:'🛒', color:'rgba(209,154,102,0.8)'},
  {id:'admin',    label:'Administratif',     ico:'🏛', color:'rgba(88,166,255,0.6)'},
  {id:'infra',    label:'Infrastructure',    ico:'⚙', color:'rgba(100,180,100,0.8)'},
  {id:'hotspot',  label:'Points Chauds',     ico:'⚠', color:'rgba(248,81,73,0.9)'}
];

var KBOUNDS = {minLon:15.18,maxLon:15.58,minLat:-4.55,maxLat:-4.18};
function inKinshasa(lon,lat){return lon>=KBOUNDS.minLon&&lon<=KBOUNDS.maxLon&&lat>=KBOUNDS.minLat&&lat<=KBOUNDS.maxLat;}

// ══════════════════════════════════════════════════════════
// COUCHES CARTE
// ══════════════════════════════════════════════════════════
var osmSrc   = new ol.source.OSM();
var satSrc   = new ol.source.XYZ({
  url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attributions:'© Esri'
});
var darkSrc  = new ol.source.XYZ({
  url:'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
  attributions:'© CartoDB'
});

var osmLayer  = new ol.layer.Tile({source:osmSrc,visible:true});
var satLayer  = new ol.layer.Tile({source:satSrc,visible:false});
var darkLayer = new ol.layer.Tile({source:darkSrc,visible:false});

// Communes
var commFeats = new ol.format.GeoJSON().readFeatures(
  {
    type:"FeatureCollection",
    features:[
      {type:"Feature",properties:{name:"Gombe"},geometry:{type:"Polygon",coordinates:[[[15.290,-4.335],[15.370,-4.335],[15.370,-4.285],[15.290,-4.285],[15.290,-4.335]]]}},
      {type:"Feature",properties:{name:"Matete"},geometry:{type:"Polygon",coordinates:[[[15.320,-4.445],[15.420,-4.445],[15.420,-4.375],[15.320,-4.375],[15.320,-4.445]]]}},
      {type:"Feature",properties:{name:"Kasa-Vubu"},geometry:{type:"Polygon",coordinates:[[[15.295,-4.380],[15.345,-4.380],[15.345,-4.330],[15.295,-4.330],[15.295,-4.380]]]}},
      {type:"Feature",properties:{name:"Limete"},geometry:{type:"Polygon",coordinates:[[[15.400,-4.380],[15.500,-4.380],[15.500,-4.320],[15.400,-4.320],[15.400,-4.380]]]}}
    ]
  },
  {featureProjection:'EPSG:3857'}
);

function commStyle(f,sel){
  var d=DB[f.get('name')], c=d?SC[d.status]:'#58a6ff';
  return new ol.style.Style({
    stroke:new ol.style.Stroke({color:sel?'#fff':c,width:sel?3:2}),
    fill:new ol.style.Fill({color:sel?'rgba(255,255,255,.12)':(c+'28')})
  });
}

var commSrc   = new ol.source.Vector({features:commFeats});
var commLayer = new ol.layer.Vector({
  source:commSrc,
  style:function(f){return commStyle(f,false);},
  visible:true
});

// Heatmap
var heatFeats = HEAT_POINTS.map(function(p){
  var f=new ol.Feature({geometry:new ol.geom.Point(ol.proj.fromLonLat([p.lon,p.lat]))});
  f.set('weight',p.w);
  return f;
});
var heatLayer = new ol.layer.Heatmap({
  source:new ol.source.Vector({features:heatFeats}),
  blur:22,
  radius:16,
  visible:false,
  weight:function(f){return f.get('weight')||.5;}
});

// POI
var poiFeats = ENTITIES.map(function(e){
  var f=new ol.Feature({geometry:new ol.geom.Point(ol.proj.fromLonLat([e.lon,e.lat]))});
  f.set('lbl',e.ico);
  f.set('name',e.name);
  f.set('type',e.label);
  f.set('cat',e.cat);
  return f;
});
var poiLayer = new ol.layer.Vector({
  source:new ol.source.Vector({features:poiFeats}),
  style:function(f){
    return new ol.style.Style({
      image:new ol.style.Circle({
        radius:7,
        fill:new ol.style.Fill({color:'rgba(88,166,255,.8)'}),
        stroke:new ol.style.Stroke({color:'#0d1117',width:2})
      }),
      text:new ol.style.Text({
        text:f.get('lbl'),
        font:'bold 13px sans-serif',
        offsetY:-16,
        fill:new ol.style.Fill({color:'#fff'})
      })
    });
  },
  visible:false
});

// Radar + GPS layers
var radarSrc  = new ol.source.Vector();
var radarLayer= new ol.layer.Vector({
  source:radarSrc,
  zIndex:10,
  style:function(f){
    var t=f.get('t');
    if(t==='circle') return new ol.style.Style({
      stroke:new ol.style.Stroke({color:'rgba(240,136,62,.9)',width:2.5,lineDash:[8,5]}),
      fill:new ol.style.Fill({color:'rgba(240,136,62,.07)'})
    });
    if(t==='center') return new ol.style.Style({
      image:new ol.style.Circle({
        radius:8,
        fill:new ol.style.Fill({color:'rgba(240,136,62,.9)'}),
        stroke:new ol.style.Stroke({color:'#0d1117',width:2.5})
      })
    });
    if(t==='entity') return new ol.style.Style({
      image:new ol.style.Circle({
        radius:9,
        fill:new ol.style.Fill({color:f.get('col')||'rgba(88,166,255,.85)'}),
        stroke:new ol.style.Stroke({color:'#0d1117',width:2})
      }),
      text:new ol.style.Text({
        text:f.get('ico'),
        font:'bold 12px sans-serif',
        offsetY:-18,
        fill:new ol.style.Fill({color:'#fff'}),
        stroke:new ol.style.Stroke({color:'#0d1117',width:3})
      })
    });
    if(t==='hot') return new ol.style.Style({
      image:new ol.style.Circle({
        radius:10,
        fill:new ol.style.Fill({color:'rgba(248,81,73,.8)'}),
        stroke:new ol.style.Stroke({color:'#fff',width:2})
      }),
      text:new ol.style.Text({
        text:'⚠',
        font:'bold 13px sans-serif',
        offsetY:-18,
        fill:new ol.style.Fill({color:'#fff'}),
        stroke:new ol.style.Stroke({color:'#0d1117',width:3})
      })
    });
  }
});

var gpsSrc   = new ol.source.Vector();
var gpsLayer = new ol.layer.Vector({
  source:gpsSrc,
  zIndex:50,
  style:function(f){
    if(f.get('t')==='acc'){
      return new ol.style.Style({
        stroke:new ol.style.Stroke({color:'rgba(63,185,80,.5)',width:1.5}),
        fill:new ol.style.Fill({color:'rgba(63,185,80,.07)'})
      });
    }
    return new ol.style.Style({
      image:new ol.style.Circle({
        radius:10,
        fill:new ol.style.Fill({color:'rgba(63,185,80,.9)'}),
        stroke:new ol.style.Stroke({color:'#fff',width:3})
      })
    });
  }
});

var map = new ol.Map({
  target:'map',
  layers:[osmLayer,satLayer,darkLayer,heatLayer,commLayer,poiLayer,gpsLayer,radarLayer],
  view:new ol.View({center:ol.proj.fromLonLat([15.355,-4.360]),zoom:12})
});

// ══════════════════════════════════════════════════════════
// CHARTS
// ══════════════════════════════════════════════════════════
Chart.defaults.color='#8b949e';
Chart.defaults.borderColor='#30363d';

var cR=null,cI=null;

function buildCharts(db){
  var e1=document.getElementById('ch-r');
  var e2=document.getElementById('ch-i');
  if(!e1||!e2) return;

  if(cR){cR.destroy();cR=null;}
  if(cI){cI.destroy();cI=null;}

  cR=new Chart(e1.getContext('2d'),{
    type:'doughnut',
    data:{
      labels:['Asphalté','Réhab.','Impratic.'],
      datasets:[{
        data:db.routes,
        backgroundColor:['#3fb950','#d29922','#f85149'],
        borderWidth:0,
        hoverOffset:4
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      cutout:'70%',
      plugins:{legend:{position:'bottom',labels:{font:{size:10},boxWidth:10,padding:6}}}
    }
  });

  cI=new Chart(e2.getContext('2d'),{
    type:'bar',
    data:{
      labels:['Écoles','Marchés','Ctrs Santé'],
      datasets:[{
        data:[db.schools,db.marches,db.sante],
        backgroundColor:['rgba(88,166,255,.7)','rgba(188,140,255,.7)','rgba(63,185,80,.7)'],
        borderRadius:4,
        borderWidth:0
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      scales:{
        y:{beginAtZero:true,grid:{color:'rgba(48,54,61,.8)'}},
        x:{grid:{display:false}}
      },
      plugins:{legend:{display:false}}
    }
  });
}

// ══════════════════════════════════════════════════════════
// SIDEBAR COMMUNE
// ══════════════════════════════════════════════════════════
function pc(v){return v>=70?'var(--green)':v>=50?'var(--yellow)':'var(--red)';}

function renderSB(name,db){
  document.getElementById('sb-name').textContent=name;
  document.getElementById('sb-sub').textContent='Commune · '+db.population.toLocaleString()+' hab.';
  var sc=SC[db.status]||'#8b949e';

  document.getElementById('sb-body').innerHTML=
    '<div class="sec"><div class="sec-t">Vue d\'ensemble</div>'+
    '<div class="kbig">'+(db.population/1000).toFixed(0)+'<span style="font-size:.95rem;color:var(--muted)">k hab.</span></div>'+
    '<div class="kbig-l">Population totale</div>'+
    '<div class="kg">'+
      '<div class="kb"><div class="kbl">Ménages</div><div class="kbv">'+(db.house/1000).toFixed(0)+'k</div></div>'+
      '<div class="kb"><div class="kbl">Densité/km²</div><div class="kbv">'+db.density.toLocaleString()+'</div></div>'+
      '<div class="kb"><div class="kbl">Priorité</div><div class="kbv" style="color:'+sc+';font-size:.78rem">'+db.status.replace('Priorité ','')+'</div></div>'+
    '</div></div>'+

    '<div class="sec"><div class="sec-t">Responsable & Secours</div>'+
    '<div class="cbox"><div class="av">👤</div><div><div class="ct-r">Bourgmestre</div><div class="ct-n">'+db.leader+'</div></div></div>'+
    '<div class="eg">'+
      '<a href="tel:'+db.police+'" class="eb ep"><span style="font-size:.95rem">🚨</span><span><span class="el">Police</span>'+db.police+'</span></a>'+
      '<a href="tel:'+db.health+'" class="eb eh"><span style="font-size:.95rem">🚑</span><span><span class="el">Urgence</span>'+db.health+'</span></a>'+
    '</div></div>'+

    '<div class="sec"><div class="sec-t">Services de base</div>'+
    '<div class="pg"><div class="ph"><span>💧 Eau potable</span><span class="pp" style="color:'+pc(db.waterAccess)+'">'+db.waterAccess+'%</span></div><div class="pt"><div class="pf fb" id="pw"></div></div></div>'+
    '<div class="pg"><div class="ph"><span>⚡ Électricité</span><span class="pp" style="color:'+pc(db.elecAccess)+'">'+db.elecAccess+'%</span></div><div class="pt"><div class="pf fy" id="pe"></div></div></div>'+
    '<div class="pg"><div class="ph"><span>🗑️ Assainissement</span><span class="pp" style="color:'+pc(db.assainissement)+'">'+db.assainissement+'%</span></div><div class="pt"><div class="pf fg" id="pa"></div></div></div>'+
    '</div>'+

    '<div class="sec"><div class="sec-t">Réseau routier</div><div class="cw"><canvas id="ch-r"></canvas></div></div>'+
    '<div class="sec"><div class="sec-t">Infrastructures</div><div class="cw"><canvas id="ch-i"></canvas></div></div>'+

    '<div class="sec"><div class="sec-t">Services proches</div>'+
    db.prox.map(function(p){
      return '<div class="pi"><span style="font-size:1rem">'+p.ico+'</span><span style="flex:1">'+p.name+'<span class="pt2">'+p.type+'</span></span><span class="pd">'+p.dist+'</span></div>';
    }).join('')+
    '</div>';

  requestAnimationFrame(function(){
    buildCharts(db);
    setTimeout(function(){
      var pw=document.getElementById('pw'),
          pe=document.getElementById('pe'),
          pa=document.getElementById('pa');
      if(pw)pw.style.width=db.waterAccess+'%';
      if(pe)pe.style.width=db.elecAccess+'%';
      if(pa)pa.style.width=db.assainissement+'%';
    },80);
  });
}

// ══════════════════════════════════════════════════════════
// RAYON — UTILITAIRES
// ══════════════════════════════════════════════════════════
var radarMode=false, radarRadius=500, lastCenter=null, lastSource='click';
var gpsWatchId=null, userPos=null;

function haversine(lon1,lat1,lon2,lat2){
  var R=6371000,
      dLat=(lat2-lat1)*Math.PI/180,
      dLon=(lon2-lon1)*Math.PI/180;
  var a=Math.sin(dLat/2)*Math.sin(dLat/2)+
        Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
        Math.sin(dLon/2)*Math.sin(dLon/2);
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function fmtD(m){return m<1000?Math.round(m)+'m':(m/1000).toFixed(1)+'km';}
function dcls(m){return m<300?'dn':m<700?'dm':'df';}

function drawCircle(c3857,r){
  radarSrc.clear();
  var ll=ol.proj.toLonLat(c3857), lon=ll[0], lat=ll[1], pts=[], N=64;
  for(var i=0;i<=N;i++){
    var a=(i/N)*2*Math.PI;
    pts.push(ol.proj.fromLonLat([
      lon+(r/(111320*Math.cos(lat*Math.PI/180)))*Math.cos(a),
      lat+(r/110540)*Math.sin(a)
    ]));
  }
  var cf=new ol.Feature({geometry:new ol.geom.Polygon([pts])});
  cf.set('t','circle');
  radarSrc.addFeature(cf);

  var pf=new ol.Feature({geometry:new ol.geom.Point(c3857)});
  pf.set('t','center');
  radarSrc.addFeature(pf);
}

function analyze(c3857,r){
  var ll=ol.proj.toLonLat(c3857), cLon=ll[0], cLat=ll[1];
  var found={};
  CATS.forEach(function(c){found[c.id]=[];});

  ENTITIES.forEach(function(e){
    var d=haversine(cLon,cLat,e.lon,e.lat);
    if(d<=r){
      var cat=CATS.find(function(c){return c.id===e.cat;});
      found[e.cat].push({ico:e.ico,name:e.name,dist:d,label:e.label,col:cat.color});
      var f=new ol.Feature({geometry:new ol.geom.Point(ol.proj.fromLonLat([e.lon,e.lat]))});
      f.set('t','entity');
      f.set('ico',e.ico);
      f.set('col',cat.color);
      radarSrc.addFeature(f);
    }
  });

  HEAT_POINTS.forEach(function(p){
    var d=haversine(cLon,cLat,p.lon,p.lat);
    if(d<=r){
      found['hotspot'].push({ico:'⚠',name:p.label,dist:d,label:'Point chaud',w:p.w,danger:true});
      var f=new ol.Feature({geometry:new ol.geom.Point(ol.proj.fromLonLat([p.lon,p.lat]))});
      f.set('t','hot');
      radarSrc.addFeature(f);
    }
  });

  Object.keys(found).forEach(function(k){found[k].sort(function(a,b){return a.dist-b.dist;});});

  var tot=0;
  Object.keys(found).forEach(function(k){tot+=found[k].length;});

  document.getElementById('rs-total').textContent=tot;
  document.getElementById('rs-sante').textContent=found['sante'].length;
  document.getElementById('rs-edu').textContent=found['education'].length;
  document.getElementById('rs-danger').textContent=found['hotspot'].length;
  document.getElementById('radar-stats').style.display='grid';

  var rl=r>=1000?(r/1000).toFixed(1)+'km':r+'m';
  var badge='<span class="src-badge '+(lastSource==='gps'?'sb-g':'sb-c')+'">'+(lastSource==='gps'?'📍 GPS':'🖱 Clic')+'</span>';
  document.getElementById('rp-sub').innerHTML=tot+' entité'+(tot>1?'s':'')+' dans '+rl+badge;

  var html='';
  CATS.forEach(function(cat){
    var items=found[cat.id], open=items.length>0;
    html+='<div class="radar-cat"><div class="cat-header'+(open?' cat-open':'')+' " onclick="toggleCat(this)">';
    html+='<span class="cat-ico">'+cat.ico+'</span><span class="cat-name">'+cat.label+'</span>';
    html+='<span class="cat-count">'+items.length+'</span><span class="cat-arrow">&#9654;</span></div>';
    html+='<div class="cat-items" style="display:'+(open?'block':'none')+'">';

    if(!items.length){
      html+='<div class="ec">Aucune entité dans ce rayon</div>';
    } else {
      items.forEach(function(it){
        html+='<div class="ri'+(it.danger?' ri-hot':'')+'">';
        html+='<span class="ri-ico">'+it.ico+'</span><span style="flex:1"><span class="ri-name">'+it.name+'</span><span class="ri-type">'+it.label+(it.danger?' · Gravité '+(it.w*5).toFixed(0)+'/5':'')+'</span></span>';
        html+='<span class="ri-dist '+dcls(it.dist)+'">'+fmtD(it.dist)+'</span>';
        if(it.danger&&it.w>=.8)html+='<span class="hbadge">Critique</span>';
        html+='</div>';
      });
    }

    html+='</div></div>';
  });

  document.getElementById('radar-results').innerHTML=html;
  document.getElementById('radar-panel').classList.add('open');
  document.getElementById('lp').style.display='none';
}

// ══════════════════════════════════════════════════════════
// GPS
// ══════════════════════════════════════════════════════════
function locateMe(){
  if(!navigator.geolocation){toast('❌ GPS non supporté');return;}
  var btn=document.getElementById('btn-gps');
  btn.classList.add('locating');
  btn.textContent='⏳ Localisation…';
  toast('📡 Recherche de votre position…');

  navigator.geolocation.getCurrentPosition(
    function(pos){
      var lon=pos.coords.longitude, lat=pos.coords.latitude, acc=pos.coords.accuracy;
      btn.classList.remove('locating');

      var horsZone = !inKinshasa(lon,lat);
      if(horsZone){
        lon = 15.355;
        lat = -4.360;
        acc = 0;
        toast('📍 Hors de Kinshasa — simulation centrée sur Kinshasa');
      }

      btn.textContent='📍 Ma position';
      btn.classList.add('active');

      lastSource='gps';
      userPos=ol.proj.fromLonLat([lon,lat]);
      lastCenter=userPos;

      updateGPS(lon,lat,acc);
      map.getView().animate({center:userPos,zoom:15,duration:800});
      drawCircle(userPos,radarRadius);
      analyze(userPos,radarRadius);

      document.getElementById('btn-recenter').style.display='block';
      document.getElementById('intro').style.display='none';
      toast('✅ Position trouvée · Précision ±'+Math.round(acc)+'m');

      if(gpsWatchId)navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId=navigator.geolocation.watchPosition(function(p){
        if(!inKinshasa(p.coords.longitude,p.coords.latitude))return;
        userPos=ol.proj.fromLonLat([p.coords.longitude,p.coords.latitude]);
        updateGPS(p.coords.longitude,p.coords.latitude,p.coords.accuracy);
        if(lastSource==='gps'){
          lastCenter=userPos;
          drawCircle(userPos,radarRadius);
          analyze(userPos,radarRadius);
        }
      },null,{enableHighAccuracy:true,maximumAge:5000});
    },
    function(err){
      btn.classList.remove('locating');
      btn.textContent='📍 Ma position';
      var m={1:'❌ Permission GPS refusée',2:'❌ Position GPS indisponible',3:'❌ Délai GPS dépassé'};
      toast(m[err.code]||'❌ Erreur GPS');
    },
    {enableHighAccuracy:true,timeout:12000,maximumAge:0}
  );
}

function updateGPS(lon,lat,acc){
  gpsSrc.clear();
  if(acc&&acc<2000){
    var pts=[];
    for(var i=0;i<=64;i++){
      var a=(i/64)*2*Math.PI;
      pts.push(ol.proj.fromLonLat([
        lon+(acc/(111320*Math.cos(lat*Math.PI/180)))*Math.cos(a),
        lat+(acc/110540)*Math.sin(a)
      ]));
    }
    var af=new ol.Feature({geometry:new ol.geom.Polygon([pts])});
    af.set('t','acc');
    gpsSrc.addFeature(af);
  }
  var pf=new ol.Feature({geometry:new ol.geom.Point(ol.proj.fromLonLat([lon,lat]))});
  pf.set('t','user');
  gpsSrc.addFeature(pf);
}

function recenterOnMe(){
  if(!userPos)return;
  map.getView().animate({center:userPos,zoom:15,duration:600});
  lastSource='gps';
  lastCenter=userPos;
  drawCircle(userPos,radarRadius);
  analyze(userPos,radarRadius);
  toast('📍 Recentré sur votre position');
}

// ══════════════════════════════════════════════════════════
// CONTRÔLES RAYON
// ══════════════════════════════════════════════════════════
function syncRadius(v){
  radarRadius=v;
  var lbl=v>=1000?(v/1000).toFixed(1)+'km':v+'m';
  document.getElementById('rc-val').textContent=lbl;
  var pct=((v-100)/(5000-100))*100;
  document.getElementById('radius-slider').style.background='linear-gradient(90deg,var(--orange) '+pct+'%,var(--border) '+pct+'%)';
  document.getElementById('radius-input').value=v;
}

function onSlider(v){
  syncRadius(parseInt(v));
  if(lastCenter){
    drawCircle(lastCenter,radarRadius);
    analyze(lastCenter,radarRadius);
  }
}

function applyManualRadius(){
  var v=parseInt(document.getElementById('radius-input').value);
  if(isNaN(v)||v<100){toast('⚠️ Minimum 100m');return;}
  if(v>5000){toast('⚠️ Maximum 5km');return;}
  syncRadius(v);
  if(lastCenter){
    drawCircle(lastCenter,radarRadius);
    analyze(lastCenter,radarRadius);
  }
  toast('📡 Rayon : '+(v>=1000?(v/1000).toFixed(1)+'km':v+'m'));
}

// ══════════════════════════════════════════════════════════
// INTERACTIONS CARTE
// ══════════════════════════════════════════════════════════
var selF=null, hovF=null;

map.on('singleclick',function(evt){
  if(radarMode){
    lastCenter=evt.coordinate;
    lastSource='click';
    drawCircle(lastCenter,radarRadius);
    analyze(lastCenter,radarRadius);
    document.getElementById('intro').style.display='none';
    var ll=ol.proj.toLonLat(lastCenter);
    toast('📡 Lat '+ll[1].toFixed(4)+' · Lon '+ll[0].toFixed(4));
    return;
  }

  var f=map.forEachFeatureAtPixel(evt.pixel,function(f){return f;},{
    layerFilter:function(l){return l===commLayer;}
  });

  if(!f)return;
  var name=f.get('name'), db=DB[name];
  if(!db)return;

  if(selF)selF.setStyle(commStyle(selF,false));
  f.setStyle(commStyle(f,true));
  selF=f;

  document.getElementById('intro').style.display='none';
  renderSB(name,db);

  var sidebar=document.getElementById('sidebar');
  if(!sidebar.classList.contains('open')) toggleSidebar();

  toast('📍 '+name+' chargée');
});

map.on('pointermove',function(evt){
  var tt=document.getElementById('tt');

  if(radarMode){
    map.getTargetElement().style.cursor='crosshair';
    tt.style.display='none';
    var c=ol.proj.toLonLat(evt.coordinate);
    document.getElementById('coords').textContent='🌐 Lat '+c[1].toFixed(5)+' · Lon '+c[0].toFixed(5)+' · 📡 Mode Rayon';
    return;
  }

  var f=map.forEachFeatureAtPixel(evt.pixel,function(f){return f;},{
    layerFilter:function(l){return l===commLayer||l===poiLayer;}
  });

  if(f){
    if(f.getGeometry().getType()==='Polygon'&&f!==selF){
      if(hovF&&hovF!==selF)hovF.setStyle(commStyle(hovF,false));
      f.setStyle(new ol.style.Style({
        stroke:new ol.style.Stroke({color:'rgba(255,255,255,.65)',width:2}),
        fill:new ol.style.Fill({color:'rgba(88,166,255,.16)'})
      }));
      hovF=f;
    }
    document.getElementById('ttn').textContent=f.get('name')||'';
    var d=DB[f.get('name')];
    document.getElementById('tti').textContent=d?('👥 '+d.population.toLocaleString()+' hab. · '+d.status):(f.get('type')||'');
    tt.style.display='block';
    map.getTargetElement().style.cursor='pointer';
  } else {
    if(hovF&&hovF!==selF){
      hovF.setStyle(commStyle(hovF,false));
      hovF=null;
    }
    tt.style.display='none';
    map.getTargetElement().style.cursor='';
  }

  tt.style.left=(evt.originalEvent.clientX+14)+'px';
  tt.style.top=(evt.originalEvent.clientY-42)+'px';

  var c=ol.proj.toLonLat(evt.coordinate);
  document.getElementById('coords').textContent='🌐 Lat '+c[1].toFixed(5)+' · Lon '+c[0].toFixed(5);
});

// ══════════════════════════════════════════════════════════
// FONCTIONS GLOBALES
// ══════════════════════════════════════════════════════════
window.toggleCat=function(el){
  var ci=el.parentElement.querySelector('.cat-items');
  if(ci) ci.style.display=ci.style.display==='block'?'none':'block';
  el.classList.toggle('cat-open');
};

window.setBasemap=function(n){
  osmLayer.setVisible(n==='osm');
  satLayer.setVisible(n==='satellite');
  darkLayer.setVisible(n==='dark');

  ['osm','satellite','dark'].forEach(function(k){
    var b=document.getElementById('btn-'+k),
        l=document.getElementById('lp-'+k);
    if(b)b.classList.remove('on');
    if(l)l.classList.remove('on');
  });

  var b2=document.getElementById('btn-'+n),
      l2=document.getElementById('lp-'+n);
  if(b2)b2.classList.add('on');
  if(l2)l2.classList.add('on');

  toast('🗺️ '+{osm:'Rues (OSM)',satellite:'Satellite',dark:'Sombre'}[n]);
};

window.toggleLayer=function(n){
  var el=document.getElementById('lp-'+n);
  if(!el)return;

  el.classList.toggle('on');
  var on=el.classList.contains('on');

  if(n==='communes')commLayer.setVisible(on);
  if(n==='heatmap') heatLayer.setVisible(on);
  if(n==='poi')     poiLayer.setVisible(on);

  var lbls={communes:'Limites',heatmap:'Carte chaleur',poi:'Points d\'intérêt'};
  toast((on?'✅':'⬜')+' '+lbls[n]+(on?' activée':' désactivée'));
};

window.toggleSidebar=function(){
  var sidebar=document.getElementById('sidebar');
  var toggleBtn=document.getElementById('sidebar-toggle');

  sidebar.classList.toggle('open');
  var isOpen=sidebar.classList.contains('open');

  if(toggleBtn){
    if(isOpen){
      toggleBtn.classList.remove('closed');
      toggleBtn.innerHTML='◀';
    } else {
      toggleBtn.classList.add('closed');
      toggleBtn.innerHTML='▶';
    }
  }

  setTimeout(function(){map.updateSize();},380);
};

window.toggleRadarMode=function(){
  radarMode=!radarMode;
  var btn=document.getElementById('btn-radar'),
      hint=document.getElementById('radar-hint');

  if(radarMode){
    btn.classList.add('on');
    hint.style.display='block';
    map.getTargetElement().style.cursor='crosshair';
    document.getElementById('radar-panel').classList.add('open');
    document.getElementById('lp').style.display='none';
    toast('📡 Mode Rayon actif — cliquez sur la carte');
  } else {
    btn.classList.remove('on');
    hint.style.display='none';
    map.getTargetElement().style.cursor='';
    document.getElementById('lp').style.display='block';
  }
};

window.closeRadar=function(){
  radarSrc.clear();
  document.getElementById('radar-panel').classList.remove('open');
  document.getElementById('radar-stats').style.display='none';
  document.getElementById('radar-results').innerHTML='<div class="ph0" style="padding:28px 18px"><span class="ic" style="font-size:1.8rem">📡</span>Cliquez sur Ma position ou activez le mode rayon</div>';
  lastCenter=null;

  if(radarMode)window.toggleRadarMode();

  if(gpsWatchId){
    navigator.geolocation.clearWatch(gpsWatchId);
    gpsWatchId=null;
  }

  var btn=document.getElementById('btn-gps');
  btn.classList.remove('active','locating');
  btn.textContent='📍 Ma position';

  document.getElementById('btn-recenter').style.display='none';
  gpsSrc.clear();
  document.getElementById('lp').style.display='block';
  map.updateSize();
};

window.locateMe=locateMe;
window.recenterOnMe=recenterOnMe;
window.onSlider=onSlider;
window.applyManualRadius=applyManualRadius;

// ══════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════
var _tt=null;
function toast(msg){
  var el=document.getElementById('toast');
  el.textContent=msg;
  el.classList.add('show');
  clearTimeout(_tt);
  _tt=setTimeout(function(){el.classList.remove('show');},2800);
}

// Init
window.setBasemap('osm');
syncRadius(500);

var sidebarToggle=document.getElementById('sidebar-toggle');
if(sidebarToggle){
  sidebarToggle.classList.add('closed');
  sidebarToggle.innerHTML='▶';
}

})();
