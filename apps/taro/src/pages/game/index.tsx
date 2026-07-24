import { View, Text, Image } from '@tarojs/components';
import './index.css';

export default function GamePage() {
  const activities = [
    { name: '中秋节', participants: '128人参与', icon: '🌕' },
    { name: '七夕节', participants: '89人参与', icon: '💑' },
    { name: '春节', participants: '256人参与', icon: '🧧' },
  ];

  return (
    <View className="game-page">
      <View className="bg-overlay"></View>
      <View className="header">
        <Text className="back-btn" onClick={() => Taro.navigateBack()}>←</Text>
        <Text className="page-title">游戏世界</Text>
      </View>
      <View className="content">
        <View className="section">
          <Text className="section-title">当前活动</Text>
          <View className="activity-list">
            {activities.map((act, index) => (
              <View key={index} className="activity-card">
                <View className="activity-icon">{act.icon}</View>
                <View className="activity-info">
                  <Text className="activity-name">{act.name}</Text>
                  <Text className="activity-participants">{act.participants}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
