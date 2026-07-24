import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.css';

const worlds = [
  { id: 'game', name: '游戏世界', icon: '🎮', color: '#f59e0b' },
  { id: 'poem', name: '诗词雅集', icon: '📜', color: '#06b6d4' },
  { id: 'wedding', name: '婚礼宴请', icon: '💒', color: '#ec4899' },
  { id: 'sb', name: '云端仙山', icon: '⛰️', color: '#10b981' },
  { id: 'huan', name: '幻境漫游', icon: '🔮', color: '#8b5cf6' },
  { id: 'town', name: '古镇风情', icon: '🏮', color: '#ef4444' },
];

export default function WorldSelect() {
  const handleWorldClick = (id: string) => {
    const routes: Record<string, string> = {
      game: '/pages/game/index',
      poem: '/pages/poem/index',
      wedding: '/pages/wedding/index',
    };
    if (routes[id]) {
      Taro.navigateTo({ url: routes[id] });
    } else {
      Taro.showToast({ title: `${worlds.find(w => w.id === id)?.name}开发中`, icon: 'none' });
    }
  };

  return (
    <View className="world-select-page">
      <View className="bg-overlay"></View>
      <View className="header">
        <Text className="page-title">选择世界</Text>
        <Text className="page-subtitle">开启你的奇幻之旅</Text>
      </View>
      <View className="world-grid">
        {worlds.map(world => (
          <View 
            key={world.id} 
            className="world-card" 
            onClick={() => handleWorldClick(world.id)}
          >
            <View className="card-icon" style={{ background: `${world.color}20` }}>
              <Text className="icon-text">{world.icon}</Text>
            </View>
            <Text className="card-name">{world.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
