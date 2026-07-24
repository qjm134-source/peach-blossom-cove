import { View, Text } from '@tarojs/components';
import './index.css';

export default function PoemPage() {
  const activities = [
    { name: '诗词飞花令', participants: '56人参与', icon: '🌸' },
    { name: '古风音乐会', participants: '34人参与', icon: '🎵' },
  ];

  return (
    <View className="poem-page">
      <View className="bg-overlay"></View>
      <View className="header">
        <Text className="back-btn" onClick={() => Taro.navigateBack()}>←</Text>
        <Text className="page-title">诗词雅集</Text>
      </View>
      <View className="content">
        <View className="poem-display">
          <Text className="poem-text">床前明月光，疑是地上霜</Text>
          <Text className="poem-author">李白</Text>
        </View>
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
