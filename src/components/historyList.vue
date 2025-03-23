<template>
  <view class="history-container" :class="{ 'show': show }">
    <view class="history-content">
      <view class="history-header">
        <text class="header-title">历史记录</text>
        <text class="close-btn" @click="handleClose">×</text>
      </view>
      
      <scroll-view class="history-list" scroll-y>
        <view 
          v-for="(item, index) in historyList" 
          :key="index"
          class="history-item"
        >
          <view class="item-content" @click="handleItemClick(item)">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-time">{{ formatTime(item.time) }}</text>
          </view>
          <view class="delete-btn" @click="handleDelete(index)">
            <uni-icons type="trash" size="30"></uni-icons>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="mask" @click="handleClose" v-if="show"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { formatDate } from '@/utils/date'

// 接收父组件的属性
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// 定义要向父组件发出的事件
const emit = defineEmits(['close', 'select'])

// 示例数据
const historyList = ref([
  {
    title: '关于人工智能的发展前景',
    time: Date.now() - 1000 * 60 * 60 * 24,
    content: '这是一段对话内容...'
  },
  {
    title: '学习方法的探讨',
    time: Date.now() - 1000 * 60 * 60 * 48,
    content: '这是一段对话内容...'
  },
  {
    title: '编程语言的选择',
    time: Date.now() - 1000 * 60 * 60 * 72,
    content: '这是一段对话内容...'
  }
])

// 格式化时间
const formatTime = (timestamp) => {
  return formatDate(timestamp, 'YYYY年MM月DD日 HH:mm:ss')
}

// 处理关闭事件
const handleClose = () => {
  emit('close')
}

// 处理项目点击
const handleItemClick = (item) => {
  emit('select', item)
}

// 处理删除
const handleDelete = (index) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条记录吗？',
    success: (res) => {
      if (res.confirm) {
        historyList.value.splice(index, 1)
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.history-container {
  position: fixed;
  top: 0;
  left: -80%;
  width: 80%;
  height: 100vh;
  z-index: 999;
  transition: all 0.3s ease;
  
  &.show {
    left: 0;
  }
}

.history-content {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 20rpx rgba(0,0,0,0.1);
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1;
}

.history-header {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2rpx solid #f5f5f5;
  
  .header-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
  
  .close-btn {
    font-size: 48rpx;
    color: #999;
    padding: 0 20rpx;
  }
}

.history-list {
  height: calc(100vh - 94rpx);
  
  .history-item {
    padding: 30rpx;
    border-bottom: 2rpx solid #f5f5f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .item-content {
      flex: 1;
      padding-right: 20rpx;
      
      .item-title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
        display: block;
      }
      
      .item-time {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .delete-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(139,127,209,0.1);
    }
  }
}
</style>
