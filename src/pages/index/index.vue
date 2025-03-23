<template>
  <view
    class="container"
    :class="{ 'overflow-hidden': historyListShow }"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- 顶部导航栏 -->
    <view class="nav-bar"></view>

    <!-- 历史记录按钮 -->
    <view class="history-trigger" @click="toggleHistory">
      <text class="trigger-icon">›</text>
    </view>
    <!-- 历史记录组件 -->
    <HistoryList
      :show="historyListShow"
      @close="toggleHistory"
      @select="handleHistorySelect"
    ></HistoryList>

    <Home v-if="homeShow"></Home>
    <Chat
      v-else
      ref="chatComp"
      :inputContent="inputContent"
      :botId="currentModel"
      @sendSuccess="inputContent = ''"
    ></Chat>

    <!-- 底部输入框 -->
    <view class="input-area">
      <view class="model-selector" @click="toggleSelector">
        <view class="selected-model">
          <text>{{ currentModelLabel }}</text>
          <text class="arrow" :class="{ 'arrow-up': showSelector }">▼</text>
        </view>
        <view class="model-options" v-if="showSelector">
          <view
            v-for="(model, index) in modelOptions"
            :key="index"
            :class="['model-option', { active: currentModel === model.value }]"
            @click.stop="selectModel(model.value)"
          >
            {{ model.label }}
          </view>
        </view>
      </view>
      <view class="input-box">
        <input
          type="text"
          placeholder="有什么问题都可以问我"
          placeholder-class="input-placeholder"
          v-model="inputContent"
          @confirm="sendMessage"
        />
        <!-- <uni-icons type="mic" size="30"></uni-icons> -->
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import Home from "@comp/home.vue";
import Chat from "@comp/chat.vue";
import HistoryList from "@comp/historyList.vue";
import { http } from "@/utils/request";

// 响应式状态
const inputContent = ref("");
const showSelector = ref(false);
const currentModel = ref("");
const modelOptions = ref([]);
const chatComp = ref(null);
const homeShow = ref(true);
// 常量数据
// let homeShow = true;

// 查看智能体列表
async function getBotsList() {
  const { code, data } = await http.get("coze/v1/space/published_bots_list", {
    space_id: "7478630827123933236",
  });
  if (code == 0) {
    modelOptions.value = data.space_bots.map((item) => ({
      label: item.bot_name,
      value: item.bot_id,
    }));
    currentModel.value = data.space_bots[0].bot_id;
  }
}
getBotsList();

// 计算属性
const currentModelLabel = computed(() => {
  const model = modelOptions.value.find((m) => m.value === currentModel.value);
  return model ? model.label : "";
});

// 方法
const toggleSelector = () => {
  showSelector.value = !showSelector.value;
};

const selectModel = (model) => {
  currentModel.value = model;
  showSelector.value = false;
};
function sendMessage() {
  if (!inputContent.value.trim()) {
    uni.showToast({
      title: "请输入内容",
      icon: "none",
    });
    return;
  }

  // 调用组件新建会话方法
  homeShow.value = false;
  
  nextTick(() => {
    chatComp.value.createChat();
  });
}

// 添加历史记录显示状态
const historyListShow = ref(false);

// 切换历史记录显示
const toggleHistory = () => {
  historyListShow.value = !historyListShow.value;
};

// 处理历史记录选择
const handleHistorySelect = (item) => {
  console.log("选中的历史记录：", item);
  historyListShow.value = false;
  // 这里可以添加处理选中历史记录的逻辑
};

// 添加触摸相关的变量
const touchStartX = ref(0);
const touchEndX = ref(0);

// 处理触摸开始
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
};

// 处理触摸结束
const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].clientX;
  const swipeDistance = touchEndX.value - touchStartX.value;

  // 如果右滑距离超过50，显示历史记录
  if (swipeDistance > 50) {
    historyListShow.value = true;
  }
};

// 生命周期钩子
onMounted(() => {
  // 点击其他区域关闭选择器
  // uni.onTouchStart(() => {
  //   if (showSelector.value) {
  //     showSelector.value = false;
  //   }
  // });
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #e6e9ff, #f3e6ff);
  padding: 20rpx;

  &.overflow-hidden {
    overflow: hidden;
    height: 100vh;
  }
}

.history-trigger {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40rpx;
  height: 100rpx;
  background: rgba(139, 127, 209, 0.1);
  border-radius: 0 20rpx 20rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;

  .trigger-icon {
    color: #8b7fd1;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.nav-bar {
  padding: 20rpx 0;
  display: flex;
  align-items: center;
}

.input-area {
  position: fixed;
  bottom: 40rpx;
  left: 20rpx;
  right: 20rpx;

  .model-selector {
    position: relative;
    margin-bottom: 20rpx;

    .selected-model {
      background: rgba(255, 255, 255, 0.9);
      padding: 12rpx 30rpx;
      border-radius: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10rpx;
      font-size: 24rpx;
      color: #8b7fd1;
      box-shadow: 0 2rpx 8rpx rgba(139, 127, 209, 0.1);

      .arrow {
        font-size: 20rpx;
        transition: transform 0.3s ease;

        &.arrow-up {
          transform: rotate(180deg);
        }
      }
    }

    .model-options {
      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 16rpx;
      padding: 10rpx;
      margin-bottom: 10rpx;
      box-shadow: 0 4rpx 16rpx rgba(139, 127, 209, 0.15);
      max-height: 400rpx;
      overflow-y: auto;

      .model-option {
        padding: 16rpx 30rpx;
        font-size: 24rpx;
        color: #666;
        border-radius: 8rpx;
        transition: all 0.2s ease;

        &.active {
          background: rgba(139, 127, 209, 0.1);
          color: #8b7fd1;
          font-weight: 500;
        }

        &:active {
          background: rgba(139, 127, 209, 0.15);
        }
      }
    }
  }

  .input-box {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 40rpx;
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 2rpx 8rpx rgba(139, 127, 209, 0.1);

    input {
      flex: 1;
      font-size: 28rpx;
    }

    .voice-icon {
      margin-left: 20rpx;
      font-size: 40rpx;
    }
  }
}

.input-placeholder {
  color: #999;
  font-size: 28rpx;
}
</style>
