import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.css';

export default function Index() {
  const handleStart = () => {
    Taro.navigateTo({ url: '/pages/world-select/index' });
  };

  return (
    <View className="index-page">
      <View className="bg-overlay"></View>
      <View className="content">
        <View className="logo-section">
          <Image 
            className="logo" 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20ancient%20style%20fantasy%20logo%20with%20peach%20blossom%20and%20mountains&image_size=square" 
            mode="aspectFit"
          />
        </View>
        <Text className="title">幻境漫游</Text>
        <Text className="subtitle">WonderRealm</Text>
        <View className="btn-group">
          <Button className="btn-primary" onClick={handleStart}>开始旅程</Button>
          <Button className="btn-secondary">设置</Button>
        </View>
      </View>
    </View>
  );
}
