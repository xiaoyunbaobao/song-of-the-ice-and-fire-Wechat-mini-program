Component({
  properties: {
    character: {
      type: Object,
      value: {}
    },
    showStatus: {
      type: Boolean,
      value: true
    }
  },

  data: {
    statusLabel: '',
    statusClass: ''
  },

  observers: {
    'character.status'(status) {
      const statusMap = {
        alive: { label: '存活', cls: 'tag-status-alive' },
        dead: { label: '已故', cls: 'tag-status-dead' },
        unknown: { label: '未知', cls: 'tag-ice' },
        resurrected: { label: '已复活', cls: 'tag-fire' }
      };
      const info = statusMap[status] || { label: '未知', cls: 'tag-ice' };
      this.setData({
        statusLabel: info.label,
        statusClass: info.cls
      });
    }
  },

  methods: {
    onTap() {
      const character = this.properties.character;
      this.triggerEvent('tap', { id: character._id, name: character.name });
    }
  }
});
