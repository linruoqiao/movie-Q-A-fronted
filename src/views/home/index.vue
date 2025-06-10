<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-left">CineMind</div>
      <div class="nav-right">
        <el-button type="text" class="nav-btn">登录</el-button>
        <el-button type="text" class="nav-btn">注册</el-button>
      </div>
    </nav>

    <!-- 弧形投影背景图 -->
    <div class="screen-wrapper">
      <div class="screen">
        <img
          class="screen-image"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/6863f6e8-d419-414d-b5b9-7ef657e67ce4/web/SG-en-20250602-TRIFECTA-perspective_ea140ba4-2af7-46ec-8389-f9661c08bc42_large.jpg"
          alt="Movie Background"
        />
      </div>
    </div>

    <!-- 舞台底座 -->
    <div class="stage"></div>

    <!-- 内容区域 -->
    <div class="content">
      <div class="text-box">
        <h1 class="title">电影问答助手</h1>
        <p class="subtitle">你的 AI 电影智囊 · 秒懂电影世界</p>
        <el-button class="start-btn" @click="goToChat">立即体验</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goToChat = () => {
  router.push('/chat')
}
</script>

<style scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  background-color: black;
  overflow: hidden;
  font-family: 'Orbitron', sans-serif;
  position: relative;
}

/* 顶部导航栏 */
.navbar {
  width: 100%;
  padding: 20px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: absolute;
  top: 0;
  z-index: 3;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
}

.nav-left {
  /* font-size: 26px;
  font-weight: bold;
  letter-spacing: 1.5px; */
  margin-left: 10px;
  font-size: 34px;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(45deg, #00f2fe, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-right .nav-btn {
  color: #fff;
  margin-left: 24px;
  font-weight: 500;
  font-size: 16px;
}
.nav-right .nav-btn:hover {
  color: #e50914;
}

/* 弧形银幕区域放宽并减少曲度 */
.screen {
  /* 原有样式保持不变 */
  width: 90%;
  height: 80vh;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7);
  background: black;

  /* 新增遮罩实现上下凹陷效果 */
  -webkit-mask-image: radial-gradient(
    ellipse at center,
    transparent 0%,
    black 20%,
    black 80%,
    transparent 100%
  );
  mask-image: radial-gradient(
    ellipse at center,
    transparent 0%,
    black 20%,
    black 80%,
    transparent 100%
  );
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
}

.screen-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8) saturate(1.1);
}

/* 舞台底座 */
.stage {
  width: 100%;
  height: 90px;
  background: radial-gradient(ellipse at center, #222 0%, #000 100%);
  border-top-left-radius: 50% 25%;
  border-top-right-radius: 50% 25%;
  margin-top: -40px;
  z-index: 1;
}

/* 内容文字居中覆盖在银幕中心 */
.content {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  text-align: center;
  color: white;
  width: 100%;
  padding: 0 40px;
}

.text-box {
  display: inline-block;
  max-width: 960px;
  padding: 40px 56px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
}

.title {
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 24px;
  margin-bottom: 36px;
  color: #e5e7eb;
  line-height: 1.6;
}

.start-btn {
  padding: 24px 40px;
  border-radius: 50px;
  font-size: 20px;
  background-color: #e50914;
  border: none;
  color: #fff;
  font-weight: bold;
  transition: all 0.3s ease;
}
.start-btn:hover {
  background-color: #f40612;
  transform: scale(1.05);
}
.screen-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
  position: relative;
}

.screen-wrapper::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 0, 0, 0.25) 0%,
    rgba(255, 0, 0, 0.1) 30%,
    rgba(255, 0, 0, 0) 60%
  );
  pointer-events: none;
  z-index: 0;
}
@keyframes rotateImage {
  0% {
    transform: rotate(0deg) scale(1.05);
  }
  100% {
    transform: rotate(360deg) scale(1.05);
  }
}

</style>
