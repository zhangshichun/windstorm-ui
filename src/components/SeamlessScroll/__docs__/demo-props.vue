<script setup>
import { ref } from 'vue';
import { SeamlessScroll } from 'windstorm-ui';
</script>

<template>
  <div>
    <SeamlessScroll class="the-demo-list" :delay="1" :duration="0.2">
      <div class="the-demo-list__item">1</div>
      <div class="the-demo-list__item">2</div>
      <div class="the-demo-list__item">3</div>
      <div class="the-demo-list__item">4</div>
      <div class="the-demo-list__item">5</div>
      <div class="the-demo-list__item">6</div>
      <div class="the-demo-list__item">7</div>
      <div class="the-demo-list__item">8</div>
    </SeamlessScroll>
  </div>
</template>

<style lang="scss">
.the-demo-list {
  height: 180px;

  &__item {
    height: 32px;
    font-size: 16px;
    line-height: 32px;
  }
}
</style>
