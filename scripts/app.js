// scripts/app.js

var APP = (function() {

  // ── DATA ─────────────────────────────────────────────────
  var DB = {
    "Gombe":{
      leader:"M. Fabrice Ngoy",police:"+243 810 000 001",health:"+243 990 000 001",
      population:250000,house:42000,density:2100,schools:85,marches:12,sante:8,
      waterAccess:92,elecAccess:95,assainissement:78,routes:[75,15,10],
      prox:[
        {ico:"🏫",name:"Lycée Prince de Liège",dist:"300m",type:"Éducation"},
        {ico:"🏥",name:"Hôpital CMK",dist:"1.2km",type:"Santé"},
        {ico:"🏛️",name:"Palais de la Nation",dist:"850m",type:"Administratif"},
        {ico:"💧",name:"Réservoir Gombe-Est",dist:"600m",type:"Infrastructure"}
      ],
      status:"Priorité faible"
    },
    "Matete":{
      leader:"Mme. Jeanine Kabedi",police:"+243 810 000 002",health:"+243 990 000 002",
      population:680000,house:98000,density:18500,schools:140,marches:22,sante:14,
      waterAccess:45,elecAccess:38,assainissement:25,routes:[25,20,55],
      prox:[
        {ico:"🏫",name:"E.P. 1 Matete",dist:"1.2km",type:"Éducation"},
        {ico:"🏥",name:"Centre de Santé Uzima",dist:"900m",type:"Santé"},
        {ico:"🛒",name:"Marché Central Matete",dist:"400m",type:"Commerce"}
      ],
      status:"Priorité haute"
    },
    "Kasa-Vubu":{
      leader:"M. Théodore Mbungu",police:"+243 810 000 003",health:"+243 990 000 003",
      population:510000,house:72000,density:14200,schools:105,marches:18,sante:11,
      waterAccess:62,elecAccess:55,assainissement:40,routes:[40,30,30],
      prox:[
        {ico:"🏫",name:"Institut Kasa-Vubu",dist:"700m",type:"Éducation"},
        {ico:"🏥",name:"Clinique Ngaliema",dist:"2.1km",type:"Santé"},
        {ico:"🛒",name:"Marché Gambela",dist:"500m",type:"Commerce"}
      ],
      status:"Priorité moyenne"
    },
    "Limete":{
      leader:"M. Pascal Luzamba",police:"+243 810 000 004",health:"+243 990 000 004",
      population:420000,house:61000,density:8900,schools:90,marches:15,sante:9,
      waterAccess:70,elecAccess:68,assainissement:55,routes:[55,25,20],
      prox:[
        {ico:"🏫",name:"École Primaire Limete",dist:"500m",type:"Éducation"},
        {ico:"🏥",name:"Hôpital Biamba",dist:"1.8km",type:"Santé"},
        {ico:"🏭",name:"Zone Industrielle",dist:"900m",type:"Industrie"}
      ],
      status:"Priorité faible"
    }
  };

  var SC = {"Priorité faible":"#3fb950","Priorité moyenne":"#d29922","Priorité haute":"#f85149"};

  // ── LAYERS ───────────────────────────────────────────────
  var osmLayer = new ol.layer.Tile({ source: new ol.source.OSM(), visible: true });

  var satLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attributions: 'Tiles © Esri'
    }),
    visible: false
  });

  var darkLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
      attributions: '© CartoDB'
    }),
    visible: false
  });

  // ── COMMUNES ─────────────────────────────────────────────
  var communeFeatures = new ol.format.GeoJSON().readFeatures({
    type: "FeatureCollection",
    features: [
      {type:"Feature",properties:{name:"Gombe"},     geometry:{type:"Polygon",coordinates:[[[15.290,-4.335],[15.370,-4.335],[15.370,-4.285],[15.290,-4.285],[15.290,-4.335]]]}},
      {type:"Feature",properties:{name:"Matete"},    geometry:{type:"Polygon",coordinates:[[[15.320,-4.445],[15.420,-4.445],[15.420,-4.375],[15.320,-4.375],[15.320,-4.445]]]}},
      {type:"Feature",properties:{name:"Kasa-Vubu"}, geometry:{type:"Polygon",coordinates:[[[15.295,-4.380],[15.345,-4.380],[15.345,-4.330],[15.295,-4.330],[15.295,-4.380]]]}},
      {type:"Feature",properties:{name:"Limete"},    geometry:{type:"Polygon",coordinates:[[[15.400,-4.380],[15.500,-4.380],[15.500,-4.320],[15.400,-4.320],[15.400,-4.380]]]}}
    ]
  }, { featureProjection: 'EPSG:3857' });

  function makeStyle(feat, selected) {
    var d = DB[feat.get('name')];
    var c = d ? SC[d.status] : '#58a6ff';
    return new ol.style.Style({
      stroke: new ol.style.Stroke({ color: selected ? '#ffffff' : c, width: selected ? 3 : 2 }),
      fill:   new ol.style.Fill({ color: selected ? 'rgba(255,255,255,0.12)' : (c + '28') })
    });
  }

  var communeSource = new ol.source.Vector({ features: communeFeatures });
  var communeLayer = new ol.layer.Vector({
    source: communeSource,
    style: function(f){ return makeStyle(f, false); },
    visible: true
  });

  // ── HEATMAP ──────────────────────────────────────────────
  var heatPts = [
    [15.310,-4.320,0.9],[15.350,-4.410,0.95],[15.330,-4.380,0.7],[15.370,-4.400,0.75],
    [15.325,-4.405,0.85],[15.355,-4.330,0.6],[15.315,-4.355,0.8],[15.340,-4.345,0.65],
    [15.360,-4.425,0.9],[15.295,-4.370,0.7],[15.405,-4.340,0.55],[15.415,-4.355,0.6],
    [15.425,-4.370,0.5],[15.375,-4.355,0.65],[15.345,-4.395,0.8],[15.385,-4.415,0.7]
  ];

  var heatFeatures = heatPts.map(function(p) {
    var f = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat([p[0], p[1]])) });
    f.set('weight', p[2]);
    return f;
  });

  var heatmapLayer = new ol.layer.Heatmap({
    source: new ol.source.Vector({ features: heatFeatures }),
    blur: 22, radius: 16, visible: false,
    weight: function(f){ return f.get('weight') || 0.5; }
  });

  // ── POI ──────────────────────────────────────────────────
  var poiData = [
    {lon:15.315,lat:-4.305,lbl:'🏥',name:'Hôpital CMK',type:'Santé'},
    {lon:15.325,lat:-4.315,lbl:'🏫',name:'Lycée Prince de Liège',type:'Éducation'},
    {lon:15.370,lat:-4.405,lbl:'🛒',name:'Marché Central Matete',type:'Commerce'},
    {lon:15.335,lat:-4.360,lbl:'🏫',name:'Institut Kasa-Vubu',type:'Éducation'},
    {lon:15.450,lat:-4.355,lbl:'🏭',name:'Zone Industrielle Limete',type:'Industrie'},
    {lon:15.415,lat:-4.345,lbl:'🏥',name:'Hôpital Biamba Marie Mutombo',type:'Santé'},
    {lon:15.300,lat:-4.350,lbl:'🏛️',name:'Mairie de Gombe',type:'Administratif'},
    {lon:15.360,lat:-4.398,lbl:'🏫',name:'ISIPA Matete',type:'Éducation'},
    {lon:15.308,lat:-4.318,lbl:'💧',name:'Réservoir REGIDESO',type:'Infrastructure'}
  ];

  var poiFeats = poiData.map(function(p) {
    var f = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat([p.lon, p.lat])) });
    f.set('lbl', p.lbl); f.set('name', p.name); f.set('type', p.type);
    return f;
  });

  var poiLayer = new ol.layer.Vector({
    source: new ol.source.Vector({ features: poiFeats }),
    style: function(f) {
      return new ol.style.Style({
        image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({ color: 'rgba(88,166,255,0.8)' }),
          stroke: new ol.style.Stroke({ color: '#0d1117', width: 2 })
        }),
        text: new ol.style.Text({
          text: f.get('lbl'),
          font: 'bold 14px sans-serif',
          offsetY: -18,
          fill: new ol.style.Fill({ color: '#fff' })
        })
      });
    },
    visible: false
  });

  // ── CARTE ────────────────────────────────────────────────
  var map = new ol.Map({
    target: 'map',
    layers: [osmLayer, satLayer, darkLayer, heatmapLayer, communeLayer, poiLayer],
    view: new ol.View({
      center: ol.proj.fromLonLat([15.355, -4.360]),
      zoom: 12
    })
  });

  // ── CHARTS ───────────────────────────────────────────────
  Chart.defaults.color = '#8b949e';
  Chart.defaults.borderColor = '#30363d';
  var cR = null, cI = null;

  function buildCharts(db) {
    var e1 = document.getElementById('ch-r');
    var e2 = document.getElementById('ch-i');
    if (!e1 || !e2) return;
    if (cR) { cR.destroy(); cR = null; }
    if (cI) { cI.destroy(); cI = null; }

    cR = new Chart(e1.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Asphalté','Réhabilitation','Impraticable'],
        datasets: [{ data: db.routes, backgroundColor: ['#3fb950','#d29922','#f85149'], borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: { legend: { position: 'bottom', labels: { font:{size:10}, boxWidth:10, padding:8 } } }
      }
    });

    cI = new Chart(e2.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Écoles','Marchés','Ctrs Santé'],
        datasets: [{
          data: [db.schools, db.marches, db.sante],
          backgroundColor: ['rgba(88,166,255,.7)','rgba(188,140,255,.7)','rgba(63,185,80,.7)'],
          borderRadius: 4, borderWidth: 0
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(48,54,61,.8)' } },
          x: { grid: { display: false } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  // ── SIDEBAR ──────────────────────────────────────────────
  function pc(v) { return v >= 70 ? 'var(--green)' : v >= 50 ? 'var(--yellow)' : 'var(--red)'; }

  function renderSB(name, db) {
    document.getElementById('sb-name').textContent = name;
    document.getElementById('sb-sub').textContent  = 'Commune · ' + db.population.toLocaleString() + ' hab. · ' + db.status;

    var sc = SC[db.status] || '#8b949e';

    document.getElementById('sb-body').innerHTML =
      '<div class="sec">' +
        '<div class="sec-t">Vue d\'ensemble</div>' +
        '<div class="kbig">' + (db.population/1000).toFixed(0) + '<span style="font-size:1rem;color:var(--muted)">k hab.</span></div>' +
        '<div class="kbig-l">Population totale de la commune</div>' +
        '<div class="kg">' +
          '<div class="kb"><div class="kbl">Ménages</div><div class="kbv">' + (db.house/1000).toFixed(0) + 'k</div></div>' +
          '<div class="kb"><div class="kbl">Densité/km²</div><div class="kbv">' + db.density.toLocaleString() + '</div></div>' +
          '<div class="kb"><div class="kbl">Priorité</div><div class="kbv" style="color:' + sc + ';font-size:.8rem">' + db.status.replace('Priorité ','') + '</div></div>' +
        '</div>' +
      '</div>' +

      '<div class="sec">' +
        '<div class="sec-t">Responsable & Secours</div>' +
        '<div class="cbox"><div class="av">👤</div><div><div class="ct-r">Bourgmestre</div><div class="ct-n">' + db.leader + '</div></div></div>' +
        '<div class="eg">' +
          '<a href="tel:' + db.police + '" class="eb ep"><span style="font-size:1rem">🚨</span><span><span class="el">Police</span>' + db.police + '</span></a>' +
          '<a href="tel:' + db.health + '" class="eb eh"><span style="font-size:1rem">🚑</span><span><span class="el">Urgence médicale</span>' + db.health + '</span></a>' +
        '</div>' +
      '</div>' +

      '<div class="sec">' +
        '<div class="sec-t">Accès aux services de base</div>' +
        '<div class="pg"><div class="ph"><span>💧 Eau potable</span><span class="pp" style="color:' + pc(db.waterAccess) + '">' + db.waterAccess + '%</span></div><div class="pt"><div class="pf fb" id="pw"></div></div></div>' +
        '<div class="pg"><div class="ph"><span>⚡ Électricité</span><span class="pp" style="color:' + pc(db.elecAccess) + '">' + db.elecAccess + '%</span></div><div class="pt"><div class="pf fy" id="pe"></div></div></div>' +
        '<div class="pg"><div class="ph"><span>🗑️ Assainissement</span><span class="pp" style="color:' + pc(db.assainissement) + '">' + db.assainissement + '%</span></div><div class="pt"><div class="pf fg" id="pa"></div></div></div>' +
      '</div>' +

      '<div class="sec"><div class="sec-t">État du réseau routier</div><div class="cw"><canvas id="ch-r"></canvas></div></div>' +
      '<div class="sec"><div class="sec-t">Infrastructures recensées</div><div class="cw"><canvas id="ch-i"></canvas></div></div>' +

      '<div class="sec">' +
        '<div class="sec-t">Services les plus proches</div>' +
        db.prox.map(function(p){
          return '<div class="pi"><span style="font-size:1.1rem">' + p.ico + '</span><span style="flex:1">' + p.name + '<span class="pt2">' + p.type + '</span></span><span class="pd">' + p.dist + '</span></div>';
        }).join('') +
      '</div>';

    requestAnimationFrame(function() {
      buildCharts(db);
      setTimeout(function() {
        var pw = document.getElementById('pw');
        var pe = document.getElementById('pe');
        var pa = document.getElementById('pa');
        if (pw) pw.style.width = db.waterAccess + '%';
        if (pe) pe.style.width = db.elecAccess + '%';
        if (pa) pa.style.width = db.assainissement + '%';
      }, 80);
    });
  }

  // ── INTERACTIONS CARTE ────────────────────────────────────
  var selFeat = null, hovFeat = null;

  map.on('singleclick', function(evt) {
    var feat = map.forEachFeatureAtPixel(evt.pixel, function(f){ return f; },
      { layerFilter: function(l){ return l === communeLayer; } });

    if (!feat) return;
    var name = feat.get('name');
    var db   = DB[name];
    if (!db) return;

    if (selFeat) selFeat.setStyle(makeStyle(selFeat, false));
    feat.setStyle(makeStyle(feat, true));
    selFeat = feat;

    document.getElementById('intro').style.display = 'none';
    renderSB(name, db);
    if (!document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
    toast('📍 Commune ' + name + ' chargée');
  });

  map.on('pointermove', function(evt) {
    var ttEl = document.getElementById('tt');
    var feat = map.forEachFeatureAtPixel(evt.pixel, function(f){ return f; },
      { layerFilter: function(l){ return l === communeLayer || l === poiLayer; } });

    if (feat) {
      if (feat.getGeometry().getType() === 'Polygon' && feat !== selFeat) {
        if (hovFeat && hovFeat !== selFeat) hovFeat.setStyle(makeStyle(hovFeat, false));
        feat.setStyle(new ol.style.Style({
          stroke: new ol.style.Stroke({ color: 'rgba(255,255,255,0.65)', width: 2 }),
          fill:   new ol.style.Fill({ color: 'rgba(88,166,255,0.16)' })
        }));
        hovFeat = feat;
      }
      document.getElementById('ttn').textContent = feat.get('name') || '';
      var d = DB[feat.get('name')];
      document.getElementById('tti').textContent = d
        ? ('👥 ' + d.population.toLocaleString() + ' hab. · ' + d.status)
        : (feat.get('type') || '');
      ttEl.style.display = 'block';
      map.getTargetElement().style.cursor = 'pointer';
    } else {
      if (hovFeat && hovFeat !== selFeat) {
        hovFeat.setStyle(makeStyle(hovFeat, false));
        hovFeat = null;
      }
      ttEl.style.display = 'none';
      map.getTargetElement().style.cursor = '';
    }

    ttEl.style.left = (evt.originalEvent.clientX + 14) + 'px';
    ttEl.style.top  = (evt.originalEvent.clientY - 42) + 'px';

    var c = ol.proj.toLonLat(evt.coordinate);
    document.getElementById('coords').textContent =
      '🌐 Lat ' + c[1].toFixed(5) + ' · Lon ' + c[0].toFixed(5);
  });

  // ── FONCTIONS PUBLIQUES ───────────────────────────────────
  function setBasemap(name) {
    osmLayer.setVisible(name === 'osm');
    satLayer.setVisible(name === 'satellite');
    darkLayer.setVisible(name === 'dark');

    ['osm','satellite','dark'].forEach(function(k) {
      var b = document.getElementById('btn-' + k);
      var l = document.getElementById('lp-' + k);
      if (b) b.classList.remove('on');
      if (l) l.classList.remove('on');
    });
    var bx = document.getElementById('btn-' + name);
    var lx = document.getElementById('lp-' + name);
    if (bx) bx.classList.add('on');
    if (lx) lx.classList.add('on');

    var labels = {osm:'Rues (OSM)', satellite:'Satellite', dark:'Sombre'};
    toast('🗺️ Fond « ' + labels[name] + ' » activé');
  }

  function toggleLayer(name) {
    var el = document.getElementById('lp-' + name);
    if (!el) return;
    el.classList.toggle('on');
    var on = el.classList.contains('on');
    if (name === 'communes') communeLayer.setVisible(on);
    if (name === 'heatmap')  heatmapLayer.setVisible(on);
    if (name === 'poi')      poiLayer.setVisible(on);
    var labels = {communes:'Limites administratives', heatmap:'Carte de chaleur', poi:'Points d\'intérêt'};
    toast((on ? '✅' : '⬜') + ' ' + labels[name] + (on ? ' activée' : ' désactivée'));
  }

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    setTimeout(function(){ map.updateSize(); }, 380);
  }

  var _toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function(){ el.classList.remove('show'); }, 2800);
  }

  // Init
  setBasemap('osm');

  return { setBasemap: setBasemap, toggleLayer: toggleLayer, toggleSidebar: toggleSidebar };

})(); // fin IIFE

// ✅ IMPORTANT : rendre APP global pour les onclick du HTML
window.APP = APP;