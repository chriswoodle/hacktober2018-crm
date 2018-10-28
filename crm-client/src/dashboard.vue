<template>
    <div>
        <div class='uk-container small-section'>
      
          <vk-grid gutter="small" matched class="uk-child-width-1-3@m">
             <div>

               <vk-card class="uk-width-1-2@m">
  <div slot="header">
    <vk-grid gutter="small" class="uk-flex-middle">
      <div class="uk-width-auto">
         <img class="uk-border-circle" width="40" height="40"  :src="profile.image"/>
      </div>
      <div class="uk-width-expand">
        <vk-card-title class="uk-margin-remove-bottom">{{profile.fullName || '---'}}</vk-card-title>
        <p class="uk-text-meta uk-margin-remove-top">{{profile.email || '---'}}</p>
      </div>
    </vk-grid>
  </div>
  <div>
    <ul id="example-1">
  <li v-for="item of transciption">
     <p class="input">{{ item.input }}</p>
    <p class="type">{{ item.type }}</p>
    <p class="score">Score {{ item.score }}</p>
    <p class="magnitude">Magnitude {{ item.magnitude }}</p>
         <img width="250"  :src="item.giphyurl"/>


  </li>
</ul>
    <!-- {{transciption}} -->
  </div>
  <div slot="footer">
  </div>
</vk-card>

         
          </div>
            <div >
          <!-- <vk-card>
            <vk-card-title>Insurance Score</vk-card-title>
            <p>Lower is better</p>
            <vk-label>{{Math.round(rate * 100)}}</vk-label>
          </vk-card> -->
          </div>

          </vk-grid>
          
        </div>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import io from "socket.io-client";

// @ts-ignore
import VueC3 from "vue-c3";

const socket = io("http://localhost:3000");

console.log("init");

socket.on("connect", onConnect);

function onConnect() {
  console.log("connect " + socket.id);
}

import { host } from "./host";

import Vue from "vue";

export default Vue.extend({
  components: {},

  data: function(this: any) {
    // Subscribe to changes
    socket.on("message", message => {
      console.log(message);
    });

    socket.on("profile", profile => {
      console.log(profile);
      this.profile = profile;
    });
    socket.on("assist", assist => {
      console.log(assist);
      this.transciption.unshift(assist);
    });

    return {
      profile: {},
      transciption: []
    };
  }
});
</script>

<style lang="scss" scoped>
.small-section {
  margin-bottom: 10px;
}

p.input {
  color: black;
  margin-top: 20px;
}

.type,
.score,
.magnitude {
  font-size: 9px;
  margin-top: 2px;
  margin-bottom: 2px;

  color: #555;
}
</style>

<style lang="scss">
@import "c3.css";
</style>
