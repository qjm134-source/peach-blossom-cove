import { View, Text, Image } from '@tarojs/components';
import './index.css';

export default function WeddingPage() {
  const activities = [
    { name: '同学聚会', participants: '10人参与', icon: '👨‍👩‍👧‍👦' },
    { name: '婚礼宴请', participants: '12人参与', icon: '💒' },
    { name: '生日派对', participants: '6人参与', icon: '🎂' },
  ];

  return (
    <View className="wedding-page">
      <View className="bg-overlay"></View>
      <View className="header">
        <Text className="back-btn" onClick={() => Taro.navigateBack()}>←</Text>
        <Text className="page-title">婚礼宴请</Text>
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