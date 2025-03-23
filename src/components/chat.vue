<template>
  <view class="chat-container">
    <scroll-view
      class="chat-list"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      @scrolltoupper="loadMoreMessages"
    >
      <view class="chat-list-content">
        <view
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'message-item',
            message.type === 'send' ? 'message-send' : 'message-receive',
          ]"
        >
          <!-- 消息内容 -->
          <view class="message-content">
            <!-- 消息气泡 -->
            <!-- @longpress="showMessageActions(message, index)" -->
            <view class="message-bubble">
              <text class="message-text">{{ message.content }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>

  <!-- 消息操作菜单 -->
  <!-- <uni-popup ref="messageActionPopup" type="bottom">
    <view class="action-menu">
      <view class="action-item" @click="playVoice">
        <text class="action-icon">🔊</text>
        <text>语音播放</text>
      </view>
      <view class="action-item" @click="copyMessage">
        <text class="action-icon">📋</text>
        <text>复制</text>
      </view>
      <view class="action-item" @click="deleteMessage">
        <text class="action-icon">🗑️</text>
        <text>删除</text>
      </view>
      <view class="action-cancel" @click="closeActionMenu">
        <text>取消</text>
      </view>
    </view>
  </uni-popup> -->
</template>

<script setup>
import { ref, onMounted, defineExpose } from "vue";
import { formatDate } from "@/utils/date";
import { http } from "@/utils/request";

defineExpose({ createChat });
const emit = defineEmits(["sendSuccess"]);
const props = defineProps({
  inputContent: {
    type: String,
    default: "",
  },
  botId: {
    type: String,
    default: "",
  },
});

// 响应式状态
const scrollTop = ref(0);
const messages = ref([]);
const selectedMessage = ref(null);
const selectedIndex = ref(-1);
const conversation_id = ref("");

// 示例消息数据
const initMessages = () => {
  messages.value = [
    {
      type: "receive",
      content: "你好！我是AI助手，有什么我可以帮你的吗？",
    },
  ];
};

// 方法
async function createChat() {
  initMessages();
  const { code, data } = await http.post("/coze/v1/conversation/create");
  if (code == 0) {
    conversation_id.value = data.id;
    messages.value.push({
      type: "send",
      content: props.inputContent,
    });
    emit("sendSuccess");
    chat();
    return true;
  }
}
async function chat() {
  const payload = {
    additional_messages: [
      {
        content: messages.value[messages.value.length - 1].content,
        content_type: "text",
        role: "user",
      },
    ],
    bot_id: props.botId,
    user_id: "18348891588",
    auto_save_history: true,
    stream: true,
  };
  //TODO
  const response = await fetch(
    `/cozechat/v3/chat?conversation_id=${conversation_id.value}`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + store.authorization,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(payload),
    }
  );
}

const loadMoreMessages = () => {
  // 实现加载更多历史消息的逻辑
  console.log("加载更多消息");
};

const showMessageActions = (message, index) => {
  selectedMessage.value = message;
  selectedIndex.value = index;
  uni.showActionSheet({
    itemList: ["语音播放", "复制", "删除"],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          playVoice();
          break;
        case 1:
          copyMessage();
          break;
        case 2:
          deleteMessage();
          break;
      }
    },
  });
};

const playVoice = () => {
  // 实现语音播放逻辑
  console.log("播放语音", selectedMessage.value.content);
};

const copyMessage = () => {
  uni.setClipboardData({
    data: selectedMessage.value.content,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "success",
      });
    },
  });
};

const deleteMessage = () => {
  if (selectedIndex.value > -1) {
    messages.value.splice(selectedIndex.value, 1);
    uni.showToast({
      title: "删除成功",
      icon: "success",
    });
  }
};

const closeActionMenu = () => {
  // 实现关闭消息操作菜单的逻辑
  console.log("关闭消息操作菜单");
};
</script>

<style lang="scss" scoped>
.chat-container {
  height: calc(100vh - 240rpx);
  padding-bottom: 20rpx;
}

.chat-list {
  height: 100%;

  .chat-list-content {
    padding: 20rpx;
  }
}

.message-item {
  margin-bottom: 30rpx;

  .message-content {
    display: flex;
    align-items: flex-start;
  }
}

.message-send {
  .message-content {
    flex-direction: row-reverse;
  }

  .message-bubble {
    background: rgba(139, 127, 209, 0.1);
    margin-right: 20rpx;

    &::after {
      right: -16rpx;
      border-left-color: rgba(139, 127, 209, 0.1);
    }
  }
}

.message-receive {
  .message-bubble {
    background: rgba(255, 255, 255, 0.9);
    margin-left: 20rpx;

    &::after {
      left: -16rpx;
      border-right-color: rgba(255, 255, 255, 0.9);
    }
  }
}

.message-bubble {
  max-width: 60%;
  padding: 20rpx 24rpx;
  border-radius: 20rpx;
  position: relative;
  box-shadow: 0 2rpx 8rpx rgba(139, 127, 209, 0.05);

  &::after {
    content: "";
    position: absolute;
    top: 24rpx;
    border: 8rpx solid transparent;
  }

  .message-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
    word-break: break-all;
  }
}

.action-menu {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 20rpx;

  .action-item {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #333;
    border-bottom: 2rpx solid #f5f5f5;

    .action-icon {
      margin-right: 10rpx;
      font-size: 40rpx;
    }
  }

  .action-cancel {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #999;
    margin-top: 20rpx;
  }
}
</style>