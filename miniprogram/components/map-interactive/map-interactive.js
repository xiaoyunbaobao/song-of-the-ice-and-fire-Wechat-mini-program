// 维斯特洛交互地图 — 索引高亮模式
Component({
  properties: {
    baseMap: { type: String, value: '/images/map/westeros.jpg' },
    offsetY: { type: Number, value: 0 },
    activeRegion: { type: String, value: '' }   // 外部控制：当前高亮区域id
  },

  data: {
    regions: [],
    activeData: null,
    _offsetY: 0
  },

  observers: {
    'offsetY'(val) { this.setData({ _offsetY: val }); },
    'activeRegion'(id) {
      const region = this.data.regions.find(r => r.id === id);
      this.setData({ activeData: region || null });
    }
  },

  lifetimes: {
    attached() { this.initRegions(); }
  },

  methods: {
    initRegions() {
      this.setData({ regions: [
        // imgOff = 该区域高亮图额外偏移（叠加在全局 offsetY 上），正数下移
        { id:'beyond_wall',  name:'塞外',   img:'/images/map/Byound_the_wall_world.jpg',   top:0,  left:12, width:52, height:6,  imgOff:0 },
        { id:'the_north',    name:'北境',   img:'/images/map/The_North_World.jpg',         top:5,  left:14, width:52, height:26, imgOff:0 },
        { id:'iron_islands', name:'铁群岛', img:null,                                      top:30, left:1,  width:10, height:7,  imgOff:0 },
        { id:'riverlands',   name:'河间地', img:'/images/map/The_Riverlands_World.jpg',    top:28, left:24, width:28, height:14, imgOff:0 },
        { id:'the_vale',     name:'谷地',   img:'/images/map/The_Vale_world.jpg',          top:24, left:48, width:18, height:11, imgOff:0 },
        { id:'westerlands',  name:'西境',   img:'/images/map/The_Westerlands_World.jpg',   top:38, left:16, width:18, height:11, imgOff:0 },
        { id:'crownlands',   name:'王领',   img:'/images/map/Crownlands_World.jpg',       top:42, left:36, width:14, height:10, imgOff:0 },
        { id:'stormlands',   name:'风暴地', img:'/images/map/The_Stormlands_World.jpg',    top:50, left:32, width:18, height:14, imgOff:2 },
        { id:'the_reach',    name:'河湾地', img:'/images/map/The_Reach_World.jpg',         top:52, left:18, width:24, height:16, imgOff:2.3 },
        { id:'dorne',        name:'多恩',   img:'/images/map/-Dorne_World.jpg',           top:68, left:30, width:20, height:16, imgOff:2.5 }
      ]});
    }
  }
});
