<template>
  <!-- AI助手卡片 -->
  <view class="ai-card-container">
    <view class="ai-card">
      <view class="ai-greeting">
        <text class="greeting-text">Hi~</text>
        <text class="ai-intro">你好，我是AI智能助手</text>
      </view>

      <view class="feature-tags">
        <text class="tag">星级服务</text>
        <text class="tag">智能问答</text>
        <text class="tag">专业知识</text>
        <text class="tag">深度解答</text>
      </view>
    </view>
  </view>

  <!-- 问题建议区域 -->
  <view class="suggestion-area">
    <text class="suggestion-title">— 你可以这样问我 —</text>
    <view class="suggestion-list">
      <view
        class="suggestion-item"
        v-for="(item, index) in suggestions"
        :key="index"
      >
        <text>{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
// 常量数据
const suggestions = [
  "有没有什么课程推荐",
  "学习有什么技巧",
  "怎样才能获取更多的课本知识",
];
</script>

<style lang="scss" scoped>
.ai-card-container {
  display: flex;
  justify-content: center;
}
.ai-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx 0;
  max-width: 750rpx;
  box-shadow: 0 4rpx 12rpx rgba(139, 127, 209, 0.1);

  .ai-greeting {
    padding: 0 16rpx;
    .greeting-text {
      font-size: 48rpx;
      color: #8b7fd1;
      font-weight: bold;
    }
    .ai-intro {
      font-size: 28rpx;
      color: #666;
      margin: 10rpx 0;
      display: block;
    }
    .ai-model {
      font-size: 24rpx;
      color: #666;
      display: block;
    }
  }
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;
  gap: 20rpx;

  .tag {
    background: rgba(255, 255, 255, 0.8);
    color: #8b7fd1;
    padding: 10rpx 20rpx;
    border-radius: 30rpx;
    font-size: 24rpx;
  }
}
.suggestion-area {
  margin: 40rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .suggestion-title {
    text-align: center;
    color: #666;
    font-size: 28rpx;
    margin-bottom: 30rpx;
  }

  .suggestion-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .suggestion-item {
      background: rgba(255, 255, 255, 0.9);
      padding: 12rpx 30rpx;
      border-radius: 40rpx;
      margin-bottom: 16rpx;
      color: #333;
      font-size: 24rpx;
      box-shadow: 0 2rpx 8rpx rgba(139, 127, 209, 0.05);
      display: inline-block;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.98);
        background: rgba(255, 255, 255, 0.95);
      }

      text {
        color: #666;
      }
    }
  }
}
</style>